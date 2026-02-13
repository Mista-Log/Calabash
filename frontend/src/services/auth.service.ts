import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from './config';
import { UserProfile } from './api';

export interface LoginResponse {
    email: string;
    access?: string;
    refresh?: string;
    // Fallback for different backend structures
    token?: string;
    user?: UserProfile;
}

export interface SignupResponse {
    email: string;
    full_name: string;
    role: 'student' | 'lecturer' | 'admin';
}

export const authService = {
    async login(credentials: Record<string, string>): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return response.data;
    },

    async signup(details: Record<string, string>): Promise<SignupResponse> {
        const response = await apiClient.post<SignupResponse>(
            API_ENDPOINTS.AUTH.SIGNUP,
            details
        );
        return response.data;
    },
};
