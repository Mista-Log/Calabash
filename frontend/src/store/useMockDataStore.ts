import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    UserProfile,
    Course,
    Material,
    DashboardData,
    StudentStats,
    LecturerStats,
    StudentGamificationProfile,
    Achievement,
    Milestone,
    TrendingMaterialStat,
    MonthlyUploadsPoint,
    CourseEngagementPoint,
} from '@/services/api';
import { MOCK_USERS, MOCK_COURSES, MOCK_MATERIALS } from '@/data/mock-data';

interface MockDataState {
    users: UserProfile[];
    courses: Course[];
    materials: Material[];
    studentStats: Record<string, StudentStats>;
    lecturerStats: Record<string, LecturerStats & {
        trendingMaterial: TrendingMaterialStat | null;
        monthlyUploads: MonthlyUploadsPoint[];
        courseEngagement: CourseEngagementPoint[];
    }>;
    courseProgress: Record<string, Record<string, number>>; // user_id -> {course_id -> progress}
    gamificationProfiles: Record<string, StudentGamificationProfile>; // user_id -> gamification profile

    // Actions
    setUsers: (users: UserProfile[]) => void;
    setCourses: (courses: Course[]) => void;
    setMaterials: (materials: Material[]) => void;
    addMaterial: (material: Material) => void;
    updateCourseProgress: (userId: string, courseId: string, progress: number) => void;
    updateGamification: (userId: string, updates: Partial<StudentGamificationProfile>) => void;
    claimMilestone: (userId: string, milestoneId: string) => void;
    addXP: (userId: string, amount: number, _reason?: string) => void;

    // Selectors/Getters
    getDashboardData: (userId: string, role: 'student' | 'lecturer') => DashboardData;
}

export const useMockDataStore = create<MockDataState>()(
    persist(
        (set, get) => ({
            users: MOCK_USERS,
            courses: MOCK_COURSES,
            materials: MOCK_MATERIALS,
            studentStats: {
                "u-student-01": {
                    gpa: "3.92",
                    attendance: "94%",
                    upcomingDeadlines: [
                        { title: "Database Systems Project", due: "Tomorrow", color: "orange" },
                        { title: "Algorithm Analysis Quiz", due: "2 days", color: "sage" },
                        { title: "Technical Writing Report", due: "Next Week", color: "green" },
                    ]
                }
            },
            lecturerStats: {
                "u-lecturer-01": {
                    totalStudents: 1240,
                    totalUploads: MOCK_MATERIALS.filter(m => m.uploader === "Dr. Chioma Okonkwo").length,
                    totalViews: 8200,
                    activeCourses: 3,
                    trendingMaterial: {
                        title: "Introduction to Binary Trees",
                        views: 125,
                        downloads: 45,
                        trend: 12,
                    },
                    monthlyUploads: [
                        { name: "Jan", uploads: 40, value: 40 },
                        { name: "Feb", uploads: 30, value: 30 },
                        { name: "Mar", uploads: 20, value: 20 },
                        { name: "Apr", uploads: 27, value: 27 },
                        { name: "May", uploads: 18, value: 18 },
                        { name: "Jun", uploads: 23, value: 23 },
                        { name: "Jul", uploads: 34, value: 34 },
                    ],
                    courseEngagement: [
                        { name: "MATH201", engagement: 400, value: 400 },
                        { name: "CS305", engagement: 300, value: 300 },
                        { name: "PHYS101", engagement: 200, value: 200 },
                        { name: "ART100", engagement: 278, value: 278 },
                        { name: "BIO200", engagement: 189, value: 189 },
                    ]
                }
            },
            courseProgress: {
                "u-student-01": {
                    "c-csc201": 45,
                    "c-csc202": 78,
                    "c-mth201": 23,
                }
            },

            gamificationProfiles: {
                "u-student-01": {
                    level: 5,
                    currentXP: 350,
                    xpToNextLevel: 500,
                    totalXP: 2150,
                    streak: {
                        current: 7,
                        best: 14,
                        lastActivity: new Date().toISOString(),
                    },
                    title: "Academic Explorer",
                    badges: ["first-course", "week-streak"],
                    achievements: [
                        {
                            id: "ach-1",
                            title: "First Steps",
                            description: "Complete your first course module",
                            icon: "graduation",
                            category: "course",
                            rarity: "common",
                            unlocked: true,
                            unlockedAt: "2025-01-15T10:30:00Z",
                        },
                        {
                            id: "ach-2",
                            title: "Week Warrior",
                            description: "Maintain a 7-day learning streak",
                            icon: "fire",
                            category: "streak",
                            rarity: "rare",
                            unlocked: true,
                            unlockedAt: "2025-02-01T08:00:00Z",
                        },
                        {
                            id: "ach-3",
                            title: "Knowledge Hunter",
                            description: "View 50 learning materials",
                            icon: "book",
                            category: "material",
                            rarity: "epic",
                            unlocked: false,
                            progress: 37,
                            target: 50,
                        },
                        {
                            id: "ach-4",
                            title: "Master Scholar",
                            description: "Complete all courses in a semester",
                            icon: "trophy",
                            category: "milestone",
                            rarity: "legendary",
                            unlocked: false,
                            progress: 1,
                            target: 4,
                        },
                        {
                            id: "ach-5",
                            title: "Speed Learner",
                            description: "Complete 5 modules in one day",
                            icon: "lightning",
                            category: "special",
                            rarity: "epic",
                            unlocked: false,
                            progress: 2,
                            target: 5,
                        },
                    ] as Achievement[],
                    milestones: [
                        {
                            id: "ms-1",
                            title: "Course Completion I",
                            description: "Complete 2 courses",
                            type: "course_completion",
                            progress: 1,
                            target: 2,
                            reward: {
                                type: "xp",
                                value: 200,
                            },
                            completed: false,
                            claimed: false,
                        },
                        {
                            id: "ms-2",
                            title: "Material Master",
                            description: "View 25 learning materials",
                            type: "material_consumption",
                            progress: 18,
                            target: 25,
                            reward: {
                                type: "badge",
                                value: "Material Master",
                            },
                            completed: false,
                            claimed: false,
                        },
                        {
                            id: "ms-3",
                            title: "XP Milestone",
                            description: "Earn 3000 total XP",
                            type: "xp_threshold",
                            progress: 2150,
                            target: 3000,
                            reward: {
                                type: "title",
                                value: "Wisdom Keeper",
                            },
                            completed: false,
                            claimed: false,
                        },
                        {
                            id: "ms-4",
                            title: "Quick Starter",
                            description: "Complete 1 course",
                            type: "course_completion",
                            progress: 1,
                            target: 1,
                            reward: {
                                type: "xp",
                                value: 100,
                            },
                            completed: true,
                            claimed: true,
                        },
                    ] as Milestone[],
                }
            },

            setUsers: (users) => set({ users }),
            setCourses: (courses) => set({ courses }),
            setMaterials: (materials) => set({ materials }),
            addMaterial: (material) => set((state) => ({
                materials: [material, ...state.materials],
                // Also update lecturer upload count if applicable
                lecturerStats: {
                    ...state.lecturerStats,
                    "u-lecturer-01": {
                        ...state.lecturerStats["u-lecturer-01"],
                        totalUploads: state.lecturerStats["u-lecturer-01"].totalUploads + 1
                    }
                }
            })),
            updateCourseProgress: (userId, courseId, progress) => set((state) => ({
                courseProgress: {
                    ...state.courseProgress,
                    [userId]: {
                        ...state.courseProgress[userId],
                        [courseId]: progress
                    }
                }
            })),

            updateGamification: (userId, updates) => set((state) => ({
                gamificationProfiles: {
                    ...state.gamificationProfiles,
                    [userId]: {
                        ...state.gamificationProfiles[userId],
                        ...updates,
                    }
                }
            })),

            claimMilestone: (userId, milestoneId) => set((state) => {
                const profile = state.gamificationProfiles[userId];
                if (!profile) return state;

                const updatedMilestones = profile.milestones.map((ms) =>
                    ms.id === milestoneId ? { ...ms, claimed: true } : ms
                );

                const claimedMilestone = profile.milestones.find((ms) => ms.id === milestoneId);
                let updatedXP = profile.currentXP;
                let updatedTotalXP = profile.totalXP;

                if (claimedMilestone?.reward.type === "xp") {
                    updatedXP += claimedMilestone.reward.value as number;
                    updatedTotalXP += claimedMilestone.reward.value as number;
                }

                return {
                    gamificationProfiles: {
                        ...state.gamificationProfiles,
                        [userId]: {
                            ...profile,
                            milestones: updatedMilestones,
                            currentXP: updatedXP,
                            totalXP: updatedTotalXP,
                        }
                    }
                };
            }),

            addXP: (userId, amount, _reason) => set((state) => {
                const profile = state.gamificationProfiles[userId];
                if (!profile) return state;

                const newCurrentXP = profile.currentXP + amount;
                const newTotalXP = profile.totalXP + amount;
                let newLevel = profile.level;
                let newXpToNextLevel = profile.xpToNextLevel;
                let remainingXP = newCurrentXP;

                // Level up logic
                while (remainingXP >= newXpToNextLevel) {
                    remainingXP -= newXpToNextLevel;
                    newLevel++;
                    newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2); // 20% increase per level
                }

                return {
                    gamificationProfiles: {
                        ...state.gamificationProfiles,
                        [userId]: {
                            ...profile,
                            level: newLevel,
                            currentXP: remainingXP,
                            xpToNextLevel: newXpToNextLevel,
                            totalXP: newTotalXP,
                        }
                    }
                };
            }),

            getDashboardData: (userId, role) => {
                const state = get();
                const users = Array.isArray(state.users) && state.users.length > 0 ? state.users : MOCK_USERS;
                const courses = Array.isArray(state.courses) && state.courses.length > 0 ? state.courses : MOCK_COURSES;
                const materials = Array.isArray(state.materials) && state.materials.length > 0 ? state.materials : MOCK_MATERIALS;
                const requestedRole = role === "lecturer" ? "lecturer" : "student";

                const fallbackUserByRole =
                    users.find((candidate) => candidate.role === requestedRole) ??
                    MOCK_USERS.find((candidate) => candidate.role === requestedRole);
                const fallbackAnyUser = users[0] ?? MOCK_USERS[0];
                const user = users.find((candidate) => candidate.id === userId) ?? fallbackUserByRole ?? fallbackAnyUser;

                if (!user) {
                    throw new Error("Mock dashboard data is missing users.");
                }

                const semester = user.semester ?? 1;
                const semesterCourses = courses.filter((course) => course.semester === semester);
                const relevantCourses = semesterCourses.length > 0 ? semesterCourses : courses;
                const recentMaterials = materials
                    .filter((material) =>
                        relevantCourses.some(
                            (course) =>
                                course.id === material.courseId ||
                                course.code === material.courseCode ||
                                material.semester === semester
                        )
                    )
                    .slice(0, 5);

                const lecturerStatsDefault =
                    state.lecturerStats[user.id] ??
                    state.lecturerStats["u-lecturer-01"] ??
                    Object.values(state.lecturerStats)[0] ?? {
                        totalStudents: 0,
                        totalUploads: 0,
                        totalViews: 0,
                        activeCourses: 0,
                        trendingMaterial: null,
                        monthlyUploads: [],
                        courseEngagement: [],
                    };

                const studentStatsDefault =
                    state.studentStats[user.id] ??
                    state.studentStats["u-student-01"] ??
                    Object.values(state.studentStats)[0] ?? {
                        gpa: "N/A",
                        attendance: "N/A",
                        upcomingDeadlines: [],
                    };

                const gamificationDefault =
                    state.gamificationProfiles[user.id] ??
                    state.gamificationProfiles["u-student-01"] ??
                    Object.values(state.gamificationProfiles)[0];

                if (requestedRole === "lecturer") {
                    return {
                        user: user.role === "lecturer" ? user : (fallbackUserByRole ?? user),
                        courses: relevantCourses,
                        recentMaterials,
                        lecturerStats: lecturerStatsDefault,
                        stats: lecturerStatsDefault,
                    };
                }

                return {
                    user: user.role === "student" ? user : (fallbackUserByRole ?? user),
                    courses: relevantCourses,
                    recentMaterials,
                    studentStats: studentStatsDefault,
                    gamification: gamificationDefault,
                };
            },
        }),
        {
            name: 'calabash-mock-data',
        }
    )
);
