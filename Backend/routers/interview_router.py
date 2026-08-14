import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import fetch_one, fetch_all, execute_query
from auth import get_current_hr, get_current_user

router = APIRouter(prefix="/api", tags=["Interviews Management"])

# Inline Request Schema
class InterviewCreate(BaseModel):
    application_id: int
    scheduled_time: datetime.datetime
    meeting_link: Optional[str] = None
    notes: Optional[str] = None

@router.post("/hr/interviews")
def schedule_interview(
    data: InterviewCreate,
    current_hr: dict = Depends(get_current_hr)
):
    app = fetch_one("SELECT * FROM applications WHERE id = %s", (data.application_id,))
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = fetch_one("SELECT * FROM jobs WHERE id = %s AND hr_id = %s", (app["job_id"], current_hr["id"]))
    if not job:
        raise HTTPException(status_code=403, detail="Access denied")

    interview_id = execute_query(
        """
        INSERT INTO interviews (application_id, hr_id, user_id, scheduled_time, meeting_link, notes, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            data.application_id,
            current_hr["id"],
            app["user_id"],
            data.scheduled_time,
            data.meeting_link,
            data.notes,
            "Scheduled"
        )
    )

    # Automatically set application status to 'Interviewed'
    execute_query("UPDATE applications SET status = 'Interviewed' WHERE id = %s", (data.application_id,))

    # Send Notification to Candidate
    formatted_time = data.scheduled_time.strftime('%b %d, %Y at %I:%M %p') if hasattr(data.scheduled_time, 'strftime') else str(data.scheduled_time)
    execute_query(
        """
        INSERT INTO notifications (recipient_type, recipient_id, title, message)
        VALUES (%s, %s, %s, %s)
        """,
        (
            "user",
            app["user_id"],
            f"Interview Scheduled for {job['title']}",
            f"Your interview has been scheduled for {formatted_time}. Meeting Link: {data.meeting_link or 'Will be shared shortly'}"
        )
    )

    interview = fetch_one("SELECT * FROM interviews WHERE id = %s", (interview_id,))
    return {"message": "Interview scheduled successfully", "interview": interview}

@router.get("/hr/interviews")
def get_hr_interviews(current_hr: dict = Depends(get_current_hr)):
    sql = """
        SELECT i.*, j.id as job_id, j.title as job_title, u.name as candidate_name, u.email as candidate_email
        FROM interviews i
        LEFT JOIN applications a ON i.application_id = a.id
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN users u ON i.user_id = u.id
        WHERE i.hr_id = %s
        ORDER BY i.scheduled_time ASC
    """
    interviews = fetch_all(sql, (current_hr["id"],))
    results = []
    for item in interviews:
        results.append({
            "id": item["id"],
            "application_id": item["application_id"],
            "job_id": item.get("job_id"),
            "job_title": item.get("job_title") or "N/A",
            "candidate_name": item.get("candidate_name") or "Candidate",
            "candidate_email": item.get("candidate_email") or "",
            "scheduled_time": item.get("scheduled_time"),
            "meeting_link": item.get("meeting_link"),
            "status": item["status"],
            "notes": item.get("notes")
        })
    return results

@router.get("/user/interviews")
def get_user_interviews(current_user: dict = Depends(get_current_user)):
    sql = """
        SELECT i.*, j.title as job_title, h.company_name, h.name as recruiter_name
        FROM interviews i
        LEFT JOIN applications a ON i.application_id = a.id
        LEFT JOIN jobs j ON a.job_id = j.id
        LEFT JOIN hr h ON i.hr_id = h.id
        WHERE i.user_id = %s
        ORDER BY i.scheduled_time ASC
    """
    interviews = fetch_all(sql, (current_user["id"],))
    results = []
    for item in interviews:
        results.append({
            "id": item["id"],
            "job_title": item.get("job_title") or "N/A",
            "company_name": item.get("company_name") or "Company",
            "recruiter_name": item.get("recruiter_name") or "HR",
            "scheduled_time": item.get("scheduled_time"),
            "meeting_link": item.get("meeting_link"),
            "status": item["status"],
            "notes": item.get("notes")
        })
    return results
