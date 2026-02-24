<<<<<<< HEAD
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://calabash-n9hz.onrender.com';
=======
export const API_BASE_URL = 'https://calabash-n9hz.onrender.com';
>>>>>>> origin/main
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login/',
        SIGNUP: '/api/auth/signup/',
<<<<<<< HEAD
        ME: '/api/auth/me/',
        REFRESH: '/api/auth/token/refresh/',
        PASSWORD_RESET: '/api/auth/password/reset/',
        PASSWORD_RESET_CONFIRM: '/api/auth/password/reset/confirm/',
    },
    DASHBOARD: process.env.NEXT_PUBLIC_DASHBOARD_ENDPOINT || '',
=======
    },
>>>>>>> origin/main
};
