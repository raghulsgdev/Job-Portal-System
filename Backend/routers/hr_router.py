from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from database import fetch_one, fetch_all, execute_query
from auth import get_current_hr, verify_password, hash_password

router = APIRouter(prefix="/api/hr", tags=["HR & Recruiter Management"])

# Inline Request Schemas
class HRProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    company_role: Optional[str] = None
    profile_img: Optional[str] = None

class CompanyCreateUpdate(BaseModel):
    name: str
    logo: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str  # Pending, Interviewed, Accepted, Rejected

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str

@router.get("/profile")
def get_hr_profile(current_hr: dict = Depends(get_current_hr)):
    company = fetch_one("SELECT * FROM company WHERE hr_id = %s", (current_hr["id"],))
    return {
        "id": current_hr["id"],
        "name": current_hr["name"],
        "email": current_hr["email"],
        "phone": current_hr.get("phone"),
        "company_name": current_hr["company_name"],
        "company_role": current_hr.get("company_role"),
        "profile_img": current_hr.get("profile_img"),
        "company": company
    }

@router.put("/profile")
def update_hr_profile(
    data: HRProfileUpdate,
    current_hr: dict = Depends(get_current_hr)
):
    hr_id = current_hr["id"]
    name = data.name if data.name is not None else current_hr["name"]
    phone = data.phone if data.phone is not None else current_hr.get("phone")
    company_name = data.company_name if data.company_name is not None else current_hr["company_name"]
    company_role = data.company_role if data.company_role is not None else current_hr.get("company_role")
    profile_img = data.profile_img if data.profile_img is not None else current_hr.get("profile_img")

    execute_query(
        """
        UPDATE hr 
        SET name = %s, phone = %s, company_name = %s, company_role = %s, profile_img = %s 
        WHERE id = %s
        """,
        (name, phone, company_name, company_role, profile_img, hr_id)
    )

    updated_hr = fetch_one("SELECT * FROM hr WHERE id = %s", (hr_id,))
    return {"message": "HR Profile updated", "hr": updated_hr}

@router.post("/change-password")
def change_hr_password(
    data: ChangePasswordSchema,
    current_hr: dict = Depends(get_current_hr)
):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")
    if not verify_password(data.current_password, current_hr["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    new_hash = hash_password(data.new_password)
    execute_query("UPDATE hr SET password_hash = %s WHERE id = %s", (new_hash, current_hr["id"]))
    return {"message": "HR Password changed successfully"}

@router.get("/company")
def get_company(current_hr: dict = Depends(get_current_hr)):
    company = fetch_one("SELECT * FROM company WHERE hr_id = %s", (current_hr["id"],))
    if not company:
        comp_id = execute_query(
            """
            INSERT INTO company (hr_id, name, description) 
            VALUES (%s, %s, %s)
            """,
            (current_hr["id"], current_hr["company_name"], "Leading software engineering organization.")
        )
        company = fetch_one("SELECT * FROM company WHERE id = %s", (comp_id,))
    return company

@router.post("/company")
def update_company(
    data: CompanyCreateUpdate,
    current_hr: dict = Depends(get_current_hr)
):
    company = fetch_one("SELECT * FROM company WHERE hr_id = %s", (current_hr["id"],))
    if not company:
        comp_id = execute_query(
            """
            INSERT INTO company (hr_id, name, logo, website, location, description) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (current_hr["id"], data.name, data.logo, data.website, data.location, data.description)
        )
        company = fetch_one("SELECT * FROM company WHERE id = %s", (comp_id,))
    else:
        name = data.name if data.name is not None else company["name"]
        logo = data.logo if data.logo is not None else company.get("logo")
        website = data.website if data.website is not None else company.get("website")
        location = data.location if data.location is not None else company.get("location")
        description = data.description if data.description is not None else company.get("description")

        execute_query(
            """
            UPDATE company 
            SET name = %s, logo = %s, website = %s, location = %s, description = %s 
            WHERE id = %s
            """,
            (name, logo, website, location, description, company["id"])
        )
        company = fetch_one("SELECT * FROM company WHERE id = %s", (company["id"],))

    return {"message": "Company details updated successfully", "company": company}

# --- Applicants Review ---
@router.get("/applicants/{job_id}")
def get_job_applicants(
    job_id: int,
    current_hr: dict = Depends(get_current_hr)
):
    job = fetch_one("SELECT * FROM jobs WHERE id = %s AND hr_id = %s", (job_id, current_hr["id"]))
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or access denied")

    applications = fetch_all("SELECT * FROM applications WHERE job_id = %s", (job_id,))
    results = []
    for app in applications:
        user = fetch_one("SELECT * FROM users WHERE id = %s", (app["user_id"],))
        results.append({
            "id": app["id"],
            "job_id": app["job_id"],
            "job_title": job["title"],
            "user_id": app["user_id"],
            "status": app["status"],
            "cover_letter": app.get("cover_letter"),
            "applied_at": app.get("applied_at"),
            "applicant": {
                "id": user["id"] if user else None,
                "name": user["name"] if user else "Unknown User",
                "email": user["email"] if user else "",
                "phone": user.get("phone") if user else "",
                "headline": user.get("headline") if user else "",
                "location": user.get("location") if user else "",
                "resume_url": user.get("resume_url") if user else None
            }
        })
    return results

@router.put("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    current_hr: dict = Depends(get_current_hr)
):
    app = fetch_one("SELECT * FROM applications WHERE id = %s", (application_id,))
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = fetch_one("SELECT * FROM jobs WHERE id = %s AND hr_id = %s", (app["job_id"], current_hr["id"]))
    if not job:
        raise HTTPException(status_code=403, detail="Access denied")

    valid_statuses = ["Pending", "Interviewed", "Accepted", "Rejected"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    execute_query("UPDATE applications SET status = %s WHERE id = %s", (data.status, application_id))

    # Create notification for candidate
    execute_query(
        """
        INSERT INTO notifications (recipient_type, recipient_id, title, message)
        VALUES (%s, %s, %s, %s)
        """,
        (
            "user",
            app["user_id"],
            f"Application Update: {job['title']}",
            f"Your application status for '{job['title']}' has been updated to {data.status}."
        )
    )

    return {"message": "Application status updated", "status": data.status}

# --- HR Employees (Accepted candidates roster) ---
@router.get("/employees")
def get_hr_employees(current_hr: dict = Depends(get_current_hr)):
    accepted_apps = fetch_all(
        """
        SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.resume_url as user_resume_url,
               j.title as job_title, j.category as job_category
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.user_id = u.id
        WHERE j.hr_id = %s AND a.status = 'Accepted'
        """,
        (current_hr["id"],)
    )

    employees = []
    for app in accepted_apps:
        employees.append({
            "application_id": app["id"],
            "user_id": app["user_id"],
            "name": app["user_name"],
            "email": app["user_email"],
            "phone": app["user_phone"],
            "job_title": app["job_title"],
            "category": app["job_category"],
            "hire_date": app.get("updated_at"),
            "resume_url": app.get("user_resume_url")
        })
    return employees
