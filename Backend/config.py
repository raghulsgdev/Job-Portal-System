import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Job Portal System API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_jwt_key_job_portal_2026_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MySQL connection configuration
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "password")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "job_portal")

    UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "uploads")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
