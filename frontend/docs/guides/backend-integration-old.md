# Backend Integration Guide

## 🎯 Current State

Your frontend is **100% functional with mock data**. All UIs are complete and ready for demo.

## 📋 What We Built for Easy Backend Swap

### **1. API Configuration Layer** (`lib/api-config.ts`)
- Central place to manage API URLs
- Feature flags for gradual rollout
- Environment-based configuration

### **2. API Client Wrapper** (`lib/api-client.ts`)
- Consistent API calls with error handling
- Built-in mock support
- Progress tracking for uploads
- Automatic retries

### **3. Repository Pattern** (`services/*.repository.ts`)
- Data access abstraction
- Easy to swap mock ↔ real API
- Type-safe responses

---

## 🚀 Migration Steps (When Backend is Ready)

### **Step 1: Update Environment Variables**

Create `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Production API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Disable mock data
NEXT_PUBLIC_ENABLE_MOCK_DATA=false

# Enable features as they're ready
NEXT_PUBLIC_DASHBOARD_API=true
NEXT_PUBLIC_COURSES_API=true
NEXT_PUBLIC_MATERIALS_API=true
NEXT_PUBLIC_AUTH_API=true
```

### **Step 2: Update Feature Flags**

In `lib/api-config.ts`:
```typescript
export const API_CONFIG = {
  FEATURES: {
    DASHBOARD_API: true,   // Changed from false
    COURSES_API: true,     // Changed from false
    MATERIALS_API: true,   // Changed from false
    AUTH_API: true,        // Changed from false
    ANALYTICS_API: true,   // Changed from false
  },
}
```

### **Step 3: Update Repositories**

Example for courses:

**BEFORE (Mock):**
```typescript
// services/course.repository.ts
async getCourses(userId: string) {
  return apiClient.get('/api/courses/', {
    useMock: true,
    mockData: MOCK_COURSES,
  });
}
```

**AFTER (Real API):**
```typescript
// services/course.repository.ts
async getCourses(userId: string) {
  return apiClient.get('/api/courses/', {
    useMock: false,  // Changed!
  });
}
```

### **Step 4: Test Each Feature**

Test in this order:
1. ✅ Authentication (Login/Signup)
2. ✅ Dashboard (Load user data)
3. ✅ Courses (List & detail)
4. ✅ Materials (Upload & view)
5. ✅ Library (Browse & filter)
6. ✅ Analytics (Charts & metrics)

---

## 📁 Files Structure

```
src/
├── lib/
│   ├── api-config.ts       ← API configuration
│   ├── api-client.ts       ← API wrapper
│   └── axios.ts            ← Axios instance
│
├── services/
│   ├── course.repository.ts    ← Course data access
│   ├── dashboard.repository.ts ← Dashboard data access
│   ├── notes.repository.ts     ← Notes data access
│   └── api.ts                  ← API types
│
├── store/
│   ├── useCourseStore.ts   ← Course state
│   ├── useDashboardStore.ts← Dashboard state
│   └── ...
│
└── data/
    └── mock-data.ts        ← Mock data (keep for fallback)
```

---

## 🔧 Repository Pattern Examples

### **Example 1: Simple GET Request**

```typescript
// services/course.repository.ts
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

export const courseRepository = {
  async getCourses() {
    const result = await apiClient.get(API_ENDPOINTS.COURSES.LIST, {
      useMock: false, // Set to true for mock, false for real
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.data;
  },
};
```

### **Example 2: POST with Data**

```typescript
// services/materials.repository.ts
export const materialRepository = {
  async createMaterial(data: CreateMaterialDTO) {
    const result = await apiClient.post(
      API_ENDPOINTS.MATERIALS.CREATE,
      data,
      { useMock: false }
    );
    
    return result;
  },
};
```

### **Example 3: File Upload**

```typescript
// services/upload.repository.ts
export const uploadRepository = {
  async uploadMaterial(
    file: File,
    metadata: Record<string, any>,
    onProgress?: (percent: number) => void
  ) {
    const result = await apiClient.upload(
      API_ENDPOINTS.MATERIALS.UPLOAD,
      file,
      metadata,
      onProgress
    );
    
    return result;
  },
};
```

### **Example 4: With Error Handling**

```typescript
// services/dashboard.repository.ts
export const dashboardRepository = {
  async getDashboard(role: string, userId: string) {
    const result = await apiClient.get(
      API_ENDPOINTS.DASHBOARD.OVERVIEW,
      { useMock: false }
    );
    
    if (!result.success) {
      return {
        ok: false as const,
        code: 'NETWORK_ERROR',
        error: result.error,
      };
    }
    
    return {
      ok: true as const,
      data: result.data,
    };
  },
};
```

---

## 🎯 Gradual Rollout Strategy

You don't have to switch everything at once!

### **Phase 1: Auth Only**
```env
NEXT_PUBLIC_AUTH_API=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true  # Keep mock for other features
```

### **Phase 2: Core Features**
```env
NEXT_PUBLIC_AUTH_API=true
NEXT_PUBLIC_COURSES_API=true
NEXT_PUBLIC_MATERIALS_API=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false  # Switch off mock
```

### **Phase 3: Full Production**
```env
NEXT_PUBLIC_AUTH_API=true
NEXT_PUBLIC_COURSES_API=true
NEXT_PUBLIC_MATERIALS_API=true
NEXT_PUBLIC_DASHBOARD_API=true
NEXT_PUBLIC_ANALYTICS_API=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

---

## 🧪 Testing Checklist

### **Before Going Live:**

- [ ] All TypeScript errors fixed
- [ ] `.env.local` created with production values
- [ ] Feature flags updated
- [ ] All repositories use `useMock: false`
- [ ] Test login/logout flow
- [ ] Test course creation
- [ ] Test material upload
- [ ] Test file download
- [ ] Test on mobile devices
- [ ] Test error states (network failures)
- [ ] Test loading states
- [ ] Check browser console for errors
- [ ] Verify analytics work
- [ ] Test with slow internet (throttle in DevTools)

---

## 🐛 Troubleshooting

### **Issue: API calls failing**
```bash
# Check if backend is running
curl https://your-backend-url.com/api/health

# Check CORS settings in backend
# Backend must allow: http://localhost:3000 (dev) or your frontend URL
```

### **Issue: Mock data still showing**
```bash
# Clear browser cache
# Delete .next folder
rm -rf .next

# Restart dev server
npm run dev
```

### **Issue: TypeScript errors**
```bash
# Check types match backend response
# Update types in services/api.ts if needed
```

---

## 📞 Quick Reference

| Task | File to Update |
|------|----------------|
| Change API URL | `.env.local` |
| Enable feature | `lib/api-config.ts` |
| Switch mock→real | Repository files |
| Update types | `services/api.ts` |
| Add endpoint | `lib/api-config.ts` |

---

## ✅ Current Status

| Feature | UI Complete | Mock Data | Backend Ready |
|---------|-------------|-----------|---------------|
| Authentication | ✅ | ✅ | ⏳ Waiting |
| Dashboard | ✅ | ✅ | ⏳ Waiting |
| Courses | ✅ | ✅ | ⏳ Waiting |
| Materials | ✅ | ✅ | ⏳ Waiting |
| Library | ✅ | ✅ | ⏳ Waiting |
| Upload | ✅ | ✅ | ⏳ Waiting |
| Analytics | ✅ | ✅ | ⏳ Waiting |
| Notes | ✅ | ✅ | ⏳ Waiting |
| Calendar | ✅ | ✅ | ⏳ Waiting |

**All UIs are complete and ready for backend integration!** 🎉

---

## 🎯 Next Steps

1. **For Demo/Hackathon:** Keep mock data, everything works!
2. **For Production:** Follow migration steps above
3. **For Testing:** Use feature flags to gradually enable APIs

**Questions?** Check `lib/api-client.ts` for usage examples or `services/course.repository.example.ts` for a complete example.
