# Calabash LMS - Documentation

Welcome to the Calabash Learning Management System documentation. This comprehensive guide covers both frontend and backend implementation details.

---

## 📁 Documentation Structure

```
docs/
├── README.md                 ← You are here
├── backend/
│   ├── overview.md           ← Backend architecture
│   ├── api-endpoints.md      ← API documentation
│   ├── database-schema.md    ← Database structure
│   └── authentication.md     ← Auth implementation
├── frontend/
│   ├── overview.md           ← Frontend architecture
│   ├── components.md         ← Component library
│   ├── state-management.md   ← Zustand stores
│   └── styling.md            ← Material 3 design
├── api/
│   ├── endpoints.md          ← Complete API reference
│   ├── request-response.md   ← Data formats
│   └── error-codes.md        ← Error handling
└── guides/
    ├── getting-started.md    ← Setup guide
    ├── backend-integration.md ← Backend integration
    ├── deployment.md         ← Deployment guide
    └── troubleshooting.md    ← Common issues
```

---

## 🎯 Project Overview

**Calabash** is a modern Learning Management System (LMS) designed to enhance the educational experience for students and lecturers through a clean, intuitive interface and robust feature set.

### **Key Features**

#### For Students:
- ✅ Course material access (PDF, Video, Images)
- ✅ Progress tracking & completion
- ✅ Digital library with advanced search
- ✅ Personal notes with bookmarks
- ✅ Calendar & deadline tracking
- ✅ Gamification (XP, achievements, streaks)

#### For Lecturers:
- ✅ Material upload & management
- ✅ Course analytics & insights
- ✅ Student engagement tracking
- ✅ Bulk operations
- ✅ Content organization (modules)
- ✅ Visibility control

---

## 🚀 Quick Start

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### **Backend Setup** (When Ready)
```bash
cd Backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py runserver
```

---

## 📊 Current Status

| Component | Status | Completion | Notes |
|-----------|--------|------------|-------|
| **Frontend UI** | ✅ Complete | 100% | All screens implemented |
| **Mock Data** | ✅ Complete | 100% | Full demo functionality |
| **Backend API** | ⏳ Pending | 0% | Awaiting implementation |
| **Authentication** | ⏳ Pending | 0% | Mock auth in place |
| **Database** | ⏳ Pending | 0% | Schema designed |

---

## 📁 Key Documentation

### **For Frontend Developers**

1. **[Frontend Overview](frontend/overview.md)** - Architecture, tech stack, folder structure
2. **[Components](frontend/components.md)** - Component library and usage
3. **[State Management](frontend/state-management.md)** - Zustand stores and data flow
4. **[Backend Integration](guides/backend-integration.md)** - How to connect to backend

### **For Backend Developers**

1. **[Backend Overview](backend/overview.md)** - Architecture, Django setup, database
2. **[API Endpoints](backend/api-endpoints.md)** - Required endpoints with examples
3. **[Database Schema](backend/database-schema.md)** - Models and relationships
4. **[Authentication](backend/authentication.md)** - JWT auth implementation

### **For Full-Stack Integration**

1. **[API Reference](api/endpoints.md)** - Complete API documentation
2. **[Request/Response Formats](api/request-response.md)** - Data structures
3. **[Error Codes](api/error-codes.md)** - Error handling standards
4. **[Integration Guide](guides/backend-integration.md)** - Step-by-step integration

---

## 🏗️ Architecture Highlights

### **Frontend Architecture**

```
┌─────────────────────────────────────────┐
│          Next.js 15 (App Router)        │
├─────────────────────────────────────────┤
│  Components (Material 3 Design System)  │
├─────────────────────────────────────────┤
│     State Management (Zustand)          │
├─────────────────────────────────────────┤
│   API Layer (Mock ↔ Real API Switch)    │
└─────────────────────────────────────────┘
```

**Key Features:**
- Material 3 Expressive design system
- Zustand for state management
- TypeScript for type safety
- Mock data with easy real-API switching
- Responsive mobile-first design

### **Backend Architecture** (Planned)

```
┌─────────────────────────────────────────┐
│         Django REST Framework           │
├─────────────────────────────────────────┤
│         JWT Authentication              │
├─────────────────────────────────────────┤
│         PostgreSQL Database             │
└─────────────────────────────────────────┘
```

**Planned Features:**
- RESTful API design
- JWT token authentication
- PostgreSQL database
- File upload to S3/Cloudinary
- Real-time notifications (WebSocket)

---

## 🎯 Development Priorities

### **Phase 1: Core Features** (Current - Mock Data)
- ✅ User authentication UI (mock)
- ✅ Dashboard (student & lecturer)
- ✅ Course management
- ✅ Material upload & viewing
- ✅ Library browsing

### **Phase 2: Backend Integration** (Next)
- ⏳ Implement authentication API
- ⏳ Implement courses API
- ⏳ Implement materials API
- ⏳ Implement dashboard API
- ⏳ Implement analytics API

### **Phase 3: Advanced Features** (Future)
- Real-time notifications
- Video conferencing integration
- Assignment submission
- Grade management
- Discussion forums

---

## 📞 Quick Reference

| Task | Documentation |
|------|---------------|
| Setup development environment | [guides/getting-started.md](guides/getting-started.md) |
| Understand frontend structure | [frontend/overview.md](frontend/overview.md) |
| Add new API endpoint | [backend/api-endpoints.md](backend/api-endpoints.md) |
| Connect to backend | [guides/backend-integration.md](guides/backend-integration.md) |
| Deploy application | [guides/deployment.md](guides/deployment.md) |
| Fix common issues | [guides/troubleshooting.md](guides/troubleshooting.md) |

---

## 🎨 Design System

Calabash uses **Material 3 Expressive** design system with custom theming:

- **Primary Color**: Terracotta Brown (#3D1A04)
- **Secondary Color**: Sage Green
- **Accent Color**: Amber Gold
- **Typography**: Google Sans Variable
- **Icons**: Material Symbols

---

## 📄 License & Credits

**Calabash LMS** - Built for the Hackathon 2025

- Frontend: Next.js 15, TypeScript, Material 3
- Backend: Django REST Framework, PostgreSQL
- Design: Material 3 Expressive

---

## 📧 Contact & Support

For questions or issues:
- Check [troubleshooting guide](guides/troubleshooting.md)
- Review existing documentation
- Contact the development team

---

**Last Updated**: February 2025  
**Version**: 1.0.0 (Hackathon Ready)
