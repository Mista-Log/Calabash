# Calabash API Reference for Backend Engineers

> **Version:** 1.0.0  
> **Last Updated:** March 3, 2025  
> **Base URL:** `/api`  
> **Authentication:** Bearer Token (JWT)

This document provides a complete reference for all API endpoints needed by the Calabash frontend. Each endpoint includes HTTP method, URL, purpose, request/response structures, Django model mappings, and real example data from our mock dataset.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Courses](#courses)
5. [Materials](#materials)
6. [Notes](#notes)
7. [Dashboard](#dashboard)
8. [Gamification](#gamification)
9. [Error Handling](#error-handling)
10. [Appendix](#appendix)

---

## Overview

### Base URL
```
Development: http://localhost:8000/api
Production: https://api.calabash.edu.ng/api
```

### Authentication
All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <jwt-token>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "timestamp": "2025-03-03T10:00:00Z",
  "requestId": "req-abc123"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["This field is required"]
    }
  },
  "timestamp": "2025-03-03T10:00:00Z",
  "requestId": "req-abc123"
}
```

### Date Format
All dates must be in **ISO 8601 format**: `2025-03-03T10:00:00Z`

### Field Naming
- **Django (Backend):** snake_case (e.g., `upload_date`)
- **API Response:** camelCase (e.g., `uploadDate`)
- **Use Django REST Framework serializers** to transform field names

---

## Authentication

### 1. Login

**Endpoint:** `POST /api/auth/login/`

**Purpose:** Authenticate user and return JWT tokens

**Request Body:**
```json
{
  "email": "amina@student.unilag.edu.ng",
  "password": "securepassword123",
  "rememberMe": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-student-01",
      "name": "Amina Idris",
      "username": "amina.idris",
      "email": "amina@student.unilag.edu.ng",
      "role": "student",
      "department": "Computer Science",
      "semester": 2,
      "isNewUser": false,
      "bio": "Passionate software developer interested in AI and machine learning.",
      "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-03-03T11:00:00Z"
  }
}
```

**Django Models:** `account.models.User`

**Serializer Example:**
```python
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    rememberMe = serializers.BooleanField(required=False, default=False)
    
    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user
```

---

### 2. Signup

**Endpoint:** `POST /api/auth/signup/`

**Purpose:** Register a new user account

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "student",
  "department": "Computer Science",
  "semester": 2
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-student-02",
      "name": "John Doe",
      "email": "student@example.com",
      "role": "student",
      "department": "Computer Science",
      "semester": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "requiresVerification": false
  }
}
```

**Django Models:** `account.models.User` + `account.models.Student` or `account.models.Lecturer`

---

### 3. Logout

**Endpoint:** `POST /api/auth/logout/`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### 4. Password Reset Request

**Endpoint:** `POST /api/auth/password-reset/`

**Request Body:**
```json
{
  "email": "amina@student.unilag.edu.ng"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

---

### 5. Password Reset Confirm

**Endpoint:** `POST /api/auth/password-reset-confirm/`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## Users

### 1. Get Current User

**Endpoint:** `GET /api/users/me/`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "u-student-01",
    "name": "Amina Idris",
    "username": "amina.idris",
    "email": "amina@student.unilag.edu.ng",
    "role": "student",
    "department": "Computer Science",
    "semester": 2,
    "isNewUser": false,
    "bio": "Passionate software developer interested in AI and machine learning.",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
  }
}
```

**Django Models:** `account.models.User` + related profile

**Serializer Notes:**
```python
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='student_profile.username', read_only=True)
    department = serializers.CharField(source='student_profile.department', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'role', 'department', 'semester', 'isNewUser', 'bio', 'avatarUrl']
```

---

### 2. Get User by ID

**Endpoint:** `GET /api/users/:userId/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "u-lecturer-01",
    "name": "Dr. Chioma Okonkwo",
    "username": "c.okonkwo",
    "email": "chioma.okonkwo@unilag.edu.ng",
    "role": "lecturer",
    "department": "Computer Science",
    "bio": "Senior Lecturer specializing in Algorithms and Data Structures.",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma"
  }
}
```

---

### 3. Update User Profile

**Endpoint:** `PUT /api/users/me/`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Amina Idris",
  "bio": "Updated bio text",
  "department": "Computer Science",
  "semester": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "u-student-01",
    "name": "Amina Idris",
    "bio": "Updated bio text",
    "department": "Computer Science",
    "semester": 3,
    // ... full user object
  }
}
```

---

## Courses

### 1. List Courses

**Endpoint:** `GET /api/courses/`

**Query Parameters:**
- `semester` (optional): Filter by semester number
- `department` (optional): Filter by department

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "c-csc201",
        "code": "CSC 201",
        "title": "Data Structures & Algorithms",
        "semester": 2,
        "description": "Fundamental data structures and algorithms including arrays, linked lists, trees, graphs, sorting and searching algorithms.",
        "lecturerName": "Dr. Chioma Okonkwo",
        "color": "#4F46E5",
        "enrollment": 420,
        "materialCount": 15
      },
      {
        "id": "c-csc202",
        "code": "CSC 202",
        "title": "Computer Architecture",
        "semester": 2,
        "description": "Organization and design of computer systems. Covers CPU architecture, memory hierarchy, pipelining, and input/output systems.",
        "lecturerName": "Prof. Adebayo Williams",
        "color": "#059669",
        "enrollment": 380,
        "materialCount": 12
      },
      {
        "id": "c-csc203",
        "code": "CSC 203",
        "title": "Database Management Systems",
        "semester": 2,
        "description": "Introduction to database systems, ER modeling, relational algebra, SQL, normalization, and transaction management.",
        "lecturerName": "Dr. Chioma Okonkwo",
        "color": "#DC2626",
        "enrollment": 350,
        "materialCount": 10
      }
    ],
    "total": 3
  }
}
```

**Django Models:** `courses.models.Course`

**Business Logic:**
- **Students:** Return courses for their semester/department
- **Lecturers:** Return courses they teach

**Serializer Notes:**
```python
class CourseSerializer(serializers.ModelSerializer):
    lecturerName = serializers.CharField(source='lecturer.user.full_name', read_only=True)
    materialCount = serializers.IntegerField(source='materials.count', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'title', 'semester', 'description', 'lecturerName', 'color', 'enrollment', 'materialCount']
```

---

### 2. Get Course Details

**Endpoint:** `GET /api/courses/:courseId/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "c-csc201",
    "code": "CSC 201",
    "title": "Data Structures & Algorithms",
    "semester": 2,
    "description": "Fundamental data structures and algorithms including arrays, linked lists, trees, graphs, sorting and searching algorithms.",
    "studentCount": 420,
    "materialCount": 15,
    "lecturer": {
      "name": "Dr. Chioma Okonkwo",
      "role": "Senior Lecturer",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma"
    },
    "stats": {
      "rating": 4.7,
      "totalRatings": 156,
      "duration": "12 weeks"
    },
    "youtubeUrl": "https://www.youtube.com/embed/kPRA0W1kECg",
    "supplements": [
      {
        "id": "sup-001",
        "title": "Study Guide 2025",
        "courseCode": "CSC 201",
        "type": "pdf",
        "uploadDate": "2025-02-10T10:00:00Z",
        "url": "/media/materials/csc201/study-guide.pdf",
        "uploader": "Dr. Chioma Okonkwo",
        "size": "1.2 MB",
        "visibility": "public"
      }
    ],
    "modules": [
      {
        "id": "mod-001",
        "title": "Module 1: Introduction to Data Structures",
        "order": 1,
        "materials": [
          {
            "id": "m-001",
            "title": "Introduction to Binary Trees",
            "courseCode": "CSC 201",
            "type": "pdf",
            "uploadDate": "2025-02-28T10:00:00Z",
            "url": "/media/materials/csc201/binary-trees.pdf",
            "uploader": "Dr. Chioma Okonkwo",
            "size": "2.4 MB"
          }
        ]
      },
      {
        "id": "mod-002",
        "title": "Module 2: Video Lectures",
        "order": 2,
        "materials": [
          {
            "id": "m-002",
            "title": "Sorting Algorithms Visualization",
            "courseCode": "CSC 201",
            "type": "video",
            "uploadDate": "2025-02-27T14:30:00Z",
            "url": "https://www.youtube.com/embed/kPRA0W1kECg",
            "youtubeUrl": "https://www.youtube.com/watch?v=kPRA0W1kECg",
            "uploader": "Dr. Chioma Okonkwo",
            "duration": "15:42"
          }
        ]
      }
    ],
    "recentActivity": [
      {
        "id": "act-001",
        "type": "upload",
        "description": "Uploaded 'Introduction to Binary Trees'",
        "date": "2025-02-28T10:00:00Z"
      },
      {
        "id": "act-002",
        "type": "view",
        "description": "45 students viewed 'Sorting Algorithms Visualization'",
        "date": "2025-02-27T16:00:00Z"
      }
    ]
  }
}
```

**Django Models:** `courses.models.Course`, `courses.models.CourseMaterial`

**Notes:**
- `modules`: Can return all materials and let frontend group them, OR create a Module model
- `recentActivity`: Generate from material uploads, views, comments
- `supplements`: Return first 2-6 materials

---

### 3. Create Course

**Endpoint:** `POST /api/courses/`

**Permission:** Lecturers/Admin only

**Request Body:**
```json
{
  "code": "CSC 301",
  "title": "Advanced Algorithms",
  "description": "Advanced algorithm design and analysis",
  "semester": 3,
  "department": "Computer Science",
  "level": "300",
  "color": "#4F46E5"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "c-csc301",
    "code": "CSC 301",
    "title": "Advanced Algorithms",
    "semester": 3,
    "description": "Advanced algorithm design and analysis",
    "enrollment": 0,
    "materialCount": 0
  }
}
```

---

### 4. Update Course

**Endpoint:** `PUT /api/courses/:courseId/`

**Request Body:** (same fields as Create)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "c-csc301",
    "code": "CSC 301",
    "title": "Advanced Algorithms",
    // ... full course object
  }
}
```

---

### 5. Delete Course

**Endpoint:** `DELETE /api/courses/:courseId/`

**Response (204 No Content)**

---

## Materials

### 1. List Materials

**Endpoint:** `GET /api/materials/`

**Query Parameters:**
- `courseId` (optional): Filter by course ID
- `courseCode` (optional): Filter by course code
- `type` (optional): Filter by type (pdf, video, etc.)
- `semester` (optional): Filter by semester
- `search` (optional): Search in title

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "m-001",
        "title": "Introduction to Binary Trees",
        "courseCode": "CSC 201",
        "courseId": "c-csc201",
        "type": "pdf",
        "semester": 2,
        "uploadDate": "2025-02-28T10:00:00Z",
        "url": "/media/materials/csc201/binary-trees.pdf",
        "uploader": "Dr. Chioma Okonkwo",
        "ownerAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
        "size": "2.4 MB",
        "downloads": 120,
        "likes": 45,
        "visibility": "public",
        "lastEditedAt": "2025-03-01T08:00:00Z"
      },
      {
        "id": "m-002",
        "title": "Sorting Algorithms Visualization",
        "courseCode": "CSC 201",
        "courseId": "c-csc201",
        "type": "video",
        "semester": 2,
        "uploadDate": "2025-02-27T14:30:00Z",
        "url": "https://www.youtube.com/embed/kPRA0W1kECg",
        "youtubeUrl": "https://www.youtube.com/watch?v=kPRA0W1kECg",
        "uploader": "Dr. Chioma Okonkwo",
        "ownerAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
        "size": "Streaming",
        "duration": "15:42",
        "downloads": 89,
        "likes": 38,
        "visibility": "public"
      }
    ],
    "total": 10
  }
}
```

**Django Models:** `courses.models.CourseMaterial`

**Serializer Notes:**
```python
class MaterialSerializer(serializers.ModelSerializer):
    courseCode = serializers.CharField(source='course.code', read_only=True)
    courseId = serializers.CharField(source='course.id', read_only=True)
    uploadDate = serializers.DateTimeField(source='upload_at', read_only=True)
    uploader = serializers.CharField(source='uploader.user.full_name', read_only=True)
    ownerAvatar = serializers.SerializerMethodField()
    
    def get_ownerAvatar(self, obj):
        if obj.uploader and obj.uploader.user.avatar_url:
            return obj.uploader.user.avatar_url
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.uploader.user.full_name}"
    
    class Meta:
        model = CourseMaterial
        fields = [
            'id', 'title', 'courseCode', 'courseId', 'type', 'semester',
            'uploadDate', 'url', 'uploader', 'ownerAvatar', 'size',
            'downloads', 'likes', 'visibility', 'duration', 'youtubeUrl', 'lastEditedAt'
        ]
```

---

### 2. Get Material

**Endpoint:** `GET /api/materials/:materialId/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "m-001",
    "title": "Introduction to Binary Trees",
    "courseCode": "CSC 201",
    "courseId": "c-csc201",
    "type": "pdf",
    "semester": 2,
    "uploadDate": "2025-02-28T10:00:00Z",
    "url": "/media/materials/csc201/binary-trees.pdf",
    "uploader": "Dr. Chioma Okonkwo",
    "ownerAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    "size": "2.4 MB",
    "downloads": 120,
    "likes": 45,
    "visibility": "public"
  }
}
```

---

### 3. Upload Material

**Endpoint:** `POST /api/materials/`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
file: <binary file>
title: "Introduction to Binary Trees"
courseId: "c-csc201"
type: "pdf"
semester: 2
visibility: "public"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "material": {
      "id": "m-011",
      "title": "Introduction to Binary Trees",
      "courseCode": "CSC 201",
      "courseId": "c-csc201",
      "type": "pdf",
      "semester": 2,
      "uploadDate": "2025-03-03T10:00:00Z",
      "url": "/media/materials/csc201/binary-trees.pdf",
      "uploader": "Dr. Chioma Okonkwo",
      "size": "2.4 MB",
      "downloads": 0,
      "likes": 0,
      "visibility": "public"
    },
    "fileId": "file-abc123"
  }
}
```

**Django Models:** `courses.models.CourseMaterial`

---

### 4. Update Material

**Endpoint:** `PUT /api/materials/:materialId/`

**Request Body:**
```json
{
  "title": "Updated Title",
  "visibility": "private",
  "semester": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "m-001",
    "title": "Updated Title",
    "visibility": "private",
    "semester": 3,
    // ... full material object
  }
}
```

---

### 5. Delete Material

**Endpoint:** `DELETE /api/materials/:materialId/`

**Response (204 No Content)**

---

### 6. Get Materials by Course

**Endpoint:** `GET /api/courses/:courseId/materials/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "m-001",
        "title": "Introduction to Binary Trees",
        "courseCode": "CSC 201",
        "type": "pdf",
        "uploadDate": "2025-02-28T10:00:00Z",
        "url": "/media/materials/csc201/binary-trees.pdf",
        "uploader": "Dr. Chioma Okonkwo",
        "size": "2.4 MB",
        "downloads": 120,
        "likes": 45
      }
    ],
    "total": 15
  }
}
```

---

### 7. Bulk Material Actions

**Endpoint:** `POST /api/materials/bulk-action/`

**Request Body:**
```json
{
  "materialIds": ["m-001", "m-002", "m-003"],
  "action": "delete",
  "targetModuleId": "mod-001"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "affectedCount": 3,
    "failedIds": []
  }
}
```

---

### 8. Toggle Material Visibility

**Endpoint:** `PATCH /api/materials/:materialId/visibility/`

**Request Body:**
```json
{
  "visible": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "materialId": "m-001",
    "visibility": "public"
  }
}
```

---

## Notes

### 1. List Notes

**Endpoint:** `GET /api/notes/`

**Query Parameters:**
- `courseId` (optional): Filter by course
- `status` (optional): 'draft' | 'saved' | 'published'
- `search` (optional): Search in title/content

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "note-001",
        "userId": "u-student-01",
        "role": "student",
        "title": "Binary Trees Summary",
        "content": "<h2>Binary Trees</h2><p>A binary tree is a tree data structure where each node has at most two children.</p>",
        "excerpt": "Summary of binary tree properties and traversal methods.",
        "scope": "course",
        "status": "saved",
        "pinned": true,
        "courseId": "c-csc201",
        "courseCode": "CSC 201",
        "materialId": "m-001",
        "tags": ["trees", "revision", "data-structures"],
        "attachments": [
          {
            "materialId": "m-001",
            "title": "Introduction to Binary Trees",
            "courseCode": "CSC 201",
            "type": "pdf",
            "url": "/media/materials/csc201/binary-trees.pdf"
          }
        ],
        "createdAt": "2025-02-28T14:00:00Z",
        "updatedAt": "2025-03-01T09:00:00Z",
        "lastOpenedAt": "2025-03-02T10:00:00Z"
      }
    ],
    "total": 3,
    "tags": ["trees", "revision", "data-structures", "sql", "database"]
  }
}
```

**Django Models:** `courses.models.Note`, `courses.models.Tag`

---

### 2. Create Note

**Endpoint:** `POST /api/notes/`

**Request Body:**
```json
{
  "title": "Binary Trees Summary",
  "content": "<h2>Binary Trees</h2><p>A binary tree is a tree data structure where each node has at most two children.</p>",
  "courseId": "c-csc201",
  "courseCode": "CSC 201",
  "materialId": "m-001",
  "scope": "course",
  "tags": ["trees", "revision"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "note-001",
    "userId": "u-student-01",
    "role": "student",
    "title": "Binary Trees Summary",
    "content": "<h2>Binary Trees</h2><p>A binary tree is a tree data structure where each node has at most two children.</p>",
    "excerpt": "Summary of binary tree properties and traversal methods.",
    "scope": "course",
    "status": "saved",
    "pinned": false,
    "courseId": "c-csc201",
    "courseCode": "CSC 201",
    "tags": ["trees", "revision"],
    "attachments": [],
    "createdAt": "2025-03-03T10:00:00Z",
    "updatedAt": "2025-03-03T10:00:00Z"
  }
}
```

**Django Models:** `courses.models.Note`

---

### 3. Update Note

**Endpoint:** `PUT /api/notes/:noteId/`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  "tags": ["new", "tags"],
  "isPinned": true,
  "status": "saved"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "note-001",
    "title": "Updated Title",
    "content": "<p>Updated content</p>",
    "excerpt": "Updated excerpt...",
    "tags": ["new", "tags"],
    "isPinned": true,
    "status": "saved",
    "updatedAt": "2025-03-03T10:00:00Z"
  }
}
```

---

### 4. Delete Note

**Endpoint:** `DELETE /api/notes/:noteId/`

**Response (204 No Content)**

---

### 5. Toggle Note Pin

**Endpoint:** `PATCH /api/notes/:noteId/pin/`

**Request Body:**
```json
{
  "pinned": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "note-001",
    "pinned": true,
    "updatedAt": "2025-03-03T10:00:00Z"
  }
}
```

---

### 6. Attach Material to Note

**Endpoint:** `POST /api/notes/:noteId/attachments/`

**Request Body:**
```json
{
  "materialId": "m-001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "noteId": "note-001",
    "attachment": {
      "materialId": "m-001",
      "title": "Introduction to Binary Trees",
      "courseCode": "CSC 201",
      "type": "pdf",
      "url": "/media/materials/csc201/binary-trees.pdf"
    },
    "scope": "material",
    "updatedAt": "2025-03-03T10:00:00Z"
  }
}
```

---

## Dashboard

### 1. Student Dashboard

**Endpoint:** `GET /api/dashboard/student/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-student-01",
      "name": "Amina Idris",
      "email": "amina@student.unilag.edu.ng",
      "role": "student",
      "department": "Computer Science",
      "semester": 2
    },
    "courses": [
      {
        "id": "c-csc201",
        "code": "CSC 201",
        "title": "Data Structures & Algorithms",
        "semester": 2,
        "lecturerName": "Dr. Chioma Okonkwo",
        "enrollment": 420,
        "materialCount": 15
      },
      {
        "id": "c-csc202",
        "code": "CSC 202",
        "title": "Computer Architecture",
        "semester": 2,
        "lecturerName": "Prof. Adebayo Williams",
        "enrollment": 380,
        "materialCount": 12
      }
    ],
    "recentMaterials": [
      {
        "id": "m-001",
        "title": "Introduction to Binary Trees",
        "courseCode": "CSC 201",
        "type": "pdf",
        "uploadDate": "2025-02-28T10:00:00Z",
        "url": "/media/materials/csc201/binary-trees.pdf",
        "uploader": "Dr. Chioma Okonkwo",
        "size": "2.4 MB"
      }
    ],
    "studentStats": {
      "gpa": "3.92",
      "attendance": "94%",
      "upcomingDeadlines": [
        {
          "title": "Database Project - Phase 1",
          "due": "Tomorrow",
          "color": "orange"
        },
        {
          "title": "Algorithm Analysis Assignment",
          "due": "3 days",
          "color": "sage"
        }
      ]
    },
    "courseProgress": {
      "c-csc201": 45,
      "c-csc202": 78,
      "c-csc203": 32
    },
    "gamification": {
      "level": 5,
      "currentXP": 350,
      "xpToNextLevel": 500,
      "totalXP": 2150,
      "streak": {
        "current": 7,
        "best": 14,
        "lastActivity": "2025-03-02T10:00:00Z"
      },
      "title": "Academic Explorer",
      "badges": ["first-course", "week-streak", "early-adopter"],
      "achievements": [
        {
          "id": "ach-001",
          "title": "First Steps",
          "description": "Complete your first course module",
          "icon": "🎯",
          "category": "course",
          "rarity": "common",
          "unlocked": true,
          "unlockedAt": "2025-02-15T10:00:00Z"
        }
      ],
      "milestones": [
        {
          "id": "mile-001",
          "title": "Course Completer",
          "description": "Complete 5 courses",
          "type": "course_completion",
          "progress": 2,
          "target": 5,
          "reward": {
            "type": "xp",
            "value": 500
          },
          "completed": false,
          "claimed": false
        }
      ]
    }
  },
  "lastRefreshedAt": "2025-03-03T10:00:00Z",
  "cacheExpiry": "2025-03-03T10:05:00Z"
}
```

**Django Models:** Aggregates from User, Course, CourseMaterial, Note, etc.

---

### 2. Lecturer Dashboard

**Endpoint:** `GET /api/dashboard/lecturer/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u-lecturer-01",
      "name": "Dr. Chioma Okonkwo",
      "email": "chioma.okonkwo@unilag.edu.ng",
      "role": "lecturer",
      "department": "Computer Science"
    },
    "courses": [
      {
        "id": "c-csc201",
        "code": "CSC 201",
        "title": "Data Structures & Algorithms",
        "semester": 2,
        "enrollment": 420,
        "materialCount": 15
      },
      {
        "id": "c-csc203",
        "code": "CSC 203",
        "title": "Database Management Systems",
        "semester": 2,
        "enrollment": 350,
        "materialCount": 10
      }
    ],
    "recentMaterials": [
      {
        "id": "m-001",
        "title": "Introduction to Binary Trees",
        "courseCode": "CSC 201",
        "type": "pdf",
        "uploadDate": "2025-02-28T10:00:00Z",
        "downloads": 120,
        "likes": 45
      }
    ],
    "lecturerStats": {
      "totalStudents": 770,
      "totalUploads": 8,
      "totalViews": 8200,
      "activeCourses": 2,
      "trendingMaterial": {
        "title": "SQL Fundamentals",
        "views": 145,
        "downloads": 145,
        "trend": 25
      },
      "monthlyUploads": [
        { "name": "Jan", "uploads": 3, "value": 3 },
        { "name": "Feb", "uploads": 5, "value": 5 },
        { "name": "Mar", "uploads": 2, "value": 2 }
      ],
      "courseEngagement": [
        { "name": "CSC 201", "engagement": 85, "value": 85 },
        { "name": "CSC 203", "engagement": 72, "value": 72 }
      ]
    }
  },
  "lastRefreshedAt": "2025-03-03T10:00:00Z",
  "cacheExpiry": "2025-03-03T10:05:00Z"
}
```

---

## Gamification

### 1. Get Gamification Profile

**Endpoint:** `GET /api/gamification/:userId/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "level": 5,
    "currentXP": 350,
    "xpToNextLevel": 500,
    "totalXP": 2150,
    "streak": {
      "current": 7,
      "best": 14,
      "lastActivity": "2025-03-02T10:00:00Z"
    },
    "title": "Academic Explorer",
    "badges": ["first-course", "week-streak", "early-adopter"],
    "achievements": [
      {
        "id": "ach-001",
        "title": "First Steps",
        "description": "Complete your first course module",
        "icon": "🎯",
        "category": "course",
        "rarity": "common",
        "unlocked": true,
        "unlockedAt": "2025-02-15T10:00:00Z"
      },
      {
        "id": "ach-002",
        "title": "Week Warrior",
        "description": "Maintain a 7-day learning streak",
        "icon": "🔥",
        "category": "streak",
        "rarity": "rare",
        "unlocked": true,
        "unlockedAt": "2025-02-21T10:00:00Z",
        "progress": 7,
        "target": 7
      },
      {
        "id": "ach-003",
        "title": "Material Master",
        "description": "Download 50 materials",
        "icon": "📚",
        "category": "material",
        "rarity": "epic",
        "unlocked": false,
        "progress": 32,
        "target": 50
      }
    ],
    "milestones": [
      {
        "id": "mile-001",
        "title": "Course Completer",
        "description": "Complete 5 courses",
        "type": "course_completion",
        "progress": 2,
        "target": 5,
        "reward": {
          "type": "xp",
          "value": 500
        },
        "completed": false,
        "claimed": false
      }
    ]
  }
}
```

**Django Models:** May require new models (see Additional Models section)

---

### 2. Add XP

**Endpoint:** `POST /api/gamification/:userId/xp/`

**Request Body:**
```json
{
  "amount": 50,
  "reason": "Completed course module"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "u-student-01",
    "previousXP": 350,
    "addedXP": 50,
    "newTotalXP": 400,
    "levelUp": false
  }
}
```

---

### 3. Unlock Achievement

**Endpoint:** `POST /api/gamification/:userId/achievements/:achievementId/unlock/`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievementId": "ach-001",
    "unlocked": true,
    "unlockedAt": "2025-03-03T10:00:00Z",
    "xpAwarded": 100
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field_name": ["Specific error for this field"]
    }
  },
  "timestamp": "2025-03-03T10:00:00Z",
  "requestId": "req-abc123"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid token |
| `PERMISSION_DENIED` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["This field is required"],
      "password": ["Password must be at least 8 characters"]
    }
  },
  "timestamp": "2025-03-03T10:00:00Z"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Authentication credentials were not provided"
  },
  "timestamp": "2025-03-03T10:00:00Z"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Course not found"
  },
  "timestamp": "2025-03-03T10:00:00Z"
}
```

---

## Appendix

### A. Additional Django Models Needed

Based on frontend requirements, you may need to create these models:

#### 1. Course Enrollment / Student Progress
```python
class CourseEnrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress = models.PositiveIntegerField(default=0)  # 0-100
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'course']
```

#### 2. Assignment/Deadline
```python
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    points = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
```

#### 3. Material Access Tracking
```python
class MaterialAccess(models.Model):
    material = models.ForeignKey(CourseMaterial, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    access_type = models.CharField(max_length=20)  # 'view' or 'download'
    accessed_at = models.DateTimeField(auto_now_add=True)
```

#### 4. Gamification Models
```python
class GamificationProfile(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    level = models.PositiveIntegerField(default=1)
    current_xp = models.PositiveIntegerField(default=0)
    total_xp = models.PositiveIntegerField(default=0)
    streak_current = models.PositiveIntegerField(default=0)
    streak_best = models.PositiveIntegerField(default=0)
    last_activity = models.DateField(null=True, blank=True)
    title = models.CharField(max_length=100, default="Newcomer")

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    category = models.CharField(max_length=20)
    rarity = models.CharField(max_length=20)
    xp_reward = models.PositiveIntegerField()

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'achievement']
```

---

### B. Django Model to API Field Mapping

#### User Model
| Django Field | API Field | Notes |
|-------------|-----------|-------|
| `user.id` | `id` | Convert to string |
| `user.full_name` | `name` | |
| `user.email` | `email` | |
| `user.role` | `role` | "student" or "lecturer" |
| `student.username` | `username` | From related profile |
| `student.department` | `department` | From related profile |
| `user.semester` | `semester` | |
| `user.bio` | `bio` | |

#### Course Model
| Django Field | API Field | Notes |
|-------------|-----------|-------|
| `course.id` | `id` | Convert to string |
| `course.code` | `code` | |
| `course.title` | `title` | |
| `course.description` | `description` | |
| `course.semester` | `semester` | |
| `course.lecturer.user.full_name` | `lecturerName` | |
| `course.enrollment` | `enrollment` | |
| `course.materials.count()` | `materialCount` | Or use cached field |

#### CourseMaterial Model
| Django Field | API Field | Notes |
|-------------|-----------|-------|
| `material.id` | `id` | Convert to string |
| `material.title` | `title` | |
| `material.course.code` | `courseCode` | |
| `material.course.id` | `courseId` | Convert to string |
| `material.material_type` | `type` | Map to frontend types |
| `material.semester` | `semester` | |
| `material.upload_at.isoformat()` | `uploadDate` | ISO 8601 |
| `material.file.url` | `url` | Build absolute URI |
| `material.uploader.user.full_name` | `uploader` | |
| `material.size` | `size` | Human-readable |
| `material.downloads` | `downloads` | |
| `material.likes` | `likes` | |
| `material.visibility` | `visibility` | "public" or "private" |

---

### C. Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Unauthenticated | 10 requests/minute |
| Authenticated | 100 requests/minute |
| Upload endpoints | 10 requests/hour |
| Dashboard endpoints | 30 requests/minute |

---

### D. File Upload Guidelines

For material uploads, use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My Document');
formData.append('courseId', 'c-csc201');
formData.append('type', 'pdf');
formData.append('semester', 2);
formData.append('visibility', 'public');

await fetch('/api/materials/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>'
  },
  body: formData
});
```

**File Size Limits:**
- PDFs: 10 MB max
- Videos: 500 MB max (or use YouTube external URLs)
- ZIP files: 50 MB max

---

### E. Example Mock Data Reference

All example data in this document comes from the mock data file:
- **Location:** `frontend/src/data/mock-data.ts`
- **Purpose:** Shows exact data structures the frontend expects
- **Usage:** Use as reference when building serializers

---

## Quick Reference Card

### Priority 1 (MVP)
```
POST /api/auth/login/
GET  /api/users/me/
GET  /api/courses/
GET  /api/courses/:id/
GET  /api/materials/
POST /api/materials/
GET  /api/dashboard/student/
GET  /api/dashboard/lecturer/
```

### Priority 2 (Core Features)
```
POST /api/auth/signup/
GET  /api/notes/
POST /api/notes/
PUT  /api/notes/:id/
DELETE /api/notes/:id/
GET  /api/courses/:id/materials/
PUT  /api/materials/:id/
DELETE /api/materials/:id/
```

### Priority 3 (Nice to Have)
```
GET  /api/gamification/:userId/
POST /api/gamification/:userId/xp/
POST /api/materials/bulk-action/
PATCH /api/materials/:id/visibility/
```

---

**For questions or clarifications:**
- Check mock data: `frontend/src/data/mock-data.ts`
- Review type definitions: `frontend/src/services/api.ts`
- See additional types: `frontend/src/types/`
