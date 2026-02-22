
import { UserProfile, Course, Material } from "@/services/api";
import type { NoteEntity } from "@/types/notes";

// --- Types (Re-exporting or extending if needed) ---
export type MockUser = UserProfile;
export type MockCourse = Course;
export type MockMaterial = Material;

// --- Mock Data ---

export const MOCK_USERS: MockUser[] = [
    {
        id: "u-student-01",
        name: "Amina K. Idris",
        username: "amina",
        email: "amina@student.unilag.edu.ng",
        role: "student",
        department: "Computer Science",
        semester: 2,
        isNewUser: false,
    },
    {
        id: "u-lecturer-01",
        name: "Dr. Chioma Okonkwo",
        username: "chioma",
        email: "chioma@unilag.edu.ng",
        role: "lecturer",
        department: "Computer Science",
        semester: 2, // Semesters are usually global for the school
        isNewUser: false,
    },
];

export const MOCK_COURSES: MockCourse[] = [
    {
        id: "c-csc201",
        title: "Data Structures & Algorithms",
        code: "CSC 201",
        description: "Fundamental data structures and algorithms analysis.",
        semester: 2,
        lecturerName: "Dr. Chioma Okonkwo",
        color: "hsl(var(--chart-1))",
        enrollment: 420,
        materialCount: 15,
    },
    {
        id: "c-csc202",
        title: "Computer Architecture",
        code: "CSC 202",
        description: "Organization and design of computer systems.",
        semester: 2,
        lecturerName: "Prof. Adebayo",
        color: "hsl(var(--chart-2))",
        enrollment: 380,
        materialCount: 12,
    },
    {
        id: "c-mth201",
        title: "Linear Algebra",
        code: "MTH 201",
        description: "Vector spaces, matrices, and linear transformations.",
        semester: 2,
        lecturerName: "Dr. Ibrahim",
        color: "hsl(var(--chart-3))",
        enrollment: 510,
        materialCount: 8,
    },
];

export const MOCK_MATERIALS: MockMaterial[] = [
    {
        id: "m-001",
        title: "Introduction to Binary Trees",
        semester: 2,
        type: "pdf",
        url: "#",
        uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        size: "2.4 MB",
        courseId: "c-csc201",
        courseCode: "CSC 201",
        uploader: "Dr. Chioma Okonkwo",
        downloads: 120,
        likes: 45,
    },
    {
        id: "m-002",
        title: "Week 4 Assignment: AVL Trees",
        semester: 2,
        type: "pdf",
        url: "#",
        uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        size: "1.1 MB",
        courseId: "c-csc201",
        courseCode: "CSC 201",
        uploader: "Dr. Chioma Okonkwo",
        downloads: 85,
        likes: 12,
    },
    {
        id: "m-003",
        title: "2023 Past Question - Logic Gates",
        type: "past-question",
        url: "#",
        uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        size: "5.6 MB",
        courseId: "c-csc202",
        courseCode: "CSC 202",
        semester: 2,
        uploader: "Student Union",
        downloads: 340,
        likes: 89,
    },
    {
        id: "m-004",
        title: "Linear Transformations Video",
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        size: "Streaming",
        courseId: "c-mth201",
        courseCode: "MTH 201",
        semester: 2,
        uploader: "Dr. Ibrahim",
        downloads: 45,
        likes: 8,
    },
];

export const MOCK_NOTES: NoteEntity[] = [
    {
        id: "note-001",
        userId: "u-student-01",
        role: "student",
        title: "Binary Trees - Traversal Summary",
        content:
            "<p>Use inorder for sorted output in BST. Preorder is useful for serialization and DFS-style reconstruction.</p><ul><li>Inorder: LNR</li><li>Preorder: NLR</li><li>Postorder: LRN</li></ul>",
        excerpt: "Use inorder for sorted output in BST.",
        scope: "course",
        status: "saved",
        pinned: true,
        courseId: "c-csc201",
        courseCode: "CSC 201",
        tags: ["trees", "traversal", "revision"],
        attachments: [
            {
                materialId: "m-001",
                title: "Introduction to Binary Trees",
                courseCode: "CSC 201",
                type: "pdf",
                url: "#",
            },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
        id: "note-002",
        userId: "u-student-01",
        role: "student",
        title: "AVL Rotation Checklist",
        content:
            "<p>LL and RR are single rotations. LR and RL require two-step rotations.</p><p>Remember to recompute node heights after each rotation.</p>",
        excerpt: "LL and RR are single rotations.",
        scope: "material",
        status: "draft",
        pinned: false,
        courseId: "c-csc201",
        courseCode: "CSC 201",
        materialId: "m-002",
        tags: ["avl", "rotation"],
        attachments: [
            {
                materialId: "m-002",
                title: "Week 4 Assignment: AVL Trees",
                courseCode: "CSC 201",
                type: "pdf",
                url: "#",
            },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        lastOpenedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: "note-003",
        userId: "u-student-01",
        role: "student",
        title: "Linear Transformations Revision Card",
        content:
            "<p>A transformation is linear when it preserves vector addition and scalar multiplication.</p>",
        excerpt: "A transformation is linear when it preserves vector addition.",
        scope: "course",
        status: "saved",
        pinned: false,
        courseId: "c-mth201",
        courseCode: "MTH 201",
        tags: ["linear-algebra", "exam-prep"],
        attachments: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        lastOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
];

// --- Helper Functions ---
export const getMaterialsByCourse = (courseId: string) => {
    return MOCK_MATERIALS.filter((m) => m.courseId === courseId);
};

export const getMaterialsForUser = (_userId: string, _role: string) => {
    // Simple logic: everyone sees everything for now, or filter by enrolled courses
    return MOCK_MATERIALS;
};
