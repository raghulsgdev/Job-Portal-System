import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserRegisterSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str
    phone: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None

class HRRegisterSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str
    phone: Optional[str] = None
    company_name: str = Field(..., min_length=2)
    company_role: Optional[str] = "Recruiter"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_type: str  # 'user' or 'hr'
    user: dict

# --- User & Profile Schemas ---
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

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- HR & Company Schemas ---
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

class HROut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    company_name: str
    company_role: str
    profile_img: Optional[str] = None

    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobCreateUpdate(BaseModel):
    title: str
    description: str
    requirements: str
    job_type: str = "Full-time"  # Full-time, Part-time, Contract, Remote, Internship
    location: str
    salary_min: float = 0.00
    salary_max: float = 0.00
    experience_level: str = "Mid-level" # Entry-level, Mid-level, Senior-level, Lead / Executive
    category: str = "Engineering"
    status: str = "Active"

class JobOut(BaseModel):
    id: int
    hr_id: int
    company_id: Optional[int] = None
    title: str
    description: str
    requirements: str
    job_type: str
    location: str
    salary_min: float
    salary_max: float
    experience_level: str
    category: str
    status: str
    created_at: datetime.datetime
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    applied: Optional[bool] = False
    saved: Optional[bool] = False

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str # Pending, Interviewed, Accepted, Rejected

class ApplicationOut(BaseModel):
    id: int
    job_id: int
    user_id: int
    status: str
    cover_letter: Optional[str] = None
    applied_at: datetime.datetime
    job: Optional[dict] = None
    applicant: Optional[dict] = None

    class Config:
        from_attributes = True

# --- Interview Schemas ---
class InterviewCreate(BaseModel):
    application_id: int
    scheduled_time: datetime.datetime
    meeting_link: Optional[str] = None
    notes: Optional[str] = None

class InterviewOut(BaseModel):
    id: int
    application_id: int
    hr_id: int
    user_id: int
    scheduled_time: datetime.datetime
    meeting_link: Optional[str] = None
    status: str
    notes: Optional[str] = None
    job_title: Optional[str] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    recipient_type: str
    recipient_id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True