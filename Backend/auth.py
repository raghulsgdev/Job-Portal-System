import datetime
from typing import Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config import settings
from database import fetch_one

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(12)
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using bcrypt."""
    pw_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pw_bytes, hashed_bytes)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "token_type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    role = payload.get("role")
    user_id = payload.get("sub")
    if role != "user" or not user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. User role required.")
    
    user = fetch_one("SELECT * FROM users WHERE id = %s", (int(user_id),))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")
    return user

def get_current_hr(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    role = payload.get("role")
    hr_id = payload.get("sub")
    if role != "hr" or not hr_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. HR role required.")
    
    hr_user = fetch_one("SELECT * FROM hr WHERE id = %s", (int(hr_id),))
    if not hr_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HR account not found")
    return hr_user