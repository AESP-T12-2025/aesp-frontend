import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserStats {
    full_name: string;
    email: string;
    level: string;
    xp: number;
    practice_hours: number;
    lessons_completed: number;
    streak?: number;
    role?: string;
}

export const userService = {
    getStats: async (): Promise<UserStats> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/me/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    getMyProfile: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    updateMe: async (data: { full_name?: string, avatar_url?: string, daily_learning_goal?: number }) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/me`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
