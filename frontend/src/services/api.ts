import { useUserStore } from '@/store/useUserStore';

/**
 * API Service Interfaces for Calabash
 * This defines the contract that the frontend expects from the backend.
 * Implementations here should be replaced with actual fetch/axios calls once endpoints are ready.
 */

export interface Material {
    id: string;
    title: string;
    courseCode: string;
    courseId?: string; // Added for linkage
    type: 'pdf' | 'past-question' | 'video' | 'zip' | 'image';
    semester: number;
    uploadDate: string;
    url: string;
    uploader: string;
    size?: string;
    downloads?: number;
    likes?: number;
    duration?: string;
    ownerAvatar?: string;
}

export interface Course {
    id: string;
    code: string;
    title: string;
    semester: number;
    description?: string; // Added
    lecturerName?: string; // Added
    color?: string; // Added
}

export interface CourseDetails extends Course {
    description?: string;
    studentCount: number;
    materialCount: number;
    lecturer: {
        name: string;
        role: string;
        avatar: string;
    };
    stats: {
        rating: number;
        totalRatings: number;
        duration: string;
    };
    youtubeUrl?: string;
    supplements: Material[];
    sections: {
        id: string;
        name: string;
        materials: Material[];
    }[];
    recentActivity: {
        id: string;
        type: 'upload' | 'view' | 'comment';
        description: string;
        date: string;
    }[];
}

export interface UserProfile {
    id: string;
    name: string;
    username?: string; // Added for auth
    email: string;
    role: 'student' | 'lecturer';
    department: string;
    semester?: number;
    isNewUser?: boolean;
}

export interface LecturerStats {
    totalStudents: number;
    totalUploads: number;
    totalViews: number;
    activeCourses: number;
}

export interface StudentStats {
    gpa: string;
    attendance: string;
    upcomingDeadlines: {
        title: string;
        due: string;
        color: 'orange' | 'sage' | 'green';
    }[];
}

export interface DashboardData {
    user: UserProfile;
    courses: Course[];
    recentMaterials: Material[];
    stats?: LecturerStats;
    studentStats?: StudentStats;
    lecturerStats?: LecturerStats & {
        trendingMaterial: {
            title: string;
            views: number;
            downloads: number;
            trend: number;
        } | null;
    };
}

import { MOCK_USERS, MOCK_COURSES, MOCK_MATERIALS } from '@/data/mock-data';

export class CalabashApiService {
    /**
     * Mock implementation of fetching dashboard data.
     */
    static async getDashboardData(): Promise<DashboardData> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Use role from UserStore (real auth state)
        // In a real app, the token would determine the user.
        // For this mock, we'll try to match the logged-in user's email or ID if available,
        // otherwise default to a role-based selection from MOCK_USERS.
        const currentUser = useUserStore.getState().user;
        const role = currentUser?.role || 'student';

        // Find the user in our mock database
        let userProfile = MOCK_USERS.find(u => u.email === currentUser?.email) ||
            MOCK_USERS.find(u => u.role === role);

        if (!userProfile) {
            // Fallback if no user matches (shouldn't happen with correct mocks)
            userProfile = MOCK_USERS[0];
        }

        const relevantCourses = MOCK_COURSES.filter(c => c.semester === userProfile?.semester);
        // For materials, maybe show recent ones from enrolled courses
        const recentMaterials = MOCK_MATERIALS.filter(m => relevantCourses.some(c => c.id === m.courseId)).slice(0, 5);


        if (role === 'lecturer') {
            return {
                user: userProfile!,
                stats: {
                    totalStudents: 1240,
                    totalUploads: MOCK_MATERIALS.filter(m => m.uploader === userProfile?.name).length,
                    totalViews: 8200,
                    activeCourses: relevantCourses.length,
                },
                courses: relevantCourses,
                recentMaterials: recentMaterials, // Or materials uploaded by this lecturer
                lecturerStats: {
                    totalStudents: 1240,
                    totalUploads: MOCK_MATERIALS.filter(m => m.uploader === userProfile?.name).length,
                    totalViews: 8200,
                    activeCourses: relevantCourses.length,
                    trendingMaterial: {
                        title: recentMaterials[0]?.title || "N/A",
                        views: 125,
                        downloads: 45,
                        trend: 12,
                    }
                }
            };
        }

        // Student data
        return {
            user: userProfile!,
            studentStats: {
                gpa: "3.92",
                attendance: "94%",
                upcomingDeadlines: [
                    { title: "Database Systems Project", due: "Tomorrow", color: "orange" },
                    { title: "Algorithm Analysis Quiz", due: "2 days", color: "sage" },
                    { title: "Technical Writing Report", due: "Next Week", color: "green" },
                ]
            },
            courses: relevantCourses,
            recentMaterials: recentMaterials,
        };
    }

    static async uploadMaterial(file: File, metadata: Partial<Material>): Promise<Material> {
        console.warn('Uploading...', file.name, metadata);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
            id: Math.random().toString(36).substr(2, 9),
            title: metadata.title || file.name,
            courseCode: metadata.courseCode || 'UNKNOWN',
            type: 'pdf',
            semester: metadata.semester || 1,
            uploadDate: new Date().toISOString(),
            url: '#',
            uploader: 'Current User',
        };
    }

    static async getCourseDetails(courseId: string): Promise<CourseDetails> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
            id: courseId,
            code: 'CSC 101',
            title: 'Introduction to Computing',
            semester: 2,
            description: 'Fundamental concepts of computer science, algorithms, and logic. This course covers everything from basic binary operations to complex data structures and modern architectural patterns.',
            studentCount: 1877888,
            materialCount: 15,
            lecturer: {
                name: 'X_AE_A-13',
                role: 'Product Designer, slothUI',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
            },
            stats: {
                rating: 4.5,
                totalRatings: 1200,
                duration: '1.2 h'
            },
            youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Mock video URL
            supplements: [
                { id: 'sup-1', title: 'Study Notes 2028', courseCode: 'CSC 101', type: 'pdf', semester: 2, uploadDate: '2025-02-10', url: '#', uploader: 'X_AE_A-13', size: '25MB' },
                { id: 'sup-2', title: 'Study Hackz', courseCode: 'CSC 101', type: 'zip', semester: 2, uploadDate: '2025-02-08', url: '#', uploader: 'X_AE_A-13', size: '25MB' },
                { id: 'sup-3', title: 'Full Lecture', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-05', url: '#', uploader: 'X_AE_A-13', size: '25MB', duration: '12min' },
            ],
            sections: [
                {
                    id: 's-1',
                    name: '1. Introduction to Callback Functions',
                    materials: [
                        { id: 'm-1', title: '1. Introduction to Callback Functions', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-10', url: '#', uploader: 'Prof. Chen', duration: '12min' },
                        { id: 'm-2', title: '2. Database Concurrency Model', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-08', url: '#', uploader: 'Prof. Chen', duration: '60min' },
                        { id: 'm-3', title: '4. setTimeout() functions And MOre', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-05', url: '#', uploader: 'Prof. Chen', duration: '78min' },
                        { id: 'm-4', title: '5. Managing states with Redux', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-04', url: '#', uploader: 'Prof. Chen', duration: '112min' },
                        { id: 'm-5', title: '6. Build your own API with nodejs', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-03', url: '#', uploader: 'Prof. Chen', duration: '68min' },
                    ]
                }
            ],
            recentActivity: [
                { id: 'a-1', type: 'upload', description: 'Uploaded 2 new slides', date: '2h ago' },
                { id: 'a-2', type: 'view', description: '45 students viewed Lecture 1', date: '5h ago' },
            ]
        };
    }

    static async bulkActionMaterials(materialIds: string[], action: 'delete' | 'move' | 'hide'): Promise<void> {
        console.warn(`Bulk Action: ${action} on`, materialIds);
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    static async toggleMaterialVisibility(materialId: string, visible: boolean): Promise<void> {
        console.warn(`Toggle Visibility: ${materialId} to ${visible}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}