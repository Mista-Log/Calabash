/**
 * API Service Interfaces for Calabash
 * This defines the contract that the frontend expects from the backend.
 * Implementations here should be replaced with actual fetch/axios calls once endpoints are ready.
 */

export interface Material {
  id: string;
  title: string;
  courseCode: string;
  type: 'pdf' | 'past-question';
  semester: number;
  uploadDate: string;
  url: string;
  uploader: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'lecturer';
  department: string;
  semester?: number;
}

export interface DashboardData {
  user: UserProfile;
  courses: Course[];
  recentMaterials: Material[];
}

export class CalabashApiService {
  /**
   * Mock implementation of fetching dashboard data.
   */
  static async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      user: {
        id: 'u-1',
        name: 'John Doe',
        role: 'student',
        department: 'Computer Science',
        semester: 2,
      },
      courses: [
        { id: 'c-1', code: 'CSC 101', title: 'Introduction to Computing', semester: 2 },
        { id: 'c-2', code: 'CSC 102', title: 'Data Structures', semester: 2 },
        { id: 'c-3', code: 'MTH 101', title: 'Calculus I', semester: 2 },
      ],
      recentMaterials: [
        {
          id: 'm-1',
          title: 'Lecture 1: Intro to Silicon',
          courseCode: 'CSC 101',
          type: 'pdf',
          semester: 2,
          uploadDate: '2025-02-10',
          url: '/mock/material.pdf',
          uploader: 'Dr. Smith',
        },
      ],
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
}
