-- Seed Data for Job Portal System

USE job_portal;

-- Disable Foreign Key checks temporarily for clean seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE interviews;
TRUNCATE TABLE user_skills;
TRUNCATE TABLE skills;
TRUNCATE TABLE experience;
TRUNCATE TABLE education;
TRUNCATE TABLE saved_jobs;
TRUNCATE TABLE applications;
TRUNCATE TABLE jobs;
TRUNCATE TABLE company;
TRUNCATE TABLE password_reset_tokens;
TRUNCATE TABLE notifications;
TRUNCATE TABLE hr;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Sample Candidates (Users)
-- Password for all default accounts is: password123
INSERT INTO users (id, name, email, password_hash, phone, headline, bio, location, resume_url) VALUES
(1, 'Alex Rivera', 'candidate@example.com', '$2b$12$EETnujhUpfY4/pzbdb.Mzut3.bo.UgwLFzZQ4gv8tfsrbJOoVA96C', '+1 (555) 234-5678', 'Senior Full Stack Developer (React & Python)', 'Passionate web developer with 5+ years of experience constructing scalable cloud web applications and REST APIs.', 'San Francisco, CA', '/uploads/resumes/sample_resume_alex.pdf'),
(2, 'Sarah Jenkins', 'sarah.j@example.com', '$2b$12$EETnujhUpfY4/pzbdb.Mzut3.bo.UgwLFzZQ4gv8tfsrbJOoVA96C', '+1 (555) 876-5432', 'UI/UX & Frontend Designer', 'Designing intuitive digital product experiences with high-level visual design and modern CSS interaction frameworks.', 'New York, NY', '/uploads/resumes/sample_resume_sarah.pdf'),
(3, 'Michael Chen', 'michael.chen@example.com', '$2b$12$EETnujhUpfY4/pzbdb.Mzut3.bo.UgwLFzZQ4gv8tfsrbJOoVA96C', '+1 (555) 432-1098', 'DevOps & Cloud Engineer', 'Kubernetes, Docker, AWS Specialist focusing on microservice optimization and CI/CD pipelines.', 'Austin, TX', '/uploads/resumes/sample_resume_michael.pdf');

-- 2. Insert Sample HRs
INSERT INTO hr (id, name, email, password_hash, phone, company_name, company_role) VALUES
(1, 'Elena Rostova', 'hr@techcorp.com', '$2b$12$EETnujhUpfY4/pzbdb.Mzut3.bo.UgwLFzZQ4gv8tfsrbJOoVA96C', '+1 (555) 999-1122', 'TechCorp Systems', 'Head of Talent Acquisition'),
(2, 'David Miller', 'david@innovatelabs.io', '$2b$12$EETnujhUpfY4/pzbdb.Mzut3.bo.UgwLFzZQ4gv8tfsrbJOoVA96C', '+1 (555) 888-3344', 'Innovate Labs', 'Senior Technical Recruiter');

-- 3. Insert Companies
INSERT INTO company (id, hr_id, name, logo, website, location, description) VALUES
(1, 1, 'TechCorp Systems', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150', 'https://techcorp.example.com', 'San Francisco, CA', 'Leading enterprise software platform innovating AI solutions and scalable web architecture.'),
(2, 2, 'Innovate Labs', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150', 'https://innovatelabs.io', 'Austin, TX', 'Next-gen fintech startup delivering seamless payment processing infrastructure.');

-- 4. Insert Job Postings
INSERT INTO jobs (id, hr_id, company_id, title, description, requirements, job_type, location, salary_min, salary_max, experience_level, category, status) VALUES
(1, 1, 1, 'Senior Full Stack Engineer', 'We are looking for a Senior Full Stack Engineer proficient in React and Python FastAPI to join our core platform team. You will architect robust services, design responsive UIs, and manage microservices backend deployments.', '• 5+ years with React.js & Python\n• Deep understanding of SQL databases (MySQL/PostgreSQL)\n• Strong experience building REST APIs\n• Experience with modern containerization (Docker, K8s)', 'Full-time', 'San Francisco, CA', 135000.00, 175000.00, 'Senior-level', 'Engineering', 'Active'),
(2, 1, 1, 'Lead UI/UX Frontend Architect', 'Join TechCorp Systems as a Lead UI/UX Frontend Architect! You will lead design systems and code pixel-perfect responsive micro-frontends with high performance.', '• 6+ years React experience\n• Expert in custom CSS, animations, and responsive layouts\n• Proven portfolio of clean web application visual design', 'Full-time', 'Remote', 120000.00, 160000.00, 'Lead / Executive', 'Design', 'Active'),
(3, 2, 2, 'Backend Python Developer', 'Innovate Labs is scaling fast and searching for a sharp Python Developer (FastAPI / Django) to build real-time transaction processing APIs.', '• 3+ years experience with FastAPI or Flask\n• Strong SQLAlchemy and database optimization skills\n• Passion for writing unit tests and clean code', 'Full-time', 'Austin, TX', 105000.00, 140000.00, 'Mid-level', 'Engineering', 'Active'),
(4, 2, 2, 'DevOps Cloud Specialist', 'Seeking a DevOps engineer to automate our deployment pipelines and manage multi-region AWS cloud infrastructure.', '• Hands-on Experience with AWS, Terraform, Docker\n• Strong shell scripting and security awareness', 'Contract', 'Remote', 90000.00, 130000.00, 'Mid-level', 'DevOps', 'Active'),
(5, 1, 1, 'Junior Web Developer', 'Kickstart your developer career with our vibrant engineering team! Great mentorship opportunity working on client dashboards.', '• Proficiency in HTML, CSS, JavaScript & React\n• Familiarity with Git version control', 'Full-time', 'San Francisco, CA', 70000.00, 90000.00, 'Entry-level', 'Engineering', 'Active');

-- 5. Insert Skills
INSERT INTO skills (id, name) VALUES
(1, 'React.js'), (2, 'Python'), (3, 'FastAPI'), (4, 'SQLAlchemy'), (5, 'MySQL'),
(6, 'JavaScript'), (7, 'CSS3'), (8, 'Docker'), (9, 'AWS'), (10, 'Figma');

-- 6. Insert User Skills
INSERT INTO user_skills (user_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 6), (2, 7), (2, 10),
(3, 2), (3, 8), (3, 9), (3, 5);

-- 7. Insert Education
INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year) VALUES
(1, 'University of California, Berkeley', 'Bachelor of Science', 'Computer Science', 2016, 2020),
(2, 'New York University', 'Bachelor of Fine Arts', 'Digital Media & Design', 2017, 2021),
(3, 'University of Texas at Austin', 'Bachelor of Science', 'Software Engineering', 2015, 2019);

-- 8. Insert Experience
INSERT INTO experience (user_id, company, title, location, start_date, end_date, description) VALUES
(1, 'CloudScale Inc.', 'Full Stack Software Engineer', 'San Francisco, CA', '2021-01', 'Present', 'Engineered full-stack features using React and FastAPI backend microservices.'),
(2, 'Creative Studio X', 'Frontend Web Developer', 'New York, NY', '2021-06', 'Present', 'Designed and developed high-impact web interfaces with custom CSS animations.'),
(3, 'DataStream LLC', 'Cloud Operations Specialist', 'Austin, TX', '2019-08', '2022-12', 'Managed AWS infrastructure and automated CI/CD deployment pipelines.');

-- 9. Insert Applications
INSERT INTO applications (id, job_id, user_id, status, cover_letter, applied_at) VALUES
(1, 1, 1, 'Interviewed', 'I am very excited about the Senior Full Stack Engineer role at TechCorp. With over 5 years of hands-on experience building scalable applications with React and Python FastAPI, I am confident I can make an immediate impact.', '2026-07-28 10:30:00'),
(2, 3, 1, 'Pending', 'I am eager to apply my FastAPI and database optimization skills to Innovate Labs backend financial systems.', '2026-07-29 14:15:00'),
(3, 2, 2, 'Accepted', 'As a dedicated UI/UX architect, I would love to lead design systems and component engineering at TechCorp.', '2026-07-25 09:00:00'),
(4, 4, 3, 'Pending', 'My DevOps background and expertise with AWS and Docker make me a ideal fit for this position.', '2026-07-30 16:45:00');

-- 10. Insert Saved Jobs
INSERT INTO saved_jobs (user_id, job_id) VALUES
(1, 2),
(1, 3),
(2, 1);

-- 11. Insert Notifications
INSERT INTO notifications (recipient_type, recipient_id, title, message, is_read) VALUES
('user', 1, 'Interview Scheduled', 'Your interview for Senior Full Stack Engineer at TechCorp Systems has been scheduled.', 0),
('user', 2, 'Application Status Update', 'Congratulations! Your application for Lead UI/UX Frontend Architect has been accepted.', 1),
('hr', 1, 'New Candidate Application', 'Alex Rivera has submitted an application for Senior Full Stack Engineer.', 0);

-- 12. Insert Interviews
INSERT INTO interviews (id, application_id, hr_id, user_id, scheduled_time, meeting_link, status, notes) VALUES
(1, 1, 1, 1, '2026-08-05 14:00:00', 'https://meet.google.com/abc-defg-hij', 'Scheduled', 'Technical architecture discussion & deep-dive into React and FastAPI projects.');
