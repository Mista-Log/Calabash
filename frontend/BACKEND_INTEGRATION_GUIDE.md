# Calabash Frontend Data Schema Guide for Backend Engineers

> **Last Updated:** March 3, 2025  
> **Version:** 2.0.0 (Enhanced Mock Data)

## Quick Start

This guide helps backend engineers understand what data the Calabash frontend needs and how to structure API endpoints.

### 🎯 What's New in v2.0

- ✅ **Enhanced Mock Data**: Complete, interconnected dataset with realistic examples
- ✅ **Full Course Details**: Nested modules, materials, and activity feeds
- ✅ **Complete Dashboard Data**: Both student and lecturer views with all fields
- ✅ **Gamification Support**: Achievements, milestones, XP tracking
- ✅ **Notes with Attachments**: Rich text notes linked to courses/materials

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) | **Complete API endpoint reference** with request/response examples |
| [`src/data/mock-data.ts`](./src/data/mock-data.ts) | **Exemplar API responses** - shows exact data structures |
| [`src/services/api.ts`](./src/services/api.ts) | Core data models (User, Course, Material, etc.) |
| [`src/types/`](./src/types/) | Additional type definitions for specific features |

---

## 🎯 Priority Endpoints (Start Here)

Build these endpoints first to enable core functionality:

### Phase 1: MVP (Week 1-2)
```
POST /api/auth/login/          # User login
GET  /api/users/me/            # Get current user
GET  /api/courses/             # List user's courses
GET  /api/courses/:id/         # Get course details with materials
GET  /api/materials/           # List materials
GET  /api/dashboard/student/   # Student dashboard
GET  /api/dashboard/lecturer/  # Lecturer dashboard
```

### Phase 2: Core Features (Week 3-4)
```
POST /api/auth/signup/         # User registration
POST /api/materials/           # Upload material
GET  /api/notes/               # List notes
POST /api/notes/               # Create note
PUT  /api/notes/:id/           # Update note
DELETE /api/notes/:id/         # Delete note
GET  /api/courses/:id/materials/  # Materials for course
```

### Phase 3: Advanced Features (Week 5+)
```
PUT  /api/materials/:id/       # Update material
DELETE /api/materials/:id/     # Delete material
POST /api/materials/bulk-action/  # Bulk operations
GET  /api/gamification/:userId/   # Gamification profile
POST /api/gamification/:userId/xp/ # Award XP
PATCH /api/notes/:id/pin/      # Toggle note pin
```

---

## 📦 Data Models Overview

### User Profile
**Source:** `src/data/mock-data.ts` → `MOCK_USERS`

```typescript
{
  id: "u-student-01",
  name: "Amina Idris",
  username: "amina.idris",
  email: "amina@student.unilag.edu.ng",
  role: "student",
  department: "Computer Science",
  semester: 2,
  isNewUser: false,
  bio: "Passionate software developer interested in AI and machine learning.",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
}
```

**Django Mapping:**
- `User.full_name` → `name`
- `User.email` → `email`
- `User.role` → `role`
- `Student.username` → `username`
- `Student.department` → `department`
- `User.semester` → `semester`

---

### Course
**Source:** `src/data/mock-data.ts` → `MOCK_COURSES`

```typescript
{
  id: "c-csc201",
  code: "CSC 201",
  title: "Data Structures & Algorithms",
  semester: 2,
  description: "Fundamental data structures and algorithms including arrays, linked lists...",
  lecturerName: "Dr. Chioma Okonkwo",
  color: "#4F46E5",
  enrollment: 420,
  materialCount: 15
}
```

**Django Mapping:**
- `Course.code` → `code`
- `Course.title` → `title`
- `Course.description` → `description`
- `Course.semester` → `semester`
- `Course.lecturer.user.full_name` → `lecturerName`
- `Course.enrollment` → `enrollment`
- `Course.materials.count()` → `materialCount`

---

### Material
**Source:** `src/data/mock-data.ts` → `MOCK_MATERIALS`

```typescript
{
  id: "m-001",
  title: "Introduction to Binary Trees",
  courseCode: "CSC 201",
  courseId: "c-csc201",
  type: "pdf",
  semester: 2,
  uploadDate: "2025-02-28T10:00:00Z",
  url: "/media/materials/csc201/binary-trees.pdf",
  uploader: "Dr. Chioma Okonkwo",
  ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
  size: "2.4 MB",
  downloads: 120,
  likes: 45,
  visibility: "public",
  lastEditedAt: "2025-03-01T08:00:00Z"
}
```

**Django Mapping:**
- `CourseMaterial.title` → `title`
- `CourseMaterial.course.code` → `courseCode`
- `CourseMaterial.course.id` → `courseId`
- `CourseMaterial.material_type` → `type`
- `CourseMaterial.upload_at.isoformat()` → `uploadDate`
- `CourseMaterial.file.url` → `url` (use `request.build_absolute_uri()`)
- `CourseMaterial.uploader.user.full_name` → `uploader`
- `CourseMaterial.visibility` → `visibility`

---

### Course Details (Full Endpoint Response)
**Source:** `src/data/mock-data.ts` → `MOCK_COURSE_DETAILS`

```typescript
{
  id: "c-csc201",
  code: "CSC 201",
  title: "Data Structures & Algorithms",
  semester: 2,
  description: "...",
  studentCount: 420,
  materialCount: 15,
  lecturer: {
    name: "Dr. Chioma Okonkwo",
    role: "Senior Lecturer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma"
  },
  stats: {
    rating: 4.7,
    totalRatings: 156,
    duration: "12 weeks"
  },
  youtubeUrl: "https://www.youtube.com/embed/kPRA0W1kECg",
  supplements: [/* Material[] */],
  modules: [
    {
      id: "mod-001",
      title: "Module 1: Introduction to Data Structures",
      order: 1,
      materials: [/* Material[] */]
    }
  ],
  recentActivity: [
    {
      id: "act-001",
      type: "upload",
      description: "Uploaded 'Introduction to Binary Trees'",
      date: "2025-02-28T10:00:00Z"
    }
  ]
}
```

**Backend Notes:**
- `modules`: Can return all materials and let frontend group them
- `recentActivity`: Generate from material uploads/views
- `supplements`: First 2-6 materials

---

### Dashboard Data (Student)
**Source:** `src/data/mock-data.ts` → `MOCK_STUDENT_DASHBOARD`

```typescript
{
  user: { /* UserProfile */ },
  courses: [/* Course[] */],
  recentMaterials: [/* Material[] */],
  studentStats: {
    gpa: "3.92",
    attendance: "94%",
    upcomingDeadlines: [
      {
        title: "Database Project - Phase 1",
        due: "Tomorrow",
        color: "orange"
      }
    ]
  },
  courseProgress: {
    "c-csc201": 45,
    "c-csc202": 78,
    "c-csc203": 32
  },
  gamification: {
    level: 5,
    currentXP: 350,
    xpToNextLevel: 500,
    totalXP: 2150,
    streak: {
      current: 7,
      best: 14,
      lastActivity: "2025-03-02T10:00:00Z"
    },
    title: "Academic Explorer",
    badges: ["first-course", "week-streak"],
    achievements: [/* Achievement[] */],
    milestones: [/* Milestone[] */]
  }
}
```

---

### Dashboard Data (Lecturer)
**Source:** `src/data/mock-data.ts` → `MOCK_LECTURER_DASHBOARD`

```typescript
{
  user: { /* UserProfile */ },
  courses: [/* Course[] - courses taught */],
  recentMaterials: [/* Material[] - uploaded by lecturer */],
  lecturerStats: {
    totalStudents: 770,
    totalUploads: 8,
    totalViews: 8200,
    activeCourses: 2,
    trendingMaterial: {
      title: "SQL Fundamentals",
      views: 145,
      downloads: 145,
      trend: 25  // 25% increase
    },
    monthlyUploads: [
      { name: "Jan", uploads: 3, value: 3 },
      { name: "Feb", uploads: 5, value: 5 },
      { name: "Mar", uploads: 2, value: 2 }
    ],
    courseEngagement: [
      { name: "CSC 201", engagement: 85, value: 85 },
      { name: "CSC 203", engagement: 72, value: 72 }
    ]
  }
}
```

---

## 🔧 Field Naming Convention

**Critical:** Django uses `snake_case`, but the frontend expects `camelCase`.

### Django REST Framework Serializer Example

```python
from rest_framework import serializers
from courses.models import CourseMaterial

class MaterialSerializer(serializers.ModelSerializer):
    # Field mappings
    courseCode = serializers.CharField(source='course.code', read_only=True)
    courseId = serializers.CharField(source='course.id', read_only=True)
    uploadDate = serializers.DateTimeField(source='upload_at', read_only=True)
    uploader = serializers.CharField(source='uploader.user.full_name', read_only=True)
    ownerAvatar = serializers.SerializerMethodField()
    
    # Custom field
    def get_ownerAvatar(self, obj):
        if obj.uploader and obj.uploader.user.avatar_url:
            return obj.uploader.user.avatar_url
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.uploader.user.full_name}"
    
    class Meta:
        model = CourseMaterial
        fields = [
            'id', 'title', 'courseCode', 'courseId', 'type',
            'semester', 'uploadDate', 'url', 'uploader', 'ownerAvatar',
            'size', 'downloads', 'likes', 'visibility', 'duration',
            'youtubeUrl', 'lastEditedAt'
        ]
```

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* your data */ },
  "timestamp": "2025-03-03T10:00:00Z",
  "requestId": "req-abc123"
}
```

### Error Response
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

### Paginated Response
```json
{
  "results": [/* array of items */],
  "count": 100,
  "next": "https://api.calabash.edu.ng/api/materials?page=2",
  "previous": null,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

---

## 🗄️ Django Models Reference

The frontend types map to these Django models:

| Frontend Type | Django Model | File |
|--------------|--------------|------|
| `UserProfile` | `account.models.User` + `Student`/`Lecturer` | `Backend/account/models.py` |
| `Course` | `courses.models.Course` | `Backend/courses/models.py` |
| `Material` | `courses.models.CourseMaterial` | `Backend/courses/models.py` |
| `Note` | `courses.models.Note` | `Backend/courses/models.py` |

---

## 🎓 Example: Complete API Flow

### 1. Login
```typescript
// Request
POST /api/auth/login/
{
  "email": "amina@student.unilag.edu.ng",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "u-student-01",
      "name": "Amina Idris",
      "email": "amina@student.unilag.edu.ng",
      "role": "student",
      "department": "Computer Science",
      "semester": 2,
      "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2025-03-03T11:00:00Z"
  }
}
```

### 2. Get Dashboard
```typescript
// Request
GET /api/dashboard/student/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Response (see MOCK_STUDENT_DASHBOARD in src/data/mock-data.ts)
{
  "success": true,
  "data": {
    "user": { /* UserProfile */ },
    "courses": [
      {
        "id": "c-csc201",
        "code": "CSC 201",
        "title": "Data Structures & Algorithms",
        "semester": 2,
        "lecturerName": "Dr. Chioma Okonkwo",
        "enrollment": 420,
        "materialCount": 15
      }
    ],
    "recentMaterials": [/* Material[] */],
    "studentStats": {
      "gpa": "3.92",
      "attendance": "94%",
      "upcomingDeadlines": [/* ... */]
    },
    "courseProgress": {
      "c-csc201": 45,
      "c-csc202": 78
    },
    "gamification": { /* GamificationProfile */ }
  },
  "lastRefreshedAt": "2025-03-03T10:00:00Z",
  "cacheExpiry": "2025-03-03T10:05:00Z"
}
```

---

## 🚀 Development Workflow

### For Backend Engineers

1. **Read the types** in `src/services/api.ts` to understand data structures
2. **Check mock data** in `src/data/mock-data.ts` for complete examples
3. **Build endpoints** following patterns in `docs/API_REFERENCE.md`
4. **Test with frontend** - replace mock data calls with real API calls

### For Frontend Engineers

1. **Use mock data** during development (default mode)
2. **Switch to API** by setting environment variables:
   ```env
   NEXT_PUBLIC_DASHBOARD_DATA_MODE="api-with-fallback"
   NEXT_PUBLIC_ENABLE_REAL_DASHBOARD_API="true"
   ```
3. **Update services** in `src/services/` to call real endpoints

---

## 🔍 Understanding the Code

### Data Flow
```
Backend API
    ↓
src/services/api.ts (types)
    ↓
src/services/*.repository.ts (data fetching)
    ↓
src/store/*.ts (state management)
    ↓
src/components/ (UI)
```

### Key Files

| Folder | Purpose |
|--------|---------|
| `src/data/mock-data.ts` | **Exemplar API responses** - start here |
| `src/services/api.ts` | Core types and API service class |
| `src/services/*.repository.ts` | Data access layer (mock → API transition) |
| `src/store/*.ts` | State management (Zustand stores) |
| `src/types/` | Additional type definitions |
| `docs/API_REFERENCE.md` | Complete endpoint documentation |

---

## ❓ FAQ

### Q: Should I create all endpoints at once?
**A:** No. Follow the phased approach:
- Phase 1: Auth + Courses + Dashboard (MVP)
- Phase 2: Materials + Notes
- Phase 3: Advanced features

### Q: Do I need to implement gamification now?
**A:** No. Gamification is optional for MVP. Focus on core features first.

### Q: What about file uploads?
**A:** Use `multipart/form-data` for file uploads. See `docs/API_REFERENCE.md` for details.

### Q: Should I return null or omit optional fields?
**A:** Return `null` for optional fields without data. Return empty arrays `[]` for lists with no items.

### Q: How do I handle the modules structure in CourseDetails?
**A:** Two options:
1. **Simple:** Return all materials, let frontend group them
2. **Advanced:** Create a `Module` model with `order` field

### Q: Where can I see example data?
**A:** Check `src/data/mock-data.ts` - it has complete, interconnected examples for all data types.

---

## 📞 Need Help?

### Primary Resources
1. **Mock Data** - `src/data/mock-data.ts` (complete examples)
2. **API Reference** - `docs/API_REFERENCE.md` (endpoint specs)
3. **Type Definitions** - `src/services/api.ts` (data structures)

### Quick Reference Card

**Must-Have Endpoints (MVP):**
```
POST /api/auth/login/
GET  /api/users/me/
GET  /api/courses/
GET  /api/courses/:id/
GET  /api/materials/
GET  /api/dashboard/student/
GET  /api/dashboard/lecturer/
```

**Nice-to-Have (Later):**
```
GET  /api/gamification/:userId/
POST /api/materials/bulk-action/
PATCH /api/notes/:id/pin/
```

---

**Remember:** The frontend currently uses mock data from `src/data/mock-data.ts`. When backend APIs are ready, we'll switch to real API calls by updating the repository layer in `src/services/`.

All mock data is **interconnected** and reflects real database relationships:
- Courses link to materials via `courseId`
- Materials link to users via `uploader`
- Notes link to courses and materials
- Dashboard aggregates all data

Use the mock data as your **single source of truth** for API response structures.
