import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel, Field
from database import fetch_one, fetch_all, execute_query
from auth import get_current_user, verify_password, hash_password
from config import settings

router = APIRouter(prefix="/api/user", tags=["User Profile"])

# Inline Request Schemas
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None

class SkillCreate(BaseModel):
    skill_name: str

class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_year: int
    end_year: Optional[int] = None

class ExperienceCreate(BaseModel):
    company: str
    title: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = "Present"
    description: Optional[str] = None

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str

@router.get("/profile")
def get_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    skills = fetch_all(
        """
        SELECT s.id, s.name 
        FROM skills s 
        JOIN user_skills us ON s.id = us.skill_id 
        WHERE us.user_id = %s
        """,
        (user_id,)
    )
    education = fetch_all("SELECT * FROM education WHERE user_id = %s", (user_id,))
    experience = fetch_all("SELECT * FROM experience WHERE user_id = %s", (user_id,))

    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user.get("phone"),
        "headline": current_user.get("headline"),
        "bio": current_user.get("bio"),
        "resume_url": current_user.get("resume_url"),
        "location": current_user.get("location"),
        "created_at": current_user.get("created_at"),
        "skills": skills,
        "education": education,
        "experience": experience
    }

@router.put("/profile")
def update_user_profile(
    data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    
    name = data.name if data.name is not None else current_user["name"]
    phone = data.phone if data.phone is not None else current_user.get("phone")
    headline = data.headline if data.headline is not None else current_user.get("headline")
    bio = data.bio if data.bio is not None else current_user.get("bio")
    location = data.location if data.location is not None else current_user.get("location")

    execute_query(
        """
        UPDATE users 
        SET name = %s, phone = %s, headline = %s, bio = %s, location = %s 
        WHERE id = %s
        """,
        (name, phone, headline, bio, location, user_id)
    )
    
    updated_user = fetch_one("SELECT * FROM users WHERE id = %s", (user_id,))
    return {"message": "Profile updated successfully", "user": updated_user}

@router.post("/change-password")
def change_password(
    data: ChangePasswordSchema,
    current_user: dict = Depends(get_current_user)
):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")
    if not verify_password(data.current_password, current_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    new_hash = hash_password(data.new_password)
    execute_query("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, current_user["id"]))
    return {"message": "Password changed successfully"}

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    allowed_extensions = [".pdf", ".docx"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF and DOCX files are allowed."
        )

    resumes_dir = os.path.join(settings.UPLOAD_DIR, "resumes")
    os.makedirs(resumes_dir, exist_ok=True)

    filename = f"user_{current_user['id']}_{uuid.uuid4().hex[:8]}{file_ext}"
    filepath = os.path.join(resumes_dir, filename)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    relative_url = f"/uploads/resumes/{filename}"
    execute_query("UPDATE users SET resume_url = %s WHERE id = %s", (relative_url, current_user["id"]))

    return {
        "message": "Resume uploaded successfully",
        "resume_url": relative_url
    }

# --- Skills Management ---
@router.post("/skills")
def add_skill(data: SkillCreate, current_user: dict = Depends(get_current_user)):
    skill_name = data.skill_name.strip()
    if not skill_name:
        raise HTTPException(status_code=400, detail="Skill name cannot be empty")

    skill = fetch_one("SELECT * FROM skills WHERE LOWER(name) = LOWER(%s)", (skill_name,))
    if not skill:
        skill_id = execute_query("INSERT INTO skills (name) VALUES (%s)", (skill_name,))
        skill = {"id": skill_id, "name": skill_name}

    user_skill = fetch_one(
        "SELECT * FROM user_skills WHERE user_id = %s AND skill_id = %s",
        (current_user["id"], skill["id"])
    )

    if not user_skill:
        execute_query(
            "INSERT INTO user_skills (user_id, skill_id) VALUES (%s, %s)",
            (current_user["id"], skill["id"])
        )

    return {"message": "Skill added", "skill": {"id": skill["id"], "name": skill["name"]}}

@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: int, current_user: dict = Depends(get_current_user)):
    user_skill = fetch_one(
        "SELECT * FROM user_skills WHERE user_id = %s AND skill_id = %s",
        (current_user["id"], skill_id)
    )
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found for user")

    execute_query("DELETE FROM user_skills WHERE id = %s", (user_skill["id"],))
    return {"message": "Skill removed successfully"}

# --- Education Management ---
@router.post("/education")
def add_education(data: EducationCreate, current_user: dict = Depends(get_current_user)):
    edu_id = execute_query(
        """
        INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (current_user["id"], data.institution, data.degree, data.field_of_study, data.start_year, data.end_year)
    )
    edu = fetch_one("SELECT * FROM education WHERE id = %s", (edu_id,))
    return {"message": "Education added successfully", "education": edu}

@router.delete("/education/{education_id}")
def remove_education(education_id: int, current_user: dict = Depends(get_current_user)):
    edu = fetch_one(
        "SELECT * FROM education WHERE id = %s AND user_id = %s",
        (education_id, current_user["id"])
    )
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    
    execute_query("DELETE FROM education WHERE id = %s", (education_id,))
    return {"message": "Education record deleted successfully"}

# --- Experience Management ---
@router.post("/experience")
def add_experience(data: ExperienceCreate, current_user: dict = Depends(get_current_user)):
    exp_id = execute_query(
        """
        INSERT INTO experience (user_id, company, title, location, start_date, end_date, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (current_user["id"], data.company, data.title, data.location, data.start_date, data.end_date, data.description)
    )
    exp = fetch_one("SELECT * FROM experience WHERE id = %s", (exp_id,))
    return {"message": "Experience added successfully", "experience": exp}

@router.delete("/experience/{experience_id}")
def remove_experience(experience_id: int, current_user: dict = Depends(get_current_user)):
    exp = fetch_one(
        "SELECT * FROM experience WHERE id = %s AND user_id = %s",
        (experience_id, current_user["id"])
    )
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")
    
    execute_query("DELETE FROM experience WHERE id = %s", (experience_id,))
    return {"message": "Experience record deleted successfully"}
