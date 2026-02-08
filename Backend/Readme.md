# Calabash (Knowledge) — Backend

The backend of **Calabash (Knowledge)** powers a university-focused digital library that enables students and lecturers to securely upload, organize, and access academic materials such as lecture notes, PDFs, and past questions.

This service is built as a **RESTful API** designed to be scalable, secure, and frontend-agnostic.

---

## 🧠 Backend Overview

The backend handles:

- User authentication and role-based access control
- Academic structure management (departments, courses, semesters)
- Uploading and retrieval of academic materials
- Past questions management
- Secure file access and permissions
- API services consumed by the frontend application

---

## 🎯 Core Responsibilities

- Authenticate users (Students, Lecturers, Admins)
- Enforce role-based authorization
- Organize materials by course and semester
- Provide secure, structured API endpoints
- Store metadata and handle file uploads
- Serve data efficiently to the frontend

---

## 🧩 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based permissions (Student / Lecturer / Admin)
- Secure login and protected endpoints

### Academic Structure
- Departments
- Courses
- Levels & semesters
- Lecturer-course assignment

### Materials Management
- Upload lecture materials (PDFs)
- Associate files with courses and semesters
- Version control for updated materials (future)
- Secure file access

### Past Questions
- Upload past questions by session and course
- Structured retrieval by students
- Read-only access for students

---

## 🛠️ Technology Stack

- **Language:** Python
- **Framework:** Django
- **API:** Django REST Framework (DRF)
- **Authentication:** JWT
- **Database:** PostgreSQL
- **File Storage:** Cloud storage (AWS S3 / Cloudinary)
- **Environment Management:** `.env` variables
