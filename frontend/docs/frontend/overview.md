# Frontend Overview

## Architecture

The Calabash frontend is built with **Next.js 15** using the App Router, **TypeScript** for type safety, and **Material 3 Expressive** design system.

---

## 🏗️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | React framework with SSR/SSG |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Design System** | Material 3 | Custom | Google's design system |
| **State Management** | Zustand | 5.x | Lightweight state |
| **HTTP Client** | Axios | 1.x | API requests |
| **Charts** | Recharts | 3.x | Data visualization |
| **PDF** | react-pdf | 10.x | PDF viewing |
| **Forms** | React Hook Form | 7.x | Form handling |
| **Validation** | Zod | 4.x | Schema validation |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (app-shell)/          # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── library/
│   │   │   ├── notes/
│   │   │   ├── calendar/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── upload/
│   │   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/
│   │   ├── core/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── features/             # Feature-specific components
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── library/
│   │   │   └── ...
│   │   └── layout/               # Layout components
│   │       ├── MainLayout.tsx
│   │       ├── Toolbar.tsx
│   │       └── NavigationRail.tsx
│   │
│   ├── lib/
│   │   ├── api-config.ts         # API configuration
│   │   ├── api-client.ts         # API wrapper
│   │   ├── axios.ts              # Axios instance
│   │   └── utils.ts              # Utility functions
│   │
│   ├── services/
│   │   ├── course.repository.ts  # Course data access
│   │   ├── dashboard.repository.ts
│   │   ├── notes.repository.ts
│   │   └── api.ts                # API types
│   │
│   ├── store/
│   │   ├── useUserStore.ts       # User state
│   │   ├── useCourseStore.ts     # Course state
│   │   ├── useDashboardStore.ts  # Dashboard state
│   │   └── ...
│   │
│   ├── types/
│   │   ├── courses.ts            # Course types
│   │   ├── dashboard.ts          # Dashboard types
│   │   └── ...
│   │
│   ├── data/
│   │   └── mock-data.ts          # Mock data for development
│   │
│   └── hooks/
│       └── useMaterialProgress.ts # Custom hooks
│
├── public/                       # Static assets
├── docs/                         # Documentation
└── package.json
```

---

## 🎨 Design System

### **Material 3 Expressive**

Calabash uses a custom implementation of Material 3 with:

- **Light/Dark themes** - Automatic theme switching
- **Custom color palette** - Terracotta, Sage, Amber
- **Typography** - Google Sans Variable font
- **Motion** - Custom easing curves
- **Components** - 40+ reusable components

### **Color Palette**

```css
/* Primary Colors */
--md-sys-color-primary: #3D1A04;
--md-sys-color-on-primary: #FFFFFF;
--md-sys-color-primary-container: #FFDCC3;

/* Secondary Colors */
--md-sys-color-secondary: #6C503A;
--md-sys-color-secondary-container: #F4D8BC;

/* Tertiary Colors */
--md-sys-color-tertiary: #4A5D23;
--md-sys-color-tertiary-container: #CBE59B;

/* Surface Colors */
--md-sys-color-surface: #FFFBFE;
--md-sys-color-surface-container: #F9F5F9;
```

---

## 🔄 State Management

### **Zustand Stores**

We use Zustand for lightweight, boilerplate-free state management:

```typescript
// Example: useCourseStore
import { create } from 'zustand';

interface CourseState {
  courses: Course[];
  status: 'idle' | 'loading' | 'success' | 'error';
  setCourses: (courses: Course[]) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  status: 'idle',
  setCourses: (courses) => set({ courses, status: 'success' }),
}));
```

### **Available Stores**

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `useUserStore` | User auth & profile | localStorage |
| `useCourseStore` | Course list & progress | localStorage |
| `useDashboardStore` | Dashboard data | API only |
| `useLibraryStore` | Material library | localStorage |
| `useNotesStore` | User notes | localStorage |
| `useCalendarStore` | Calendar events | localStorage |
| `useUploadStore` | Upload state | API only |

---

## 🔌 API Integration

### **API Client with Mock Support**

```typescript
// lib/api-client.ts
import apiClient from '@/lib/api-client';

// Use mock data (development)
const result = await apiClient.get('/api/courses/', {
  useMock: true,
  mockData: MOCK_COURSES,
});

// Use real API (production)
const result = await apiClient.get('/api/courses/', {
  useMock: false,
});
```

### **Repository Pattern**

```typescript
// services/course.repository.ts
export const courseRepository = {
  async getCoursesForUser(role: string, userId: string) {
    const result = await apiClient.get(API_ENDPOINTS.COURSES.LIST, {
      useMock: !shouldUseRealAPI('COURSES_API'),
    });
    
    if (!result.success) {
      return { ok: false, error: result.error };
    }
    
    return { ok: true, data: result.data };
  },
};
```

### **Feature Flags**

Control API usage with environment variables:

```env
# .env.local
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
NEXT_PUBLIC_COURSES_API=false
NEXT_PUBLIC_MATERIALS_API=false
```

---

## 📄 Key Features

### **1. Authentication**
- Login/Signup pages
- Role selection (Student/Lecturer)
- JWT token management
- Session expiry handling
- Protected routes

### **2. Dashboard**
- **Student View**: Courses, progress, gamification, deadlines
- **Lecturer View**: Analytics, uploads, student engagement
- Real-time data sync
- Loading skeletons

### **3. Courses**
- Course listing with filters
- Detailed course view
- Module organization
- Material access
- Progress tracking

### **4. Library**
- Material catalog
- Advanced filtering (type, semester, course)
- Search functionality
- PDF/Video/Image preview
- Download capability

### **5. Material Viewer**
- Multi-type support (PDF, Video, Image)
- PDF viewer with zoom, navigation
- Video player (YouTube + files)
- Image gallery with zoom
- Bookmarks & notes
- Progress tracking

### **6. Upload**
- Multi-step wizard
- Drag & drop support
- YouTube URL detection
- File type validation
- Progress indicator

### **7. Analytics**
- Engagement charts
- Material views
- Student progress
- Export to CSV

### **8. Notes**
- Rich text editor (TipTap)
- Auto-save drafts
- Course tagging
- Search functionality
- Pin important notes

### **9. Calendar**
- Monthly view
- Event categories (Exam, Lecture, Deadline)
- Add/Edit/Delete events
- Course integration

---

## 🎯 Component Library

### **Core Components** (40+)

Located in `components/core/`:

| Component | Usage | Example |
|-----------|-------|---------|
| `M3Button` | Material 3 button | `<M3Button variant="filled">Click</M3Button>` |
| `Card` | Content container | `<Card><CardContent>...</CardContent></Card>` |
| `Dialog` | Modal dialogs | `<Dialog open={open}>...</Dialog>` |
| `Input` | Form inputs | `<Input placeholder="Enter text" />` |
| `Chip` | Tags/filters | `<Chip label="PDF" icon="description" />` |
| `Badge` | Status indicators | `<Badge variant="success">Active</Badge>` |

### **Feature Components**

Located in `components/features/`:

- `DashboardSkeleton` - Loading states
- `MaterialCard` - Material display
- `CourseProgress` - Progress visualization
- `NotificationBell` - Real-time notifications
- `VirtualGrid` - Performance optimization

---

## 📱 Responsive Design

### **Breakpoints**

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### **Navigation**

- **Mobile (< 1024px)**: Hamburger menu drawer
- **Desktop (≥ 1024px)**: Fixed navigation rail
- **Toolbar**: Fixed top bar with search, notifications, user menu

---

## 🔧 Development

### **Scripts**

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Environment Variables**

```env
NEXT_PUBLIC_API_URL=https://api.calabash.com
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
NEXT_PUBLIC_COURSES_API=false
```

### **TypeScript Configuration**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🚀 Performance Optimizations

### **Implemented**

- ✅ Code splitting (dynamic imports)
- ✅ Image optimization (Next.js Image)
- ✅ Lazy loading (React.lazy)
- ✅ Memoization (React.memo, useMemo)
- ✅ Virtual scrolling (for large lists)
- ✅ Debounced search

### **Bundle Size**

- **Total**: ~1.8MB (gzipped)
- **Main chunk**: ~450KB
- **Vendor chunks**: ~1.3MB

---

## 🧪 Testing Strategy

### **Unit Tests** (Planned)
- Utility functions
- Store actions
- API client

### **Component Tests** (Planned)
- Core components
- Feature components
- Form validation

### **E2E Tests** (Planned)
- Login flow
- Course navigation
- Material upload
- Progress tracking

---

## 📊 Current Status

| Feature | UI | State | API Integration | Status |
|---------|----|-------|-----------------|--------|
| Authentication | ✅ | ✅ | ⏳ | Ready for backend |
| Dashboard | ✅ | ✅ | ⏳ | Ready for backend |
| Courses | ✅ | ✅ | ⏳ | Ready for backend |
| Materials | ✅ | ✅ | ⏳ | Ready for backend |
| Library | ✅ | ✅ | ⏳ | Ready for backend |
| Upload | ✅ | ✅ | ⏳ | Ready for backend |
| Analytics | ✅ | ✅ | ⏳ | Ready for backend |
| Notes | ✅ | ✅ | ⏳ | Ready for backend |
| Calendar | ✅ | ✅ | ⏳ | Ready for backend |

**Overall Completion**: 100% UI, 0% Backend Integration

---

## 🔗 Related Documentation

- [Backend Overview](../backend/overview.md) - Backend architecture
- [API Endpoints](../api/endpoints.md) - API reference
- [Backend Integration Guide](../guides/backend-integration.md) - How to connect
- [Component Library](components.md) - Detailed component docs
- [State Management](state-management.md) - Zustand guide

---

**Last Updated**: February 2025  
**Maintained By**: Frontend Team
