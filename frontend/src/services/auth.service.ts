import { MOCK_USERS, MockUser } from '@/data/mock-data';
import { UserProfile } from './api';

export interface LoginResponse {
    email: string;
    access?: string;
    refresh?: string;
    token?: string;
    user?: UserProfile;
}

export interface SignupResponse {
    email: string;
    full_name: string;
    role: 'student' | 'lecturer' | 'admin';
}

export interface LoginCredentials {
    email: string;
    password: string;
    username?: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        console.log("Attempting mock login:", credentials);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

        const user = MOCK_USERS.find(u =>
            (u.email.toLowerCase() === credentials.email.toLowerCase()) ||
            (u.username && u.username.toLowerCase() === credentials.username?.toLowerCase()) ||
            (credentials.email && u.username && u.username.toLowerCase() === credentials.email.toLowerCase()) // Allow logging in with username in email field
        );

        if (user) {
            return {
                email: user.email,
                token: "mock-jwt-token-" + user.id,
                user: user,
            };
        }

        throw new Error("Invalid credentials");
    },

    async signup(details: Record<string, string>): Promise<SignupResponse> {
        console.log("Attempting mock signup:", details);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Basic mock validation
        if (MOCK_USERS.find(u => u.email === details.email)) {
            throw new Error("User already exists");
        }

        const newUser: MockUser = {
            id: `u-${Date.now()}`,
            name: details.full_name || "New User",
            email: details.email,
            role: (details.role as 'student' | 'lecturer') || 'student',
            department: "General Studies",
            semester: 1,
            isNewUser: true,
            username: details.username || details.email.split('@')[0],
        };

        MOCK_USERS.push(newUser);

        return {
            email: newUser.email,
            full_name: newUser.name,
            role: newUser.role,
        };
    },
};
