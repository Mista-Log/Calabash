/**
 * =============================================================================
 * MOCK DATA FOR CALABASH - FRONTEND DEVELOPMENT ONLY
 * =============================================================================
 * 
 * 🎯 FOR BACKEND ENGINEERS:
 * This file contains EXEMPLAR API responses that show exactly what the frontend
 * expects from each endpoint. Use this as your reference for building serializers.
 * 
 * ✅ WHAT'S INCLUDED:
 * - Complete user profiles (student + lecturer)
 * - Full course data with nested materials
 * - Dashboard responses for both roles
 * - Notes with attachments
 * - Gamification data (optional feature)
 * 
 * 📋 HOW TO USE:
 * 1. Match field names exactly (camelCase for API responses)
 * 2. Return null for optional fields without data
 * 3. Return empty arrays [] for lists with no items
 * 4. Use ISO 8601 format for all dates: "2025-03-03T10:00:00Z"
 * 
 * 🔄 DATA SYNCHRONIZATION:
 * All mock data is interconnected - courses link to materials, materials link
 * to users, notes link to courses. This reflects real database relationships.
 */

import type {
  UserProfile,
  Course,
  Material,
  CourseDetails,
  DashboardData,
  StudentStats,
  StudentGamificationProfile,
  Achievement,
  Milestone,
} from "@/services/api";
import type { NoteEntity } from "@/types/notes";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const CURRENT_SEMESTER = 2;
const ACADEMIC_SESSION = "2024/2025";

// =============================================================================
// 1. USER PROFILES
// Backend: GET /api/users/me/ | GET /api/users/:id/
// Django: account.models.User + Student/Lecturer profiles
// =============================================================================

export const MOCK_USERS: UserProfile[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT USER
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "u-student-01",
    name: "Amina Idris",
    username: "amina.idris",
    email: "amina@student.unilag.edu.ng",
    role: "student",
    department: "Computer Science",
    semester: CURRENT_SEMESTER,
    isNewUser: false,
    bio: "Passionate software developer interested in AI and machine learning.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
  },
  // ───────────────────────────────────────────────────────────────────────────
  // LECTURER USER
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "u-lecturer-01",
    name: "Dr. Chioma Okonkwo",
    username: "c.okonkwo",
    email: "chioma.okonkwo@unilag.edu.ng",
    role: "lecturer",
    department: "Computer Science",
    isNewUser: false,
    bio: "Senior Lecturer specializing in Algorithms and Data Structures.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
  },
  // ───────────────────────────────────────────────────────────────────────────
  // SECOND LECTURER (for course diversity)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "u-lecturer-02",
    name: "Prof. Adebayo Williams",
    username: "a.williams",
    email: "adebayo.williams@unilag.edu.ng",
    role: "lecturer",
    department: "Computer Science",
    isNewUser: false,
    bio: "Professor of Computer Architecture and Systems Design.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
  },
];

// =============================================================================
// 2. COURSES
// Backend: GET /api/courses/ | GET /api/courses/:id/
// Django: courses.models.Course
// =============================================================================

export const MOCK_COURSES: Course[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // COURSE 1: Data Structures & Algorithms
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "c-csc201",
    code: "CSC 201",
    title: "Data Structures & Algorithms",
    semester: CURRENT_SEMESTER,
    description:
      "Fundamental data structures and algorithms including arrays, linked lists, " +
      "trees, graphs, sorting and searching algorithms. This course provides the " +
      "foundation for efficient problem-solving in computer science.",
    lecturerName: "Dr. Chioma Okonkwo",
    color: "#4F46E5", // Indigo
    enrollment: 420,
    materialCount: 15,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // COURSE 2: Computer Architecture
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "c-csc202",
    code: "CSC 202",
    title: "Computer Architecture",
    semester: CURRENT_SEMESTER,
    description:
      "Organization and design of computer systems. Covers CPU architecture, " +
      "memory hierarchy, pipelining, and input/output systems.",
    lecturerName: "Prof. Adebayo Williams",
    color: "#059669", // Emerald
    enrollment: 380,
    materialCount: 12,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // COURSE 3: Database Management Systems
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "c-csc203",
    code: "CSC 203",
    title: "Database Management Systems",
    semester: CURRENT_SEMESTER,
    description:
      "Introduction to database systems, ER modeling, relational algebra, " +
      "SQL, normalization, and transaction management.",
    lecturerName: "Dr. Chioma Okonkwo",
    color: "#DC2626", // Red
    enrollment: 350,
    materialCount: 10,
  },
];

// =============================================================================
// 3. MATERIALS (Learning Resources)
// Backend: GET /api/materials/ | GET /api/courses/:id/materials/
// Django: courses.models.CourseMaterial
// =============================================================================

export const MOCK_MATERIALS: Material[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // MATERIALS FOR CSC 201 - Data Structures
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "m-001",
    title: "Introduction to Binary Trees",
    courseCode: "CSC 201",
    courseId: "c-csc201",
    type: "pdf",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-28T10:00:00Z",
    url: "/media/materials/csc201/binary-trees.pdf",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "2.4 MB",
    downloads: 120,
    likes: 45,
    visibility: "public",
    lastEditedAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "m-002",
    title: "Sorting Algorithms Visualization",
    courseCode: "CSC 201",
    courseId: "c-csc201",
    type: "video",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-27T14:30:00Z",
    url: "https://www.youtube.com/embed/kPRA0W1kECg",
    youtubeUrl: "https://www.youtube.com/watch?v=kPRA0W1kECg",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "Streaming",
    duration: "15:42",
    downloads: 89,
    likes: 38,
    visibility: "public",
  },
  {
    id: "m-003",
    title: "Graph Traversal Algorithms",
    courseCode: "CSC 201",
    courseId: "c-csc201",
    type: "pdf",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-25T09:15:00Z",
    url: "/media/materials/csc201/graph-traversal.pdf",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "3.1 MB",
    downloads: 95,
    likes: 42,
    visibility: "public",
  },
  {
    id: "m-004",
    title: "CSC 201 Past Questions (2020-2024)",
    courseCode: "CSC 201",
    courseId: "c-csc201",
    type: "past-question",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-20T11:00:00Z",
    url: "/media/materials/csc201/past-questions.zip",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "15.8 MB",
    downloads: 256,
    likes: 89,
    visibility: "public",
  },
  // ───────────────────────────────────────────────────────────────────────────
  // MATERIALS FOR CSC 202 - Computer Architecture
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "m-005",
    title: "CPU Pipeline Architecture",
    courseCode: "CSC 202",
    courseId: "c-csc202",
    type: "pdf",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-28T08:00:00Z",
    url: "/media/materials/csc202/cpu-pipeline.pdf",
    uploader: "Prof. Adebayo Williams",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
    size: "3.8 MB",
    downloads: 110,
    likes: 42,
    visibility: "public",
  },
  {
    id: "m-006",
    title: "Memory Hierarchy Explained",
    courseCode: "CSC 202",
    courseId: "c-csc202",
    type: "video",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-26T16:00:00Z",
    url: "https://www.youtube.com/embed/vH8F3vZKqgE",
    youtubeUrl: "https://www.youtube.com/watch?v=vH8F3vZKqgE",
    uploader: "Prof. Adebayo Williams",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
    size: "Streaming",
    duration: "22:15",
    downloads: 78,
    likes: 35,
    visibility: "public",
  },
  {
    id: "m-007",
    title: "Instruction Set Architecture",
    courseCode: "CSC 202",
    courseId: "c-csc202",
    type: "pdf",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-24T10:30:00Z",
    url: "/media/materials/csc202/isa.pdf",
    uploader: "Prof. Adebayo Williams",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
    size: "2.9 MB",
    downloads: 92,
    likes: 38,
    visibility: "public",
  },
  // ───────────────────────────────────────────────────────────────────────────
  // MATERIALS FOR CSC 203 - Database Systems
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "m-008",
    title: "SQL Fundamentals",
    courseCode: "CSC 203",
    courseId: "c-csc203",
    type: "pdf",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-27T11:00:00Z",
    url: "/media/materials/csc203/sql-fundamentals.pdf",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "4.2 MB",
    downloads: 145,
    likes: 52,
    visibility: "public",
  },
  {
    id: "m-009",
    title: "Database Normalization Tutorial",
    courseCode: "CSC 203",
    courseId: "c-csc203",
    type: "video",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-25T13:00:00Z",
    url: "https://www.youtube.com/embed/PTZV9zNhWbI",
    youtubeUrl: "https://www.youtube.com/watch?v=PTZV9zNhWbI",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "Streaming",
    duration: "18:30",
    downloads: 98,
    likes: 44,
    visibility: "public",
  },
  {
    id: "m-010",
    title: "ER Diagram Examples",
    courseCode: "CSC 203",
    courseId: "c-csc203",
    type: "zip",
    semester: CURRENT_SEMESTER,
    uploadDate: "2025-02-22T09:00:00Z",
    url: "/media/materials/csc203/er-diagrams.zip",
    uploader: "Dr. Chioma Okonkwo",
    ownerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    size: "8.5 MB",
    downloads: 67,
    likes: 28,
    visibility: "public",
  },
];

// =============================================================================
// 4. COURSE DETAILS (Full Course with Nested Data)
// Backend: GET /api/courses/:id/
// This shows the complete structure for a single course endpoint
// =============================================================================

export const MOCK_COURSE_DETAILS: Record<string, CourseDetails> = {
  "c-csc201": {
    id: "c-csc201",
    code: "CSC 201",
    title: "Data Structures & Algorithms",
    semester: CURRENT_SEMESTER,
    description:
      "Fundamental data structures and algorithms including arrays, linked lists, " +
      "trees, graphs, sorting and searching algorithms. This course provides the " +
      "foundation for efficient problem-solving in computer science.",
    studentCount: 420,
    materialCount: 15,
    lecturer: {
      name: "Dr. Chioma Okonkwo",
      role: "Senior Lecturer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
    },
    stats: {
      rating: 4.7,
      totalRatings: 156,
      duration: "12 weeks",
    },
    youtubeUrl: "https://www.youtube.com/embed/kPRA0W1kECg",
    supplements: [
      {
        id: "sup-001",
        title: "Study Guide 2025",
        courseCode: "CSC 201",
        courseId: "c-csc201",
        type: "pdf",
        semester: CURRENT_SEMESTER,
        uploadDate: "2025-02-10T10:00:00Z",
        url: "/media/materials/csc201/study-guide.pdf",
        uploader: "Dr. Chioma Okonkwo",
        size: "1.2 MB",
        visibility: "public",
      },
      {
        id: "sup-002",
        title: "Cheat Sheet - All Algorithms",
        courseCode: "CSC 201",
        courseId: "c-csc201",
        type: "pdf",
        semester: CURRENT_SEMESTER,
        uploadDate: "2025-02-08T10:00:00Z",
        url: "/media/materials/csc201/cheat-sheet.pdf",
        uploader: "Dr. Chioma Okonkwo",
        size: "850 KB",
        visibility: "public",
      },
    ],
    modules: [
      {
        id: "mod-001",
        title: "Module 1: Introduction to Data Structures",
        order: 1,
        materials: MOCK_MATERIALS.filter(
          (m) => m.courseId === "c-csc201" && m.type === "pdf",
        ).slice(0, 3),
      },
      {
        id: "mod-002",
        title: "Module 2: Video Lectures",
        order: 2,
        materials: MOCK_MATERIALS.filter(
          (m) => m.courseId === "c-csc201" && m.type === "video",
        ),
      },
      {
        id: "mod-003",
        title: "Module 3: Practice Materials",
        order: 3,
        materials: MOCK_MATERIALS.filter(
          (m) => m.courseId === "c-csc201" && m.type === "past-question",
        ),
      },
    ],
    recentActivity: [
      {
        id: "act-001",
        type: "upload",
        description: "Uploaded 'Introduction to Binary Trees'",
        date: "2025-02-28T10:00:00Z",
      },
      {
        id: "act-002",
        type: "view",
        description: "45 students viewed 'Sorting Algorithms Visualization'",
        date: "2025-02-27T16:00:00Z",
      },
      {
        id: "act-003",
        type: "upload",
        description: "Uploaded 'Graph Traversal Algorithms'",
        date: "2025-02-25T09:15:00Z",
      },
    ],
  },
  "c-csc202": {
    id: "c-csc202",
    code: "CSC 202",
    title: "Computer Architecture",
    semester: CURRENT_SEMESTER,
    description:
      "Organization and design of computer systems. Covers CPU architecture, " +
      "memory hierarchy, pipelining, and input/output systems.",
    studentCount: 380,
    materialCount: 12,
    lecturer: {
      name: "Prof. Adebayo Williams",
      role: "Professor of Computer Science",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo",
    },
    stats: {
      rating: 4.5,
      totalRatings: 142,
      duration: "12 weeks",
    },
    youtubeUrl: "https://www.youtube.com/embed/vH8F3vZKqgE",
    supplements: [],
    modules: [
      {
        id: "mod-004",
        title: "Module 1: CPU Architecture",
        order: 1,
        materials: MOCK_MATERIALS.filter(
          (m) => m.courseId === "c-csc202" && m.type === "pdf",
        ).slice(0, 2),
      },
      {
        id: "mod-005",
        title: "Module 2: Video Lectures",
        order: 2,
        materials: MOCK_MATERIALS.filter(
          (m) => m.courseId === "c-csc202" && m.type === "video",
        ),
      },
    ],
    recentActivity: [
      {
        id: "act-004",
        type: "upload",
        description: "Uploaded 'CPU Pipeline Architecture'",
        date: "2025-02-28T08:00:00Z",
      },
      {
        id: "act-005",
        type: "view",
        description: "38 students viewed 'Memory Hierarchy Explained'",
        date: "2025-02-26T18:00:00Z",
      },
    ],
  },
};

// =============================================================================
// 5. NOTES
// Backend: GET /api/notes/ | POST /api/notes/ | PUT /api/notes/:id/
// Django: courses.models.Note
// =============================================================================

export const MOCK_NOTES: NoteEntity[] = [
  {
    id: "note-001",
    userId: "u-student-01",
    role: "student",
    title: "Binary Trees Summary",
    content: `
      <h2>Binary Trees</h2>
      <p>A binary tree is a tree data structure where each node has at most two children.</p>
      <h3>Key Properties:</h3>
      <ul>
        <li>Maximum nodes at level i: 2^i</li>
        <li>Maximum nodes in tree of height h: 2^h - 1</li>
        <li>Minimum height with n nodes: ⌊log₂(n)⌋</li>
      </ul>
      <h3>Traversal Methods:</h3>
      <p><strong>Inorder:</strong> Left → Root → Right (gives sorted output for BST)</p>
      <p><strong>Preorder:</strong> Root → Left → Right</p>
      <p><strong>Postorder:</strong> Left → Right → Root</p>
    `.trim(),
    excerpt: "Summary of binary tree properties and traversal methods.",
    scope: "course",
    status: "saved",
    pinned: true,
    courseId: "c-csc201",
    courseCode: "CSC 201",
    materialId: "m-001",
    tags: ["trees", "revision", "data-structures"],
    attachments: [
      {
        materialId: "m-001",
        title: "Introduction to Binary Trees",
        courseCode: "CSC 201",
        type: "pdf",
        url: "/media/materials/csc201/binary-trees.pdf",
      },
    ],
    createdAt: "2025-02-28T14:00:00Z",
    updatedAt: "2025-03-01T09:00:00Z",
    lastOpenedAt: "2025-03-02T10:00:00Z",
  },
  {
    id: "note-002",
    userId: "u-student-01",
    role: "student",
    title: "SQL Quick Reference",
    content: `
      <h2>SQL Commands</h2>
      <h3>DDL (Data Definition Language)</h3>
      <ul>
        <li>CREATE - Create database objects</li>
        <li>ALTER - Modify database objects</li>
        <li>DROP - Delete database objects</li>
      </ul>
      <h3>DML (Data Manipulation Language)</h3>
      <ul>
        <li>SELECT - Query data</li>
        <li>INSERT - Add new data</li>
        <li>UPDATE - Modify data</li>
        <li>DELETE - Remove data</li>
      </ul>
    `.trim(),
    excerpt: "Quick reference for SQL commands and their usage.",
    scope: "course",
    status: "saved",
    pinned: false,
    courseId: "c-csc203",
    courseCode: "CSC 203",
    tags: ["sql", "database", "reference"],
    attachments: [],
    createdAt: "2025-02-27T11:00:00Z",
    updatedAt: "2025-02-28T16:00:00Z",
    lastOpenedAt: "2025-03-01T14:00:00Z",
  },
  {
    id: "note-003",
    userId: "u-student-01",
    role: "student",
    title: "Study Plan for Mid-Semester",
    content: `
      <h2>Week 5-7 Study Plan</h2>
      <p><strong>CSC 201:</strong> Practice tree traversals, review sorting algorithms</p>
      <p><strong>CSC 202:</strong> Understand pipelining hazards, memory cache calculations</p>
      <p><strong>CSC 203:</strong> Practice SQL queries, ER diagram exercises</p>
    `.trim(),
    excerpt: "Study plan for weeks 5-7 covering all three courses.",
    scope: "general",
    status: "draft",
    pinned: false,
    tags: ["study-plan", "mid-semester"],
    attachments: [],
    createdAt: "2025-03-02T08:00:00Z",
    updatedAt: "2025-03-02T08:00:00Z",
    lastOpenedAt: "2025-03-02T08:00:00Z",
  },
];

// =============================================================================
// 6. STUDENT STATISTICS
// Backend: Included in GET /api/dashboard/student/
// These are computed from various models
// =============================================================================

export const MOCK_STUDENT_STATS: Record<string, StudentStats> = {
  "u-student-01": {
    gpa: "3.92",
    attendance: "94%",
    upcomingDeadlines: [
      {
        title: "Database Project - Phase 1",
        due: "Tomorrow",
        color: "orange", // High priority
      },
      {
        title: "Algorithm Analysis Assignment",
        due: "3 days",
        color: "sage", // Medium priority
      },
      {
        title: "Computer Architecture Quiz",
        due: "1 week",
        color: "green", // Low priority
      },
    ],
  },
};

// =============================================================================
// 7. GAMIFICATION PROFILE (Student Engagement)
// Backend: GET /api/gamification/:userId/ (Optional feature for MVP)
// Django: May require new models (see API_REFERENCE.md)
// =============================================================================

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-001",
    title: "First Steps",
    description: "Complete your first course module",
    icon: "🎯",
    category: "course",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "ach-002",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    category: "streak",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2025-02-21T10:00:00Z",
    progress: 7,
    target: 7,
  },
  {
    id: "ach-003",
    title: "Material Master",
    description: "Download 50 materials",
    icon: "📚",
    category: "material",
    rarity: "epic",
    unlocked: false,
    progress: 32,
    target: 50,
  },
  {
    id: "ach-004",
    title: "Perfect Score",
    description: "Achieve 100% in any course",
    icon: "🏆",
    category: "milestone",
    rarity: "legendary",
    unlocked: false,
    progress: 78,
    target: 100,
  },
];

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "mile-001",
    title: "Course Completer",
    description: "Complete 5 courses",
    type: "course_completion",
    progress: 2,
    target: 5,
    reward: {
      type: "xp",
      value: 500,
    },
    completed: false,
    claimed: false,
  },
  {
    id: "mile-002",
    title: "Knowledge Seeker",
    description: "View 100 materials",
    type: "material_consumption",
    progress: 67,
    target: 100,
    reward: {
      type: "badge",
      value: "knowledge-seeker",
    },
    completed: false,
    claimed: false,
  },
  {
    id: "mile-003",
    title: "Level 10 Scholar",
    description: "Reach level 10",
    type: "xp_threshold",
    progress: 5,
    target: 10,
    reward: {
      type: "title",
      value: "Distinguished Scholar",
    },
    completed: false,
    claimed: false,
  },
];

export const MOCK_GAMIFICATION: Record<string, StudentGamificationProfile> = {
  "u-student-01": {
    level: 5,
    currentXP: 350,
    xpToNextLevel: 500,
    totalXP: 2150,
    streak: {
      current: 7,
      best: 14,
      lastActivity: "2025-03-02T10:00:00Z",
    },
    title: "Academic Explorer",
    badges: ["first-course", "week-streak", "early-adopter"],
    achievements: MOCK_ACHIEVEMENTS,
    milestones: MOCK_MILESTONES,
  },
};

// =============================================================================
// 8. COURSE PROGRESS
// Backend: Track student progress per course (may need CourseEnrollment model)
// Key: userId, Value: Record<courseId, progressPercentage>
// =============================================================================

export const MOCK_COURSE_PROGRESS: Record<string, Record<string, number>> = {
  "u-student-01": {
    "c-csc201": 45, // 45% complete
    "c-csc202": 78, // 78% complete
    "c-csc203": 32, // 32% complete
  },
};

// =============================================================================
// 9. DASHBOARD DATA (Complete Responses)
// Backend: GET /api/dashboard/student/ | GET /api/dashboard/lecturer/
// This shows the complete structure for dashboard endpoints
// =============================================================================

/**
 * Student Dashboard Response
 * Backend: GET /api/dashboard/student/
 */
export const MOCK_STUDENT_DASHBOARD: DashboardData = {
  user: MOCK_USERS[0], // Amina (student)
  courses: MOCK_COURSES,
  recentMaterials: MOCK_MATERIALS.slice(0, 8),
  studentStats: MOCK_STUDENT_STATS["u-student-01"],
  courseProgress: MOCK_COURSE_PROGRESS["u-student-01"],
  gamification: MOCK_GAMIFICATION["u-student-01"],
};

/**
 * Lecturer Dashboard Response
 * Backend: GET /api/dashboard/lecturer/
 */
export const MOCK_LECTURER_DASHBOARD: DashboardData = {
  user: MOCK_USERS[1], // Dr. Chioma (lecturer)
  courses: MOCK_COURSES.filter(
    (c) => c.lecturerName === "Dr. Chioma Okonkwo",
  ),
  recentMaterials: MOCK_MATERIALS.filter(
    (m) => m.uploader === "Dr. Chioma Okonkwo",
  ).slice(0, 5),
  lecturerStats: {
    totalStudents: 770, // Sum of enrollment in taught courses
    totalUploads: MOCK_MATERIALS.filter(
      (m) => m.uploader === "Dr. Chioma Okonkwo",
    ).length,
    totalViews: 8200,
    activeCourses: 2,
    trendingMaterial: {
      title: "SQL Fundamentals",
      views: 145,
      downloads: 145,
      trend: 25, // 25% increase this week
    },
    monthlyUploads: [
      { name: "Jan", uploads: 3, value: 3 },
      { name: "Feb", uploads: 5, value: 5 },
      { name: "Mar", uploads: 2, value: 2 },
    ],
    courseEngagement: [
      { name: "CSC 201", engagement: 85, value: 85 },
      { name: "CSC 203", engagement: 72, value: 72 },
    ],
  },
};

// =============================================================================
// 10. HELPER FUNCTIONS (For Frontend Use Only)
// Backend: These represent what your API endpoints should return
// =============================================================================

/**
 * Get materials for a specific course
 * Backend equivalent: GET /api/courses/:courseId/materials
 * @param courseId - The course ID (e.g., "c-csc201")
 */
export const getMaterialsByCourse = (courseId: string): Material[] => {
  return MOCK_MATERIALS.filter((m) => m.courseId === courseId);
};

/**
 * Get courses for a specific semester
 * Backend equivalent: GET /api/courses?semester=:semester
 * @param semester - Semester number (1, 2, 3, etc.)
 */
export const getCoursesBySemester = (semester: number): Course[] => {
  return MOCK_COURSES.filter((c) => c.semester === semester);
};

/**
 * Get user by ID
 * Backend equivalent: GET /api/users/:userId
 * @param userId - The user ID (e.g., "u-student-01")
 */
export const getUserById = (userId: string): UserProfile | undefined => {
  return MOCK_USERS.find((u) => u.id === userId);
};

/**
 * Get course details by ID
 * Backend equivalent: GET /api/courses/:courseId
 * @param courseId - The course ID (e.g., "c-csc201")
 */
export const getCourseDetails = (courseId: string): CourseDetails | undefined => {
  return MOCK_COURSE_DETAILS[courseId];
};

/**
 * Get notes for a user
 * Backend equivalent: GET /api/notes/?userId=:userId
 * @param userId - The user ID
 * @param role - User role ("student" | "lecturer")
 */
export const getNotesByUser = (
  userId: string,
  role: "student" | "lecturer",
): NoteEntity[] => {
  return MOCK_NOTES.filter((n) => n.userId === userId && n.role === role);
};

/**
 * Get dashboard data for a user
 * Backend equivalent: GET /api/dashboard/student/ or GET /api/dashboard/lecturer/
 * @param userId - The user ID
 * @param role - User role ("student" | "lecturer")
 */
export const getDashboardData = (
  userId: string,
  role: "student" | "lecturer",
): DashboardData | undefined => {
  if (role === "student") {
    return MOCK_STUDENT_DASHBOARD.user.id === userId
      ? MOCK_STUDENT_DASHBOARD
      : undefined;
  }
  return MOCK_LECTURER_DASHBOARD.user.id === userId
    ? MOCK_LECTURER_DASHBOARD
    : undefined;
};

// =============================================================================
// EXPORT ALL (For Easy Import)
// =============================================================================

export const mockData = {
  users: MOCK_USERS,
  courses: MOCK_COURSES,
  materials: MOCK_MATERIALS,
  courseDetails: MOCK_COURSE_DETAILS,
  notes: MOCK_NOTES,
  studentStats: MOCK_STUDENT_STATS,
  gamification: MOCK_GAMIFICATION,
  courseProgress: MOCK_COURSE_PROGRESS,
  studentDashboard: MOCK_STUDENT_DASHBOARD,
  lecturerDashboard: MOCK_LECTURER_DASHBOARD,
};

export default mockData;
