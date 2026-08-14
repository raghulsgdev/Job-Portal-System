-- Job Portal System Database Schema
-- SQL Database Creation Script for MySQL Workbench

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS saved_jobs;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS hr;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Candidates)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    headline VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    resume_url VARCHAR(255) DEFAULT NULL,
    location VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. HR Table (Recruiters / Employers)
CREATE TABLE hr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    company_name VARCHAR(150) NOT NULL,
    company_role VARCHAR(100) DEFAULT 'Recruiter',
    profile_img VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hr_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Company Table
CREATE TABLE company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hr_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hr_id) REFERENCES hr(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Jobs Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hr_id INT NOT NULL,
    company_id INT DEFAULT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    job_type ENUM('Full-time', 'Part-time', 'Contract', 'Remote', 'Internship') NOT NULL DEFAULT 'Full-time',
    location VARCHAR(150) NOT NULL,
    salary_min DECIMAL(10,2) DEFAULT 0.00,
    salary_max DECIMAL(10,2) DEFAULT 0.00,
    experience_level ENUM('Entry-level', 'Mid-level', 'Senior-level', 'Lead / Executive') NOT NULL DEFAULT 'Mid-level',
    category VARCHAR(100) NOT NULL DEFAULT 'Engineering',
    status ENUM('Active', 'Closed', 'Draft') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hr_id) REFERENCES hr(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE SET NULL,
    INDEX idx_jobs_category (category),
    INDEX idx_jobs_location (location),
    INDEX idx_jobs_type (job_type),
    INDEX idx_jobs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Applications Table
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('Pending', 'Interviewed', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    cover_letter TEXT DEFAULT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_job_application (user_id, job_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_user (user_id),
    INDEX idx_app_job (job_id),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Saved Jobs Table
CREATE TABLE saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_saved_job (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type ENUM('user', 'hr') NOT NULL,
    recipient_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_recipient (recipient_type, recipient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('user', 'hr') NOT NULL,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. User Skills Table
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    UNIQUE KEY unique_user_skill (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Education Table
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    start_year INT NOT NULL,
    end_year INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Experience Table
CREATE TABLE experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    location VARCHAR(100) DEFAULT NULL,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) DEFAULT 'Present',
    description TEXT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Interviews Table
CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    hr_id INT NOT NULL,
    user_id INT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    meeting_link VARCHAR(255) DEFAULT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (hr_id) REFERENCES hr(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
