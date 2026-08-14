from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from database import fetch_one, fetch_all, execute_query
from auth import get_current_user, get_current_hr, decode_token, oauth2_scheme

router = APIRouter(prefix="/api", tags=["Jobs & Applications"])

# Inline Request Schemas
class JobCreateUpdate(BaseModel):
    title: str
    description: str
    requirements: str
    job_type: str = "Full-time"
    location: str
    salary_min: float = 0.00
    salary_max: float = 0.00
    experience_level: str = "Mid-level"
    category: str = "Engineering"
    status: str = "Active"

class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None

def get_optional_user_id(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[int]:
    if not token:
        return None
    try:
        payload = decode_token(token)
        if payload.get("role") == "user":
            return int(payload.get("sub"))
    except Exception:
        pass
    return None

# --- Public & Candidate Job Browsing ---

@router.get("/jobs")
def get_jobs(
    query: Optional[str] = Query(None, description="Search term in title or description"),
    location: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    min_salary: Optional[float] = Query(None),
    user_id: Optional[int] = Depends(get_optional_user_id)
):
    sql = """
        SELECT j.*, 
               COALESCE(c.name, h.company_name, 'Company') AS company_name, 
               c.logo AS company_logo
        FROM jobs j
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE j.status = 'Active'
    """
    params = []

    if query:
        search_pattern = f"%{query}%"
        sql += " AND (j.title LIKE %s OR j.description LIKE %s OR j.requirements LIKE %s)"
        params.extend([search_pattern, search_pattern, search_pattern])

    if location and location.strip():
        sql += " AND j.location LIKE %s"
        params.append(f"%{location.strip()}%")

    if category and category.strip() and category != "All":
        sql += " AND j.category = %s"
        params.append(category)

    if job_type and job_type.strip() and job_type != "All":
        sql += " AND j.job_type = %s"
        params.append(job_type)

    if experience_level and experience_level.strip() and experience_level != "All":
        sql += " AND j.experience_level = %s"
        params.append(experience_level)

    if min_salary and min_salary > 0:
        sql += " AND j.salary_max >= %s"
        params.append(min_salary)

    sql += " ORDER BY j.created_at DESC"

    jobs = fetch_all(sql, tuple(params))

    # User saved & applied lookup maps
    applied_job_ids = set()
    saved_job_ids = set()
    if user_id:
        apps = fetch_all("SELECT job_id FROM applications WHERE user_id = %s", (user_id,))
        applied_job_ids = {a["job_id"] for a in apps}
        saves = fetch_all("SELECT job_id FROM saved_jobs WHERE user_id = %s", (user_id,))
        saved_job_ids = {s["job_id"] for s in saves}

    results = []
    for job in jobs:
        results.append({
            "id": job["id"],
            "hr_id": job["hr_id"],
            "company_id": job.get("company_id"),
            "title": job["title"],
            "description": job["description"],
            "requirements": job["requirements"],
            "job_type": job["job_type"],
            "location": job["location"],
            "salary_min": float(job.get("salary_min") or 0),
            "salary_max": float(job.get("salary_max") or 0),
            "experience_level": job["experience_level"],
            "category": job["category"],
            "status": job["status"],
            "created_at": job.get("created_at"),
            "company_name": job.get("company_name"),
            "company_logo": job.get("company_logo"),
            "applied": job["id"] in applied_job_ids,
            "saved": job["id"] in saved_job_ids
        })
    return results

@router.get("/jobs/{job_id}")
def get_job_detail(
    job_id: int,
    user_id: Optional[int] = Depends(get_optional_user_id)
):
    sql = """
        SELECT j.*, 
               COALESCE(c.name, h.company_name, 'Company') AS company_name, 
               c.logo AS company_logo,
               c.description AS company_description,
               c.website AS company_website
        FROM jobs j
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE j.id = %s
    """
    job = fetch_one(sql, (job_id,))
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")

    applied = False
    saved = False
    if user_id:
        app_entry = fetch_one("SELECT id FROM applications WHERE user_id = %s AND job_id = %s", (user_id, job_id))
        applied = app_entry is not None
        save_entry = fetch_one("SELECT id FROM saved_jobs WHERE user_id = %s AND job_id = %s", (user_id, job_id))
        saved = save_entry is not None

    return {
        "id": job["id"],
        "hr_id": job["hr_id"],
        "company_id": job.get("company_id"),
        "title": job["title"],
        "description": job["description"],
        "requirements": job["requirements"],
        "job_type": job["job_type"],
        "location": job["location"],
        "salary_min": float(job.get("salary_min") or 0),
        "salary_max": float(job.get("salary_max") or 0),
        "experience_level": job["experience_level"],
        "category": job["category"],
        "status": job["status"],
        "created_at": job.get("created_at"),
        "company_name": job.get("company_name"),
        "company_logo": job.get("company_logo"),
        "company_description": job.get("company_description"),
        "company_website": job.get("company_website"),
        "applied": applied,
        "saved": saved
    }

# --- Candidate Apply & Save ---

@router.post("/jobs/{job_id}/apply")
def apply_job(
    job_id: int,
    data: ApplicationCreate,
    current_user: dict = Depends(get_current_user)
):
    job = fetch_one("SELECT * FROM jobs WHERE id = %s AND status = 'Active'", (job_id,))
    if not job:
        raise HTTPException(status_code=404, detail="Active job not found")

    existing_app = fetch_one(
        "SELECT id FROM applications WHERE job_id = %s AND user_id = %s",
        (job_id, current_user["id"])
    )

    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    app_id = execute_query(
        """
        INSERT INTO applications (job_id, user_id, status, cover_letter)
        VALUES (%s, %s, %s, %s)
        """,
        (job_id, current_user["id"], "Pending", data.cover_letter)
    )

    # Notify HR
    execute_query(
        """
        INSERT INTO notifications (recipient_type, recipient_id, title, message)
        VALUES (%s, %s, %s, %s)
        """,
        ("hr", job["hr_id"], "New Application Received", f"{current_user['name']} applied for '{job['title']}'.")
    )

    return {"message": "Application submitted successfully", "application_id": app_id}

@router.post("/jobs/{job_id}/save")
def save_job(
    job_id: int,
    current_user: dict = Depends(get_current_user)
):
    job = fetch_one("SELECT id FROM jobs WHERE id = %s", (job_id,))
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    saved = fetch_one("SELECT id FROM saved_jobs WHERE user_id = %s AND job_id = %s", (current_user["id"], job_id))
    if saved:
        return {"message": "Job is already saved"}

    execute_query(
        "INSERT INTO saved_jobs (user_id, job_id) VALUES (%s, %s)",
        (current_user["id"], job_id)
    )

    return {"message": "Job saved successfully"}

@router.delete("/jobs/{job_id}/unsave")
def unsave_job(
    job_id: int,
    current_user: dict = Depends(get_current_user)
):
    saved = fetch_one("SELECT id FROM saved_jobs WHERE user_id = %s AND job_id = %s", (current_user["id"], job_id))
    if not saved:
        raise HTTPException(status_code=404, detail="Saved job not found")

    execute_query("DELETE FROM saved_jobs WHERE id = %s", (saved["id"],))
    return {"message": "Job unsaved successfully"}

@router.get("/user/saved-jobs")
def get_user_saved_jobs(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT s.id as saved_id, s.saved_at, j.*,
               COALESCE(c.name, h.company_name, 'Company') AS company_name
        FROM saved_jobs s
        JOIN jobs j ON s.job_id = j.id
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE s.user_id = %s
        ORDER BY s.saved_at DESC
    """
    saved_entries = fetch_all(sql, (current_user["id"],))
    results = []
    for s in saved_entries:
        results.append({
            "saved_id": s["saved_id"],
            "saved_at": s.get("saved_at"),
            "job": {
                "id": s["id"],
                "title": s["title"],
                "location": s["location"],
                "job_type": s["job_type"],
                "salary_min": float(s.get("salary_min") or 0),
                "salary_max": float(s.get("salary_max") or 0),
                "category": s["category"],
                "experience_level": s["experience_level"],
                "company_name": s["company_name"],
                "created_at": s.get("created_at")
            }
        })
    return results

@router.get("/user/applications")
def get_user_applications(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT a.id, a.status, a.cover_letter, a.applied_at, j.id as job_id, j.title as job_title,
               j.location as job_location, j.job_type as job_type, j.salary_min, j.salary_max,
               COALESCE(c.name, h.company_name, 'Company') AS company_name
        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE a.user_id = %s
        ORDER BY a.applied_at DESC
    """
    applications = fetch_all(sql, (current_user["id"],))
    results = []
    for app in applications:
        results.append({
            "id": app["id"],
            "status": app["status"],
            "cover_letter": app.get("cover_letter"),
            "applied_at": app.get("applied_at"),
            "job": {
                "id": app.get("job_id"),
                "title": app.get("job_title") or "Position Closed",
                "location": app.get("job_location") or "",
                "job_type": app.get("job_type") or "",
                "salary_min": float(app.get("salary_min") or 0),
                "salary_max": float(app.get("salary_max") or 0),
                "company_name": app.get("company_name") or "Company"
            }
        })
    return results

# --- HR Job Management ---

@router.post("/hr/create-job")
def create_job(
    data: JobCreateUpdate,
    current_hr: dict = Depends(get_current_hr)
):
    company = fetch_one("SELECT id FROM company WHERE hr_id = %s", (current_hr["id"],))
    company_id = company["id"] if company else None

    job_id = execute_query(
        """
        INSERT INTO jobs (hr_id, company_id, title, description, requirements, job_type, location, salary_min, salary_max, experience_level, category, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            current_hr["id"],
            company_id,
            data.title,
            data.description,
            data.requirements,
            data.job_type,
            data.location,
            data.salary_min,
            data.salary_max,
            data.experience_level,
            data.category,
            data.status or "Active"
        )
    )

    new_job = fetch_one("SELECT * FROM jobs WHERE id = %s", (job_id,))
    return {"message": "Job created successfully", "job": new_job}

@router.get("/hr/jobs")
def get_hr_jobs(current_hr: dict = Depends(get_current_hr)):
    jobs = fetch_all("SELECT * FROM jobs WHERE hr_id = %s ORDER BY created_at DESC", (current_hr["id"],))
    results = []
    for j in jobs:
        cnt_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE job_id = %s", (j["id"],))
        applicant_count = cnt_res["cnt"] if cnt_res else 0

        results.append({
            "id": j["id"],
            "title": j["title"],
            "description": j["description"],
            "requirements": j["requirements"],
            "job_type": j["job_type"],
            "location": j["location"],
            "salary_min": float(j.get("salary_min") or 0),
            "salary_max": float(j.get("salary_max") or 0),
            "experience_level": j["experience_level"],
            "category": j["category"],
            "status": j["status"],
            "created_at": j.get("created_at"),
            "applicant_count": applicant_count
        })
    return results

@router.put("/hr/update-job/{job_id}")
def update_job(
    job_id: int,
    data: JobCreateUpdate,
    current_hr: dict = Depends(get_current_hr)
):
    job = fetch_one("SELECT id FROM jobs WHERE id = %s AND hr_id = %s", (job_id, current_hr["id"]))
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or access denied")

    execute_query(
        """
        UPDATE jobs 
        SET title = %s, description = %s, requirements = %s, job_type = %s, location = %s, 
            salary_min = %s, salary_max = %s, experience_level = %s, category = %s, status = %s
        WHERE id = %s
        """,
        (
            data.title,
            data.description,
            data.requirements,
            data.job_type,
            data.location,
            data.salary_min,
            data.salary_max,
            data.experience_level,
            data.category,
            data.status,
            job_id
        )
    )

    updated_job = fetch_one("SELECT * FROM jobs WHERE id = %s", (job_id,))
    return {"message": "Job updated successfully", "job": updated_job}

@router.delete("/hr/delete-job/{job_id}")
def delete_job(
    job_id: int,
    current_hr: dict = Depends(get_current_hr)
):
    job = fetch_one("SELECT id FROM jobs WHERE id = %s AND hr_id = %s", (job_id, current_hr["id"]))
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or access denied")

    execute_query("DELETE FROM jobs WHERE id = %s", (job_id,))
    return {"message": "Job deleted successfully"}
