/**
 * =============================================================================
 * MOCK DATA STORE - FOR FRONTEND DEVELOPMENT ONLY
 * =============================================================================
 * 
 * 🎯 FOR BACKEND ENGINEERS:
 * This store manages mock data during frontend development. When the backend
 * API is ready, this store will be replaced with actual API calls.
 * 
 * 📦 WHAT THE BACKEND NEEDS TO PROVIDE:
 * 1. User data: GET /api/users/me/
 * 2. Course data: GET /api/courses/
 * 3. Material data: GET /api/materials/ or GET /api/courses/:id/materials/
 * 4. Dashboard data: GET /api/dashboard/student/ or /api/dashboard/lecturer/
 * 
 * 🔄 STORE ACTIONS → API ENDPOINTS MAPPING:
 * - setUsers() ← GET /api/users/
 * - setCourses() ← GET /api/courses/
 * - setMaterials() ← GET /api/materials/
 * - addMaterial() ← POST /api/materials/
 * - updateCourseProgress() ← POST /api/courses/:id/progress/
 * - updateGamification() ← PUT /api/gamification/:userId/
 * - addXP() ← POST /api/gamification/:userId/xp/
 * - getDashboardData() ← GET /api/dashboard/:role/
 * 
 * ✅ ALL DATA IS INTERCONNECTED:
 * - Courses link to materials via courseId
 * - Materials link to users via uploader
 * - Notes link to courses and materials
 * This reflects real database relationships
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Course, Material, DashboardData, StudentGamificationProfile } from '@/services/api';
import {
  MOCK_USERS,
  MOCK_COURSES,
  MOCK_MATERIALS,
  MOCK_NOTES,
  MOCK_STUDENT_STATS,
  MOCK_GAMIFICATION,
  MOCK_COURSE_PROGRESS,
  MOCK_STUDENT_DASHBOARD,
  MOCK_LECTURER_DASHBOARD,
} from '@/data/mock-data';

// =============================================================================
// STORE STATE INTERFACE
/*
 * Backend: This represents all the data the frontend needs to function
 * =============================================================================
 */

interface MockDataState {
  // Core data (from API)
  users: UserProfile[];
  courses: Course[];
  materials: Material[];

  // Frontend-computed/aggregated data
  // Backend: These may need separate models or can be computed on-the-fly
  courseProgress: Record<string, Record<string, number>>;  // userId -> courseId -> progress
  studentStats: Record<string, StudentStatsRecord>;
  gamificationProfiles: Record<string, StudentGamificationProfile>;

  // Store actions (these will become API calls)
  setUsers: (users: UserProfile[]) => void;
  setCourses: (courses: Course[]) => void;
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateCourseProgress: (userId: string, courseId: string, progress: number) => void;
  updateGamification: (userId: string, updates: Partial<StudentGamificationProfile>) => void;
  addXP: (userId: string, amount: number) => void;
  getDashboardData: (userId: string, role: 'student' | 'lecturer') => DashboardData;
}

// Student statistics record
interface StudentStatsRecord {
  gpa: string;
  attendance: string;
  upcomingDeadlines: Array<{
    title: string;
    due: string;
    color: 'orange' | 'sage' | 'green';
  }>;
}

// =============================================================================
/*
 * STORE IMPLEMENTATION
 * Backend: Ignore the implementation details - focus on the data structures above
 * =============================================================================
 */

export const useMockDataStore = create<MockDataState>()(
  persist(
    (set, get) => ({
      // ───────────────────────────────────────────────────────────────────────
      // INITIAL STATE (from enhanced mock data)
      // ───────────────────────────────────────────────────────────────────────
      users: MOCK_USERS,
      courses: MOCK_COURSES,
      materials: MOCK_MATERIALS,
      courseProgress: MOCK_COURSE_PROGRESS,
      studentStats: MOCK_STUDENT_STATS,
      gamificationProfiles: MOCK_GAMIFICATION,

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Replace all users
      // Backend equivalent: GET /api/users/
      // ───────────────────────────────────────────────────────────────────────
      setUsers: (users) => set({ users }),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Replace all courses
      // Backend equivalent: GET /api/courses/
      // ───────────────────────────────────────────────────────────────────────
      setCourses: (courses) => set({ courses }),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Replace all materials
      // Backend equivalent: GET /api/materials/
      // ───────────────────────────────────────────────────────────────────────
      setMaterials: (materials) => set({ materials }),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Add a new material
      // Backend equivalent: POST /api/materials/
      // ───────────────────────────────────────────────────────────────────────
      addMaterial: (material) => set((state) => ({
        materials: [material, ...state.materials],
      })),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Update course progress
      // Backend equivalent: POST /api/courses/:id/progress/
      // Tracks student's progress in a specific course (0-100%)
      // ───────────────────────────────────────────────────────────────────────
      updateCourseProgress: (userId, courseId, progress) => set((state) => ({
        courseProgress: {
          ...state.courseProgress,
          [userId]: {
            ...state.courseProgress[userId],
            [courseId]: progress,
          },
        },
      })),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Update gamification profile
      // Backend equivalent: PUT /api/gamification/:userId/
      // Updates student's gamification data (level, XP, achievements, etc.)
      // ───────────────────────────────────────────────────────────────────────
      updateGamification: (userId, updates) => set((state) => ({
        gamificationProfiles: {
          ...state.gamificationProfiles,
          [userId]: {
            ...state.gamificationProfiles[userId],
            ...updates,
          },
        },
      })),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Add XP to student
      // Backend equivalent: POST /api/gamification/:userId/xp/
      // Awards experience points to a student for completing actions
      // ───────────────────────────────────────────────────────────────────────
      addXP: (userId, amount) => set((state) => {
        const profile = state.gamificationProfiles[userId];
        if (!profile) return state;

        const newCurrentXP = profile.currentXP + amount;
        const newTotalXP = profile.totalXP + amount;

        // Check for level up
        const leveledUp = newCurrentXP >= profile.xpToNextLevel;

        return {
          gamificationProfiles: {
            ...state.gamificationProfiles,
            [userId]: {
              ...profile,
              currentXP: newCurrentXP,
              totalXP: newTotalXP,
              // Auto-level-up logic (optional, backend may handle this)
              level: leveledUp ? profile.level + 1 : profile.level,
              currentXP: leveledUp ? 0 : newCurrentXP,
              xpToNextLevel: leveledUp ? Math.round(profile.xpToNextLevel * 1.2) : profile.xpToNextLevel,
            },
          },
        };
      }),

      // ───────────────────────────────────────────────────────────────────────
      // ACTION: Get dashboard data for a user
      // Backend equivalent: GET /api/dashboard/student/ or /api/dashboard/lecturer/
      // Returns complete dashboard data including courses, materials, stats, etc.
      // ───────────────────────────────────────────────────────────────────────
      getDashboardData: (userId, role) => {
        const state = get();

        // Find user by ID, then by role, then default to first user
        const user = state.users.find(u => u.id === userId) ??
          state.users.find(u => u.role === role) ??
          state.users[0];

        if (!user) {
          throw new Error("No user found for dashboard");
        }

        // Return pre-built mock dashboard data (matches API response structure)
        if (role === 'lecturer') {
          // Use lecturer dashboard mock data
          return MOCK_LECTURER_DASHBOARD.user.id === userId
            ? MOCK_LECTURER_DASHBOARD
            : { ...MOCK_LECTURER_DASHBOARD, user };
        }

        // Use student dashboard mock data
        return MOCK_STUDENT_DASHBOARD.user.id === userId
          ? MOCK_STUDENT_DASHBOARD
          : { ...MOCK_STUDENT_DASHBOARD, user };
      },
    }),
    {
      name: 'calabash-mock-data',  // LocalStorage key for persistence
    }
  )
);
