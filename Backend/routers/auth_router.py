import secrets
import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from database import fetch_one, execute_query
from auth import hash_password, verify_password, create_access_token, create_refresh_token

router = APIRouter(prefix="/api", tags=["Authentication"])

# Inline Request Schemas
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

# --- User Auth ---

@router.post("/user/register")
def user_register(data: UserRegisterSchema):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    existing_user = fetch_one("SELECT * FROM users WHERE email = %s", (data.email,))
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(data.password)
    user_id = execute_query(
        """
        INSERT INTO users (name, email, password_hash, phone, headline, location)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (data.name, data.email, hashed_pwd, data.phone, data.headline, data.location)
    )
    
    new_user = fetch_one("SELECT * FROM users WHERE id = %s", (user_id,))

    access_token = create_access_token({"sub": str(new_user["id"]), "role": "user"})
    refresh_token = create_refresh_token({"sub": str(new_user["id"]), "role": "user"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_type": "user",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "headline": new_user.get("headline"),
            "resume_url": new_user.get("resume_url")
        }
    }

@router.post("/user/login")
def user_login(data: LoginSchema):
    user = fetch_one("SELECT * FROM users WHERE email = %s", (data.email,))
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(user["id"]), "role": "user"})
    refresh_token = create_refresh_token({"sub": str(user["id"]), "role": "user"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_type": "user",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "headline": user.get("headline"),
            "resume_url": user.get("resume_url")
        }
    }

@router.post("/user/forgot-password")
def user_forgot_password(data: ForgotPasswordSchema):
    user = fetch_one("SELECT * FROM users WHERE email = %s", (data.email,))
    if not user:
        return {"message": "If email is registered, a password reset link has been sent."}
    
    reset_token = secrets.token_urlsafe(32)
    expires = datetime.datetime.now() + datetime.timedelta(hours=1)
    
    execute_query(
        """
        INSERT INTO password_reset_tokens (user_type, user_id, token, expires_at)
        VALUES (%s, %s, %s, %s)
        """,
        ("user", user["id"], reset_token, expires)
    )

    return {
        "message": "Password reset token generated successfully",
        "reset_token": reset_token
    }

@router.post("/user/reset-password")
def user_reset_password(data: ResetPasswordSchema):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    token_entry = fetch_one(
        "SELECT * FROM password_reset_tokens WHERE token = %s AND user_type = %s",
        (data.token, "user")
    )

    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    expires_at = token_entry["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.datetime.fromisoformat(expires_at)
        
    if expires_at < datetime.datetime.now():
        raise HTTPException(status_code=400, detail="Expired reset token")
    
    user = fetch_one("SELECT * FROM users WHERE id = %s", (token_entry["user_id"],))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_hash = hash_password(data.new_password)
    execute_query("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, user["id"]))
    execute_query("DELETE FROM password_reset_tokens WHERE id = %s", (token_entry["id"],))

    return {"message": "Password successfully reset. Please log in with your new password."}


# --- HR Auth ---

@router.post("/hr/register")
def hr_register(data: HRRegisterSchema):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_hr = fetch_one("SELECT * FROM hr WHERE email = %s", (data.email,))
    if existing_hr:
        raise HTTPException(status_code=400, detail="HR Email already registered")

    hashed_pwd = hash_password(data.password)
    hr_id = execute_query(
        """
        INSERT INTO hr (name, email, password_hash, phone, company_name, company_role)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (data.name, data.email, hashed_pwd, data.phone, data.company_name, data.company_role or "Recruiter")
    )
    
    new_hr = fetch_one("SELECT * FROM hr WHERE id = %s", (hr_id,))

    access_token = create_access_token({"sub": str(new_hr["id"]), "role": "hr"})
    refresh_token = create_refresh_token({"sub": str(new_hr["id"]), "role": "hr"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_type": "hr",
        "user": {
            "id": new_hr["id"],
            "name": new_hr["name"],
            "email": new_hr["email"],
            "company_name": new_hr["company_name"],
            "company_role": new_hr.get("company_role")
        }
    }

@router.post("/hr/login")
def hr_login(data: LoginSchema):
    hr_user = fetch_one("SELECT * FROM hr WHERE email = %s", (data.email,))
    if not hr_user or not verify_password(data.password, hr_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(hr_user["id"]), "role": "hr"})
    refresh_token = create_refresh_token({"sub": str(hr_user["id"]), "role": "hr"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_type": "hr",
        "user": {
            "id": hr_user["id"],
            "name": hr_user["name"],
            "email": hr_user["email"],
            "company_name": hr_user["company_name"],
            "company_role": hr_user.get("company_role")
        }
    }

@router.post("/hr/forgot-password")
@router.post("/admin/forgot-password")
def hr_forgot_password(data: ForgotPasswordSchema):
    hr_user = fetch_one("SELECT * FROM hr WHERE email = %s", (data.email,))
    if not hr_user:
        return {"message": "If email is registered, a password reset link has been sent."}

    reset_token = secrets.token_urlsafe(32)
    expires = datetime.datetime.now() + datetime.timedelta(hours=1)

    execute_query(
        """
        INSERT INTO password_reset_tokens (user_type, user_id, token, expires_at)
        VALUES (%s, %s, %s, %s)
        """,
        ("hr", hr_user["id"], reset_token, expires)
    )

    return {
        "message": "HR/Admin Password reset token generated successfully",
        "reset_token": reset_token
    }

@router.post("/hr/reset-password")
@router.post("/admin/reset-password")
def hr_reset_password(data: ResetPasswordSchema):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    token_entry = fetch_one(
        "SELECT * FROM password_reset_tokens WHERE token = %s AND user_type = %s",
        (data.token, "hr")
    )

    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    expires_at = token_entry["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.datetime.fromisoformat(expires_at)
        
    if expires_at < datetime.datetime.now():
        raise HTTPException(status_code=400, detail="Expired reset token")

    hr_user = fetch_one("SELECT * FROM hr WHERE id = %s", (token_entry["user_id"],))
    if not hr_user:
        raise HTTPException(status_code=404, detail="HR/Admin user not found")

    new_hash = hash_password(data.new_password)
    execute_query("UPDATE hr SET password_hash = %s WHERE id = %s", (new_hash, hr_user["id"]))
    execute_query("DELETE FROM password_reset_tokens WHERE id = %s", (token_entry["id"],))

    return {"message": "HR/Admin password successfully reset."}
