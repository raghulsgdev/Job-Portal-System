-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: job_portal
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hr_id` int NOT NULL,
  `company_id` int DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `requirements` text NOT NULL,
  `job_type` enum('Full-time','Part-time','Contract','Remote','Internship') NOT NULL DEFAULT 'Full-time',
  `location` varchar(150) NOT NULL,
  `salary_min` decimal(10,2) DEFAULT '0.00',
  `salary_max` decimal(10,2) DEFAULT '0.00',
  `experience_level` enum('Entry-level','Mid-level','Senior-level','Lead / Executive') NOT NULL DEFAULT 'Mid-level',
  `category` varchar(100) NOT NULL DEFAULT 'Engineering',
  `status` enum('Active','Closed','Draft') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hr_id` (`hr_id`),
  KEY `company_id` (`company_id`),
  KEY `idx_jobs_category` (`category`),
  KEY `idx_jobs_location` (`location`),
  KEY `idx_jobs_type` (`job_type`),
  KEY `idx_jobs_status` (`status`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`hr_id`) REFERENCES `hr` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,1,'Senior Full Stack Engineer','We are looking for a Senior Full Stack Engineer proficient in React and Python FastAPI to join our core platform team. You will architect robust services, design responsive UIs, and manage microservices backend deployments.','• 5+ years with React.js & Python\n• Deep understanding of SQL databases (MySQL/PostgreSQL)\n• Strong experience building REST APIs\n• Experience with modern containerization (Docker, K8s)','Full-time','San Francisco, CA',135000.00,175000.00,'Senior-level','Engineering','Active','2026-08-11 06:55:24','2026-08-11 06:55:24'),(2,1,1,'Lead UI/UX Frontend Architect','Join TechCorp Systems as a Lead UI/UX Frontend Architect! You will lead design systems and code pixel-perfect responsive micro-frontends with high performance.','• 6+ years React experience\n• Expert in custom CSS, animations, and responsive layouts\n• Proven portfolio of clean web application visual design','Full-time','Remote',120000.00,160000.00,'Lead / Executive','Design','Active','2026-08-11 06:55:24','2026-08-11 06:55:24'),(3,2,2,'Backend Python Developer','Innovate Labs is scaling fast and searching for a sharp Python Developer (FastAPI / Django) to build real-time transaction processing APIs.','• 3+ years experience with FastAPI or Flask\n• Strong SQLAlchemy and database optimization skills\n• Passion for writing unit tests and clean code','Full-time','Austin, TX',105000.00,140000.00,'Mid-level','Engineering','Active','2026-08-11 06:55:24','2026-08-11 06:55:24'),(4,2,2,'DevOps Cloud Specialist','Seeking a DevOps engineer to automate our deployment pipelines and manage multi-region AWS cloud infrastructure.','• Hands-on Experience with AWS, Terraform, Docker\n• Strong shell scripting and security awareness','Contract','Remote',90000.00,130000.00,'Mid-level','DevOps','Active','2026-08-11 06:55:24','2026-08-11 06:55:24'),(5,1,1,'Junior Web Developer','Kickstart your developer career with our vibrant engineering team! Great mentorship opportunity working on client dashboards.','• Proficiency in HTML, CSS, JavaScript & React\n• Familiarity with Git version control','Full-time','San Francisco, CA',70000.00,90000.00,'Entry-level','Engineering','Active','2026-08-11 06:55:24','2026-08-11 06:55:24'),(6,3,NULL,'Full Stack Developer','We\'re looking for Entry-Level Full Stack Developer.','React, Python, FastAPI and MySQL','Full-time','Coimbatore',200000.00,400000.00,'Entry-level','Engineering','Active','2026-08-11 07:34:10','2026-08-11 07:34:10');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-14 15:18:15
