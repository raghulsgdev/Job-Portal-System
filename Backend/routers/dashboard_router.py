from fastapi import APIRouter, Depends
from database import fetch_one, fetch_all
from auth import get_current_user, get_current_hr

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Analytics"])

@router.get("/user")
def get_user_dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    total_apps_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE user_id = %s", (user_id,))
    total_applications = total_apps_res["cnt"] if total_apps_res else 0

    saved_jobs_res = fetch_one("SELECT COUNT(*) as cnt FROM saved_jobs WHERE user_id = %s", (user_id,))
    saved_jobs = saved_jobs_res["cnt"] if saved_jobs_res else 0

    interviews_res = fetch_one("SELECT COUNT(*) as cnt FROM interviews WHERE user_id = %s", (user_id,))
    interviews = interviews_res["cnt"] if interviews_res else 0

    accepted_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE user_id = %s AND status = 'Accepted'", (user_id,))
    accepted = accepted_res["cnt"] if accepted_res else 0

    pending_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE user_id = %s AND status = 'Pending'", (user_id,))
    pending_cnt = pending_res["cnt"] if pending_res else 0

    interviewed_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE user_id = %s AND status = 'Interviewed'", (user_id,))
    interviewed_cnt = interviewed_res["cnt"] if interviewed_res else 0

    rejected_res = fetch_one("SELECT COUNT(*) as cnt FROM applications WHERE user_id = %s AND status = 'Rejected'", (user_id,))
    rejected_cnt = rejected_res["cnt"] if rejected_res else 0

    # Recent Applications
    sql_recent = """
        SELECT a.id, a.status, a.applied_at as date, j.title as job_title, 
               COALESCE(c.name, h.company_name, 'Company') as company_name
        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE a.user_id = %s
        ORDER BY a.applied_at DESC
        LIMIT 5
    """
    recent_activity = fetch_all(sql_recent, (user_id,))

    # Recommended Jobs
    sql_rec = """
        SELECT j.id, j.title, j.location, j.salary_max, j.job_type, j.category,
               COALESCE(c.name, h.company_name, 'Company') as company_name
        FROM jobs j
        LEFT JOIN company c ON j.company_id = c.id
        LEFT JOIN hr h ON j.hr_id = h.id
        WHERE j.status = 'Active'
        ORDER BY j.created_at DESC
        LIMIT 4
    """
    latest_jobs = fetch_all(sql_rec)
    recommended = []
    for j in latest_jobs:
        recommended.append({
            "id": j["id"],
            "title": j["title"],
            "company_name": j["company_name"],
            "location": j["location"],
            "salary_max": float(j.get("salary_max") or 0),
            "job_type": j["job_type"],
            "category": j["category"]
        })

    return {
        "metrics": {
            "total_applications": total_applications,
            "saved_jobs": saved_jobs,
            "interviews_scheduled": interviews,
            "accepted_offers": accepted
        },
        "status_chart": [
            {"name": "Pending", "count": pending_cnt, "color": "#F59E0B"},
            {"name": "Interviewed", "count": interviewed_cnt, "color": "#3B82F6"},
            {"name": "Accepted", "count": accepted, "color": "#10B981"},
            {"name": "Rejected", "count": rejected_cnt, "color": "#EF4444"}
        ],
        "recent_applications": recent_activity,
        "recommended_jobs": recommended
    }

@router.get("/hr")
def get_hr_dashboard_stats(current_hr: dict = Depends(get_current_hr)):
    hr_id = current_hr["id"]

    total_jobs_res = fetch_one("SELECT COUNT(*) as cnt FROM jobs WHERE hr_id = %s", (hr_id,))
    total_jobs = total_jobs_res["cnt"] if total_jobs_res else 0

    active_jobs_res = fetch_one("SELECT COUNT(*) as cnt FROM jobs WHERE hr_id = %s AND status = 'Active'", (hr_id,))
    active_jobs = active_jobs_res["cnt"] if active_jobs_res else 0

    candidates_res = fetch_one(
        """
        SELECT COUNT(*) as cnt 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        WHERE j.hr_id = %s
        """,
        (hr_id,)
    )
    total_candidates = candidates_res["cnt"] if candidates_res else 0

    interviews_res = fetch_one("SELECT COUNT(*) as cnt FROM interviews WHERE hr_id = %s", (hr_id,))
    interviews = interviews_res["cnt"] if interviews_res else 0

    hired_res = fetch_one(
        """
        SELECT COUNT(*) as cnt 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        WHERE j.hr_id = %s AND a.status = 'Accepted'
        """,
        (hr_id,)
    )
    hired = hired_res["cnt"] if hired_res else 0

    # Recent Candidates
    sql_recent_cand = """
        SELECT a.id as application_id, a.status, a.applied_at,
               u.name as candidate_name, u.email as candidate_email,
               j.title as job_title
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.user_id = u.id
        WHERE j.hr_id = %s
        ORDER BY a.applied_at DESC
        LIMIT 5
    """
    recent_candidates = fetch_all(sql_recent_cand, (hr_id,))

    return {
        "metrics": {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_candidates": total_candidates,
            "interviews_scheduled": interviews,
            "hired_candidates": hired
        },
        "recent_candidates": recent_candidates
    }
