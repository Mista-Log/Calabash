/**
 * =============================================================================
 * API TYPES & INTERFACES FOR CALABASH
 * =============================================================================
 * 
 * FOR BACKEND ENGINEERS:
 * These TypeScript interfaces define the data structures that the frontend
 * expects from the backend API. Each interface maps to a Django model/serializer.
 * 
 * KEY MAPPINGS TO DJANGO:
 * - UserProfile -> account.models.User (+ Student/Lecturer profiles)
 * - Course -> courses.models.Course
 * - Material -> courses.models.CourseMaterial
 * - Note -> courses.models.Note
 * 
 * NAMING CONVENTION:
 * - TypeScript uses camelCase (e.g., uploadDate)
 * - Django uses snake_case (e.g., upload_date)
 * - The API serializer should convert snake_case → camelCase
 */

// =============================================================================
// MATERIAL (Learning Resource)
 * Django Model: courses.CourseMaterial
 * API Endpoints:
 *   - GET    /api/materials/              - List all materials
 *   - GET    /api/materials/:id/          - Get single material
 *   - POST   /api/materials/              - Upload new material
 *   - PUT    /api/materials/:id/          - Update material
 *   - DELETE /api/materials/:id/          - Delete material
 *   - GET    /api/courses/:id/materials/  - Get materials for course
 * =============================================================================

export interface Material {
  // Unique ID (primary key from database)
  id: string;

  // Display title of the material
  title: string;

  // Course code (e.g., "CSC 201") - for display purposes
  courseCode: string;

  // Course ID - links to Course.id
  courseId?: string;

  // Type of material (maps to file extension or manual selection)
  // Django: Could be extracted from file field or stored separately
  type: 'pdf' | 'past-question' | 'video' | 'zip' | 'image';

  // Academic semester (1, 2, 3, etc.)
  semester: number;

  // When the material was uploaded (ISO 8601 format)
  // Django: upload_at field, serialize with .isoformat()
  uploadDate: string;

  // URL to access/download the material
  // Django: For files, use request.build_absolute_uri(material.file.url)
  // For external URLs (YouTube), use the external_url field
  url: string;

  // Name of the person who uploaded (lecturer's full_name)
  uploader: string;

  // File size in human-readable format (e.g., "2.4 MB")
  size?: string;

  // Number of times downloaded
  downloads?: number;

  // Number of likes/reactions
  likes?: number;

  // Duration for video/audio content (e.g., "15:30" for 15min 30sec)
  duration?: string;

  // YouTube URL if type is video and it's an external video
  youtubeUrl?: string;

  // URL to uploader's avatar
  ownerAvatar?: string;

  // Visibility setting
  // Django: visibility field from CourseMaterial model
  visibility?: "public" | "private";

  // Last edit timestamp (ISO 8601)
  lastEditedAt?: string;
}

// =============================================================================
// COURSE
 * Django Model: courses.Course
 * API Endpoints:
 *   - GET /api/courses/              - List courses (filtered by role/semester)
 *   - GET /api/courses/:id/          - Get course with full details
 *   - POST /api/courses/             - Create new course (lecturers/admin only)
 *   - PUT /api/courses/:id/          - Update course
 *   - DELETE /api/courses/:id/       - Delete course
 * =============================================================================

export interface Course {
  // Unique ID (primary key)
  id: string;

  // Course code (e.g., "CSC 201") - should be unique
  // Django: code field
  code: string;

  // Full course title
  // Django: title field
  title: string;

  // Academic semester (1, 2, 3, etc.)
  // Django: semester field
  semester: number;

  // Course description (optional)
  // Django: description field
  description?: string;

  // Name of the lecturer teaching this course
  // Django: lecturer.user.full_name (via ForeignKey)
  lecturerName?: string;

  // Display color for UI cards (optional, hex or tailwind class)
  color?: string;

  // Number of enrolled students
  // Django: enrollment field
  enrollment?: number;

  // Total number of materials in this course
  // Django: Can be computed with materials.count() or use material_count field
  materialCount?: number;
}

// =============================================================================
// COURSE DETAILS (Extended course with nested data)
 * API Endpoint: GET /api/courses/:id/
 * This is a detailed view that includes nested modules, materials, etc.
 * =============================================================================

export interface CourseDetails extends Course {
  // Extended description (same as Course.description)
  description?: string;

  // Number of enrolled students
  studentCount: number;

  // Total materials count
  materialCount: number;

  // Lecturer information (nested object)
  // Django: Serialize lecturer profile + user data
  lecturer: {
    name: string;      // lecturer.user.full_name
    role: string;      // "Course Lecturer" or from profile
    avatar: string;    // lecturer.user.avatar_url or generated
  };

  // Course statistics
  stats: {
    rating: number;        // Average rating (0-5)
    totalRatings: number;  // Number of ratings
    duration: string;      // Estimated completion time (e.g., "2.5h")
  };

  // Main course introduction video (YouTube embed URL)
  youtubeUrl?: string;

  // Supplementary materials (quick access)
  supplements: Material[];

  // Organized modules/sections with materials
  // Django: This is a frontend organization concept
  // Backend can return all materials and frontend groups them
  // OR backend can have a Module model with order field
  modules: {
    id: string;
    title: string;
    order: number;
    materials: Material[];
  }[];

  // Recent activity feed
  recentActivity: {
    id: string;
    type: 'upload' | 'view' | 'comment';
    description: string;
    date: string;  // Relative (e.g., "2h ago") or ISO date
  }[];
}

// =============================================================================
// USER PROFILE
 * Django Model: account.models.User (+ Student/Lecturer profiles)
 * API Endpoints:
 *   - GET    /api/users/me/          - Get current user
 *   - GET    /api/users/:id/         - Get user by ID
 *   - PUT    /api/users/me/          - Update current user
 *   - POST   /api/auth/login/        - Login
 *   - POST   /api/auth/signup/       - Register
 *   - POST   /api/auth/logout/       - Logout
 * =============================================================================

export interface UserProfile {
  // Unique user ID (primary key)
  id: string;

  // Full name
  // Django: user.full_name
  name: string;

  // Username (optional, for display)
  // Django: student.username or lecturer.username
  username?: string;

  // Email address (used for login)
  // Django: user.email
  email: string;

  // User role
  // Django: user.role field ("student" or "lecturer")
  role: 'student' | 'lecturer';

  // Department/Faculty
  // Django: student.department or lecturer.department
  department: string;

  // Current semester (mainly for students)
  // Django: user.semester
  semester?: number;

  // Flag for first-time users (for onboarding flow)
  isNewUser?: boolean;

  // Short bio
  // Django: user.bio
  bio?: string;

  // Avatar/profile picture URL
  avatarUrl?: string;
}

// =============================================================================
// LECTURER DASHBOARD STATISTICS
 * API Endpoint: GET /api/dashboard/lecturer/
 * These are computed statistics for the lecturer dashboard
 * =============================================================================

export interface LecturerStats {
  // Total number of students across all courses
  totalStudents: number;

  // Total materials uploaded by this lecturer
  // Django: lecturer.uploaded_materials.count()
  totalUploads: number;

  // Total views across all materials
  totalViews: number;

  // Number of active courses being taught
  activeCourses: number;
}

// Trending material statistics
export interface TrendingMaterialStat {
  title: string;
  views: number;
  downloads: number;
  trend: number;  // Percentage increase
}

// Monthly upload data for charts
export interface MonthlyUploadsPoint {
  name: string;   // Month name (e.g., "Jan")
  uploads: number;
  value: number;  // Same as uploads, for chart libraries
}

// Course engagement data for charts
export interface CourseEngagementPoint {
  name: string;   // Course code
  engagement: number;
  value: number;  // Same as engagement, for chart libraries
}

// =============================================================================
// STUDENT DASHBOARD STATISTICS
 * API Endpoint: GET /api/dashboard/student/
 * These are computed statistics for the student dashboard
 * =============================================================================

export interface StudentStats {
  // Grade Point Average
  gpa: string;  // e.g., "3.92"

  // Attendance percentage
  attendance: string;  // e.g., "94%"

  // Upcoming deadlines
  upcomingDeadlines: {
    title: string;
    due: string;  // Relative (e.g., "Tomorrow") or ISO date
    color: 'orange' | 'sage' | 'green';  // UI priority indicator
  }[];
}

// =============================================================================
// GAMIFICATION (Student Progress Tracking)
 * API Endpoint: GET /api/gamification/:userId/
 * This is for student motivation/engagement features
 * =============================================================================

// Individual achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;  // Icon name/class
  category: 'course' | 'material' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;  // ISO date when unlocked
  progress?: number;    // Current progress (0-100)
  target?: number;      // Target to unlock
}

// Learning milestone
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
  claimed: boolean;  // Whether reward has been claimed
}

// Full gamification profile
export interface StudentGamificationProfile {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  streak: {
    current: number;
    best: number;
    lastActivity: string;  // ISO date
  };
  achievements: Achievement[];
  milestones: Milestone[];
  title?: string;      // Current title (e.g., "Academic Explorer")
  badges?: string[];   // Badge IDs earned
}

// =============================================================================
// DASHBOARD DATA (Main Dashboard Response)
 * API Endpoints:
 *   - GET /api/dashboard/student/   - Student dashboard
 *   - GET /api/dashboard/lecturer/  - Lecturer dashboard
 * =============================================================================

export interface DashboardData {
  // Current user
  user: UserProfile;

  // User's courses (filtered by semester for students, all taught for lecturers)
  courses: Course[];

  // Recent materials (across all courses)
  recentMaterials: Material[];

  // Role-specific stats (only one will be present based on user.role)
  stats?: LecturerStats;
  studentStats?: StudentStats;
  lecturerStats?: LecturerStats & {
    trendingMaterial: TrendingMaterialStat | null;
    monthlyUploads?: MonthlyUploadsPoint[];
    courseEngagement?: CourseEngagementPoint[];
  };

  // Course progress tracking (student only)
  // Key: courseId, Value: progress percentage (0-100)
  courseProgress?: Record<string, number>;

  // Gamification data (student only)
  gamification?: StudentGamificationProfile;
}
