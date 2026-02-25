/**
 * Demo Data Seeder for Calabash
 * Populates rich mock data for testing and demonstration
 */

import type { UserProfile, Course, Material } from "@/services/api";
import type { NoteEntity } from "@/types/notes";
import type { EventCategory, CalendarEvent as StoreCalendarEvent } from "@/store/useCalendarStore";
import { useMockDataStore } from "@/store/useMockDataStore";
import { useNotesStore } from "@/store/useNotesStore";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useUserStore } from "@/store/useUserStore";

// Demo Users
export const DEMO_STUDENT_USER: UserProfile = {
  id: "demo-student-001",
  name: "Alex Johnson",
  email: "alex.johnson@calabash.edu",
  role: "student",
  department: "Computer Science",
  semester: 2,
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  isNewUser: false,
};

export const DEMO_LECTURER_USER: UserProfile = {
  id: "demo-lecturer-001",
  name: "Dr. Sarah Chen",
  email: "sarah.chen@calabash.edu",
  role: "lecturer",
  department: "Computer Science",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  isNewUser: false,
};

// Demo Courses
export const DEMO_COURSES: Course[] = [
  {
    id: "course-001",
    code: "CSC 101",
    title: "Introduction to Computing",
    semester: 1,
    description: "Fundamental concepts of computer science, algorithms, and logic.",
    lecturerName: "Dr. Sarah Chen",
    enrollment: 150,
    materialCount: 12,
  },
  {
    id: "course-002",
    code: "CSC 201",
    title: "Data Structures",
    semester: 2,
    description: "Arrays, linked lists, trees, graphs, and algorithm analysis.",
    lecturerName: "Dr. Sarah Chen",
    enrollment: 120,
    materialCount: 18,
  },
  {
    id: "course-003",
    code: "CSC 301",
    title: "Database Systems",
    semester: 3,
    description: "Relational databases, SQL, normalization, and transaction management.",
    lecturerName: "Prof. Michael Brown",
    enrollment: 95,
    materialCount: 15,
  },
  {
    id: "course-004",
    code: "CSC 401",
    title: "Software Engineering",
    semester: 4,
    description: "Software development lifecycle, design patterns, and agile methodologies.",
    lecturerName: "Dr. Emily Watson",
    enrollment: 80,
    materialCount: 20,
  },
];

// Demo Materials
export const DEMO_MATERIALS: Material[] = [
  {
    id: "material-001",
    title: "Lecture 1: Introduction to Algorithms",
    courseCode: "CSC 101",
    courseId: "course-001",
    type: "pdf",
    semester: 1,
    uploadDate: "2025-02-15T10:00:00Z",
    url: "#",
    uploader: "Dr. Sarah Chen",
    size: "2.5 MB",
    downloads: 145,
    likes: 32,
    visibility: "public",
  },
  {
    id: "material-002",
    title: "Lecture 2: Sorting Algorithms",
    courseCode: "CSC 101",
    courseId: "course-001",
    type: "video",
    semester: 1,
    uploadDate: "2025-02-18T14:00:00Z",
    url: "https://www.youtube.com/watch?v=example1",
    youtubeUrl: "https://www.youtube.com/watch?v=example1",
    uploader: "Dr. Sarah Chen",
    duration: "45 min",
    visibility: "public",
  },
  {
    id: "material-003",
    title: "Midterm Past Questions 2024",
    courseCode: "CSC 201",
    courseId: "course-002",
    type: "past-question",
    semester: 2,
    uploadDate: "2025-02-10T09:00:00Z",
    url: "#",
    uploader: "Dr. Sarah Chen",
    size: "1.8 MB",
    downloads: 230,
    likes: 58,
    visibility: "public",
  },
  {
    id: "material-004",
    title: "Database Design Project",
    courseCode: "CSC 301",
    courseId: "course-003",
    type: "zip",
    semester: 3,
    uploadDate: "2025-02-20T16:00:00Z",
    url: "#",
    uploader: "Prof. Michael Brown",
    size: "15.2 MB",
    downloads: 89,
    likes: 21,
    visibility: "public",
  },
];

// Demo Notes
export const DEMO_NOTES: Partial<NoteEntity>[] = [
  {
    title: "CSC 101 - Week 1 Notes",
    content: "<p>Key concepts from introduction to computing:</p><ul><li>Binary representation</li><li>Boolean logic</li><li>Basic algorithms</li></ul>",
    excerpt: "Key concepts from introduction to computing",
    courseId: "course-001",
    courseCode: "CSC 101",
    tags: ["algorithms", "basics", "week1"],
    pinned: true,
    scope: "course",
    status: "published",
    attachments: [],
  },
  {
    title: "Data Structures Study Guide",
    content: "<p>Important data structures to remember:</p><ol><li>Arrays - O(1) access</li><li>Linked Lists - O(n) access</li><li>Trees - O(log n) operations</li></ol>",
    excerpt: "Important data structures to remember",
    courseId: "course-002",
    courseCode: "CSC 201",
    tags: ["study-guide", "data-structures"],
    pinned: false,
    scope: "course",
    status: "draft",
    attachments: [],
  },
];

// Demo Calendar Events
export const DEMO_EVENTS: Partial<StoreCalendarEvent>[] = [
  {
    title: "CSC 101 Midterm Exam",
    description: "Covers lectures 1-5. Bring student ID and calculator.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    startTime: "10:00",
    endTime: "12:00",
    category: "Exam",
    courseId: "course-001",
  },
  {
    title: "Database Project Due",
    description: "Submit your database design project via the portal.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    startTime: "00:00",
    endTime: "23:59",
    category: "Deadline",
    courseId: "course-003",
  },
  {
    title: "Guest Lecture: AI in Industry",
    description: "Special guest speaker from Tech Corp.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    startTime: "14:00",
    endTime: "15:30",
    category: "Lecture",
    courseId: "course-004",
  },
];

/**
 * Seed demo data for student user
 */
export async function seedStudentDemoData() {
  const mockState = useMockDataStore.getState();
  const userStore = useUserStore.getState();
  
  // Set user
  userStore.login(DEMO_STUDENT_USER, "demo-token", null);
  
  // Set courses
  mockState.setCourses(DEMO_COURSES);
  
  // Set materials
  mockState.setMaterials(DEMO_MATERIALS);
  
  // Seed notes
  const notesStore = useNotesStore.getState();
  await notesStore.hydrateForContext({ userId: DEMO_STUDENT_USER.id, role: "student" });
  for (const note of DEMO_NOTES) {
    const createdId = await notesStore.createDraft(
      { userId: DEMO_STUDENT_USER.id, role: "student" },
      {
        title: note.title,
        content: note.content,
        scope: note.scope,
        courseId: note.courseId,
        courseCode: note.courseCode,
      }
    );
    if (createdId && note.pinned) {
      await notesStore.togglePin(createdId);
    }
  }
  
  // Seed calendar events
  const calendarStore = useCalendarStore.getState();
  for (const event of DEMO_EVENTS) {
    if (event.title && event.date && event.startTime && event.endTime && event.category) {
      calendarStore.addEvent({
        title: event.title,
        description: event.description || "",
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        category: event.category,
        courseId: event.courseId,
      });
    }
  }
  
  console.log("[Demo Seeder] Student demo data seeded successfully");
}

/**
 * Seed demo data for lecturer user
 */
export async function seedLecturerDemoData() {
  const mockState = useMockDataStore.getState();
  const userStore = useUserStore.getState();
  
  // Set user
  userStore.login(DEMO_LECTURER_USER, "demo-token", null);
  
  // Set courses
  mockState.setCourses(DEMO_COURSES);
  
  // Set materials
  mockState.setMaterials(DEMO_MATERIALS);
  
  console.log("[Demo Seeder] Lecturer demo data seeded successfully");
}

/**
 * Clear all demo data
 */
export function clearDemoData() {
  const userStore = useUserStore.getState();
  const calendarStore = useCalendarStore.getState();
  
  userStore.logout();
  // Clear calendar events by removing all
  const eventIds = calendarStore.events.map(e => e.id);
  eventIds.forEach(id => calendarStore.removeEvent(id));
  
  console.log("[Demo Seeder] Demo data cleared");
}

/**
 * Check if demo data is already seeded
 */
export function isDemoDataSeeded(): boolean {
  const mockState = useMockDataStore.getState();
  return mockState.courses.length > 0 && mockState.materials.length > 0;
}
