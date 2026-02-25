# Backend Integration Guide

## 🎯 Overview

This guide provides step-by-step instructions for integrating the Calabash backend with the existing frontend. The frontend is **100% complete with mock data** and designed for easy backend integration.

---

## 📋 Table of Contents

1. [Current State](#current-state)
2. [Architecture Overview](#architecture-overview)
3. [Integration Steps](#integration-steps)
4. [API Configuration](#api-configuration)
5. [Repository Pattern](#repository-pattern)
6. [Feature-by-Feature Integration](#feature-by-feature-integration)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Current State

### **Frontend**
- ✅ **100% Complete** - All UI screens implemented
- ✅ **Mock Data** - Full functionality with mock data
- ✅ **Type-Safe** - TypeScript throughout
- ✅ **API Abstraction** - Easy mock ↔ real switching
- ✅ **Error Handling** - Graceful error states
- ✅ **Loading States** - Skeleton screens everywhere

### **Backend** (When Ready)
- ⏳ Django REST Framework
- ⏳ PostgreSQL Database
- ⏳ JWT Authentication
- ⏳ File Upload (S3/Cloudinary)
- ⏳ Real-time (WebSocket)

---

## 🏗️ Architecture Overview

### **Frontend Architecture**

```
┌─────────────────────────────────────────┐
│          Next.js 15 (App Router)        │
├─────────────────────────────────────────┤
│  Components (Material 3 Design)         │
├─────────────────────────────────────────┤
│     State Management (Zustand)          │
├─────────────────────────────────────────┤
│   API Layer (api-client.ts)             │
│   ┌─────────────────────────────────┐   │
│   │ Mock Support │ Retry Logic │    │   │
│   │ Error Handling │ Progress │      │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### **Backend Architecture** (Expected)

```
┌─────────────────────────────────────────┐
│         Django REST Framework           │
├─────────────────────────────────────────┤
│         JWT Authentication              │
├─────────────────────────────────────────┤
│         PostgreSQL Database             │
├─────────────────────────────────────────┤
│         File Storage (S3)               │
└─────────────────────────────────────────┘
```

---

## 🔧 Integration Steps

### **Step 1: Environment Setup**

Create `.env.local` in `frontend/` directory:

```bash
# Copy template
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Disable mock data
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# Enable features as they're ready
NEXT_PUBLIC_AUTH_API=true
NEXT_PUBLIC_DASHBOARD_API=true
NEXT_PUBLIC_COURSES_API=true
NEXT_PUBLIC_MATERIALS_API=true
NEXT_PUBLIC_ANALYTICS_API=true
```

### **Step 2: Update API Configuration**

Edit `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com',
  
  // Set to false when backend is ready
  ENABLE_MOCK_DATA: false,
  
  // Enable features as backend is ready
  FEATURES: {
    DASHBOARD_API: true,
    COURSES_API: true,
    MATERIALS_API: true,
    AUTH_API: true,
    ANALYTICS_API: true,
  },
};
```

### **Step 3: Update Repository Files**

Each repository file needs one change:

**BEFORE (Mock):**
```typescript
// services/course.repository.ts
async getCourses(userId: string) {
  return await apiClient.get('/api/courses/', {
    useMock: true,
    mockData: MOCK_COURSES,
  });
}
```

**AFTER (Real API):**
```typescript
// services/course.repository.ts
async getCourses(userId: string) {
  return await apiClient.get('/api/courses/', {
    useMock: false,  // ← Changed!
  });
}
```

### **Step 4: Test Each Feature**

Test in this order:

1. ✅ **Authentication** - Login/Logout
2. ✅ **Dashboard** - Load user data
3. ✅ **Courses** - List & detail
4. ✅ **Materials** - Upload & view
5. ✅ **Library** - Browse & filter
6. ✅ **Analytics** - Charts & metrics

---

## 🔌 API Configuration

### **API Client Usage**

```typescript
import apiClient from '@/lib/api-client';

// GET request
const result = await apiClient.get<Course[]>('/api/courses/', {
  useMock: false,
});

// POST request
const result = await apiClient.post<Course>('/api/courses/', {
  title: 'New Course',
  code: 'CSC 101',
}, {
  useMock: false,
});

// File upload
const result = await apiClient.upload<Material>(
  '/api/materials/upload/',
  file,
  { title: 'Lecture 1', courseCode: 'CSC 101' },
  (percent) => console.log(`Upload: ${percent}%`)
);
```

### **Response Format**

All API calls return consistent format:

```typescript
interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  fromMock: boolean;
}

// Usage
const result = await apiClient.get<Course[]>('/api/courses/');

if (result.success) {
  console.log(result.data); // Course[]
} else {
  console.error(result.error); // Error message
}
```

---

## 📁 Repository Pattern

### **Example: Course Repository**

```typescript
// services/course.repository.ts
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { Course, CourseDetails } from '@/services/api';

export interface CourseListResponse {
  courses: Course[];
  total: number;
}

export type CourseRepoResult<T> = 
  | { ok: true; data: T }
  | { ok: false; code: string; error: string };

export const courseRepository = {
  /**
   * Get all courses for a user
   */
  async getCoursesForUser(
    role: 'student' | 'lecturer',
    userId: string
  ): Promise<CourseRepoResult<CourseListResponse>> {
    const result = await apiClient.get<CourseListResponse>(
      API_ENDPOINTS.COURSES.LIST,
      { useMock: false }
    );
    
    if (!result.success) {
      return {
        ok: false,
        code: 'NETWORK_ERROR',
        error: result.error || 'Failed to load courses',
      };
    }
    
    return {
      ok: true,
      data: result.data,
    };
  },

  /**
   * Get course details
   */
  async getCourseDetails(
    courseId: string,
    role: string,
    userId: string
  ): Promise<CourseRepoResult<{ course: CourseDetails; progress: number }>> {
    const result = await apiClient.get<CourseDetails>(
      API_ENDPOINTS.COURSES.DETAIL(courseId),
      { useMock: false }
    );
    
    if (!result.success) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        error: result.error || 'Course not found',
      };
    }
    
    return {
      ok: true,
      data: {
        course: result.data,
        progress: 0, // Will come from API
      },
    };
  },
};
```

### **Using Repository in Components**

```typescript
// app/(app-shell)/courses/page.tsx
import { courseRepository } from '@/services/course.repository';

function CoursesPage() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    courseRepository.getCoursesForUser('student', userId)
      .then(result => {
        if (result.ok) {
          setCourses(result.data.courses);
        } else {
          console.error(result.error);
        }
        setLoading(false);
      });
  }, []);
  
  return <div>...</div>;
}
```

---

## 🎯 Feature-by-Feature Integration

### **1. Authentication**

**Files to Update:**
- `services/auth.service.ts`
- `store/useUserStore.ts`
- `lib/axios.ts`

**API Endpoints Needed:**
```typescript
POST /api/auth/login/
POST /api/auth/signup/
POST /api/auth/logout/
GET  /api/auth/me/
POST /api/auth/token/refresh/
```

**Integration:**
```typescript
// services/auth.service.ts
export const authService = {
  async login(email: string, password: string) {
    const result = await apiClient.post<LoginResponse>(
      '/api/auth/login/',
      { email, password },
      { useMock: false }
    );
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Save token to store
    useUserStore.getState().login(
      result.data.user,
      result.data.token,
      result.data.refreshToken
    );
    
    return result.data;
  },
};
```

### **2. Dashboard**

**Files to Update:**
- `services/dashboard.repository.ts`
- `store/useDashboardStore.ts`

**API Endpoints Needed:**
```typescript
GET /api/dashboard/?role=student|lecturer&user_id={id}
```

**Expected Response:**
```json
{
  "user": { "id": "1", "name": "John", "role": "student" },
  "courses": [...],
  "recentMaterials": [...],
  "studentStats": {
    "gpa": "3.92",
    "attendance": "94%",
    "upcomingDeadlines": [...]
  },
  "gamification": {
    "level": 5,
    "currentXP": 1250,
    "achievements": [...]
  }
}
```

### **3. Courses**

**Files to Update:**
- `services/course.repository.ts`
- `store/useCourseStore.ts`

**API Endpoints Needed:**
```typescript
GET  /api/courses/?role=student|lecturer
GET  /api/courses/{id}/
POST /api/courses/
PUT  /api/courses/{id}/
DELETE /api/courses/{id}/
```

### **4. Materials**

**Files to Update:**
- `services/api.ts` (Material type)
- `store/useLibraryStore.ts`
- `services/upload.repository.ts`

**API Endpoints Needed:**
```typescript
GET    /api/materials/
GET    /api/materials/{id}/
POST   /api/materials/
PUT    /api/materials/{id}/
DELETE /api/materials/{id}/
POST   /api/materials/upload/
GET    /api/materials/{id}/download/
```

### **5. Upload**

**Files to Update:**
- `store/useUploadStore.ts`
- `services/upload.repository.ts`

**Upload Implementation:**
```typescript
// services/upload.repository.ts
export const uploadRepository = {
  async uploadMaterial(
    file: File,
    metadata: {
      title: string;
      courseCode: string;
      type: string;
      semester: number;
    }
  ) {
    const result = await apiClient.upload<Material>(
      '/api/materials/upload/',
      file,
      metadata,
      (percent) => {
        useUploadStore.getState().setProgress(percent);
      }
    );
    
    return result;
  },
};
```

### **6. Analytics**

**Files to Update:**
- `services/dashboard.repository.ts`
- `store/useDashboardStore.ts`

**API Endpoints Needed:**
```typescript
GET /api/analytics/lecturer/{userId}/
GET /api/analytics/courses/{courseId}/
GET /api/analytics/materials/{materialId}/views/
```

---

## ✅ Testing Checklist

### **Before Integration**
- [ ] Delete old TypeScript error files
- [ ] Run `npx tsc --noEmit` (should be 0 errors)
- [ ] Run `npm run dev` (should start without errors)
- [ ] Test all features with mock data

### **After Each Feature Integration**

#### **Authentication**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (shows error)
- [ ] Signup new user
- [ ] Logout
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login

#### **Dashboard**
- [ ] Student dashboard loads
- [ ] Lecturer dashboard loads
- [ ] Stats display correctly
- [ ] Charts render
- [ ] Refresh button works

#### **Courses**
- [ ] Course list loads
- [ ] Course detail loads
- [ ] Filters work
- [ ] Search works
- [ ] Progress displays

#### **Materials**
- [ ] Material list loads
- [ ] PDF viewer works
- [ ] Video player works
- [ ] Download works
- [ ] Upload works
- [ ] Edit works
- [ ] Delete works

#### **Analytics**
- [ ] Charts render with real data
- [ ] Export CSV works
- [ ] Stats are accurate

### **Performance Testing**
- [ ] Page loads < 3 seconds
- [ ] API calls complete < 2 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Mobile responsive

---

## 🐛 Troubleshooting

### **Issue: API calls failing**

**Check:**
```bash
# Is backend running?
curl https://your-backend-url.com/api/health

# Check CORS settings
# Backend must allow your frontend URL
```

**Solution:**
```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend-url.com",
]
```

### **Issue: Mock data still showing**

**Check:**
```bash
# Verify .env.local exists
ls .env.local

# Check values
cat .env.local | grep MOCK
```

**Solution:**
```env
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

Clear browser cache and restart dev server.

### **Issue: TypeScript errors**

**Common fixes:**
```typescript
// Update types to match backend response
// services/api.ts
export interface Course {
  id: string;
  code: string;
  title: string;
  // Add/remove fields as needed
}
```

### **Issue: Upload failing**

**Check:**
- File size limit in backend
- CORS headers
- Content-Type header (multipart/form-data)

**Solution:**
```python
# Django settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760
```

---

## 📞 Quick Reference

| Task | File to Update | Change |
|------|----------------|--------|
| Change API URL | `.env.local` | `NEXT_PUBLIC_API_URL` |
| Enable feature | `lib/api-config.ts` | `FEATURES.*` |
| Switch mock→real | Repository files | `useMock: false` |
| Update types | `services/api.ts` | Interface definitions |
| Add endpoint | `lib/api-config.ts` | `API_ENDPOINTS` |

---

## 🎯 Next Steps

1. **Backend Team**: Review API endpoint requirements
2. **Frontend Team**: Prepare for integration testing
3. **Together**: Define API response formats
4. **Integration**: Follow this guide step-by-step

---

**Questions?** Check:
- [API Endpoints](../api/endpoints.md) - Complete API reference
- [Frontend Overview](../frontend/overview.md) - Frontend architecture
- [Troubleshooting](troubleshooting.md) - Common issues

---

**Last Updated**: February 2025  
**Version**: 1.0.0
