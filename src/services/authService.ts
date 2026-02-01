import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    role?: 'LEARNER' | 'MENTOR' | 'ADMIN';
    is_active?: boolean;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface UserResponse {
    user_id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export interface OAuthCallback {
    code?: string;
    state?: string;
    error?: string;
}

export interface GoogleTokenRequest {
    access_token?: string;
    id_token?: string;
}

export interface GoogleLinkRequest {
    google_token: string;
    email?: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    new_password: string;
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
    // ========================================================================
    // BASIC AUTHENTICATION
    // ========================================================================

    /**
     * User login with email and password
     * Returns JWT access token
     */
    login: async (email: string, password: string): Promise<TokenResponse> => {
        const res = await api.post('/auth/login', {
            email,
            password
        });
        return res.data;
    },

    /**
     * Register new user account
     * Role can be LEARNER or MENTOR (Admin must be created via backend script)
     */
    register: async (data: RegisterRequest): Promise<UserResponse> => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },

    /**
     * Refresh access token
     * Use when token is about to expire
     */
    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        const res = await api.post('/auth/refresh', {
            refresh_token: refreshToken
        });
        return res.data;
    },

    // ========================================================================
    // GOOGLE OAUTH (Issue #46)
    // ========================================================================

    /**
     * Get Google OAuth authorization URL
     * Redirect user to this URL to initiate OAuth flow
     */
    getGoogleAuthUrl: async (): Promise<{ auth_url: string; state: string }> => {
        const res = await api.get('/auth/google/login');
        return res.data;
    },

    /**
     * Handle Google OAuth callback
     * Called after user authorizes on Google
     */
    handleGoogleCallback: async (callback: OAuthCallback): Promise<TokenResponse> => {
        const params = new URLSearchParams();
        if (callback.code) params.append('code', callback.code);
        if (callback.state) params.append('state', callback.state);
        if (callback.error) params.append('error', callback.error);

        const res = await api.get(`/auth/google/callback?${params.toString()}`);
        return res.data;
    },

    /**
     * Login with Google token (for client-side OAuth)
     * Used when you have Google access_token or id_token from client SDK
     */
    googleTokenLogin: async (tokenRequest: GoogleTokenRequest): Promise<TokenResponse> => {
        const res = await api.post('/auth/google/token', tokenRequest);
        return res.data;
    },

    /**
     * Link Google account to existing account
     * Requires user to be logged in
     */
    linkGoogleAccount: async (linkRequest: GoogleLinkRequest): Promise<{ message: string }> => {
        const res = await api.post('/auth/google/link', linkRequest);
        return res.data;
    },

    /**
     * Unlink Google account from current account
     * Requires user to be logged in
     */
    unlinkGoogleAccount: async (): Promise<{ message: string }> => {
        const res = await api.delete('/auth/google/unlink');
        return res.data;
    },

    // ========================================================================
    // OTHER OAUTH PROVIDERS
    // ========================================================================

    /**
     * Get Facebook OAuth authorization URL
     */
    getFacebookAuthUrl: async (): Promise<{ auth_url: string }> => {
        const res = await api.get('/auth/facebook/login');
        return res.data;
    },

    /**
     * Get GitHub OAuth authorization URL
     */
    getGitHubAuthUrl: async (): Promise<{ auth_url: string }> => {
        const res = await api.get('/auth/github/login');
        return res.data;
    },

    // ========================================================================
    // PASSWORD RESET
    // ========================================================================

    /**
     * Request password reset
     * Sends reset email to user
     */
    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const res = await api.post('/auth/forgot-password', { email });
        return res.data;
    },

    /**
     * Reset password with token
     * Token received via email
     */
    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
        const res = await api.post('/auth/reset-password', {
            token,
            new_password: newPassword
        });
        return res.data;
    },

    // ========================================================================
    // USER INFO
    // ========================================================================

    /**
     * Get current user profile
     * Requires authentication token
     */
    getMe: async (): Promise<UserResponse> => {
        const res = await api.get('/users/me');
        return res.data;
    },

    // ========================================================================
    // TOKEN MANAGEMENT
    // ========================================================================

    /**
     * Store access token in localStorage
     */
    setToken: (token: string) => {
        localStorage.setItem('token', token);
    },

    /**
     * Get access token from localStorage
     */
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    /**
     * Remove access token from localStorage
     * Used for logout
     */
    removeToken: () => {
        localStorage.removeItem('token');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};
