import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { API_BASE_URL } from './config';

/**
 * API Service Interfaces for Calabash
 */

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling (Toasts can be added here if we had access to useToast, 
// but since this is a service, we'll handle toasts in the components or use a global event bus)
// For now, let's keep it simple and handle in components, or we can use window.dispatchEvent

export default api;

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
    youtubeUrl?: string;
    ownerAvatar?: string;
    visibility?: "public" | "private";
    lastEditedAt?: string;
}

export interface Course {
    id: string;
    code: string;
    title: string;
    semester: number;
    description?: string; // Added
    lecturerName?: string; // Added
    color?: string; // Added
    enrollment?: number;
    materialCount?: number;
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
    youtubeUrl?: string; // Main course intro video
    supplements: Material[];
    modules: {
        id: string;
        title: string;
        order: number;
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
    bio?: string;
    avatarUrl?: string;
}

export interface LecturerStats {
    totalStudents: number;
    totalUploads: number;
    totalViews: number;
    activeCourses: number;
}

export interface TrendingMaterialStat {
    title: string;
    views: number;
    downloads: number;
    trend: number;
}

export interface MonthlyUploadsPoint {
    name: string;
    uploads: number;
    value: number;
}

export interface CourseEngagementPoint {
    name: string;
    engagement: number;
    value: number;
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

// Gamification Types
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'course' | 'material' | 'streak' | 'milestone' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    target?: number;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    type: 'course_completion' | 'material_consumption' | 'xp_threshold';
    progress: number;
    target: number;
    reward: {
        type: 'xp' | 'badge' | 'title';
        value: number | string;
    };
    completed: boolean;
    claimed: boolean;
}

export interface StudentGamificationProfile {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    streak: {
        current: number;
        best: number;
        lastActivity: string;
    };
    achievements: Achievement[];
    milestones: Milestone[];
    title?: string;
    badges?: string[];
}

export interface DashboardData {
    user: UserProfile;
    courses: Course[];
    recentMaterials: Material[];
    stats?: LecturerStats;
    studentStats?: StudentStats;
    lecturerStats?: LecturerStats & {
        trendingMaterial: TrendingMaterialStat | null;
        monthlyUploads?: MonthlyUploadsPoint[];
        courseEngagement?: CourseEngagementPoint[];
    };
    courseProgress?: Record<string, number>;
    gamification?: StudentGamificationProfile;
}

export class CalabashApiService {
    /**
     * Fetch dashboard data from the backend only.
     * Fallback policy is handled by the dashboard repository layer.
     */
    static async getDashboardData(): Promise<DashboardData> {
        const response = await api.get('/dashboard');
        return response.data;
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
                { id: 'sup-3', title: 'Full Lecture', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-05', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'X_AE_A-13', size: 'Streaming', duration: '12min' },
            ],
            modules: [
                {
                    id: 's-1',
                    title: '1. Introduction to Callback Functions',
                    order: 1,
                    materials: [
                        { id: 'm-1', title: '1. Introduction to Callback Functions', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-10', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'Prof. Chen', duration: '12min' },
                        { id: 'm-2', title: '2. Database Concurrency Model', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-08', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'Prof. Chen', duration: '60min' },
                        { id: 'm-3', title: '4. setTimeout() functions And MOre', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-05', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'Prof. Chen', duration: '78min' },
                        { id: 'm-4', title: '5. Managing states with Redux', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-04', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'Prof. Chen', duration: '112min' },
                        { id: 'm-5', title: '6. Build your own API with nodejs', courseCode: 'CSC 101', type: 'video', semester: 2, uploadDate: '2025-02-03', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', uploader: 'Prof. Chen', duration: '68min' },
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
