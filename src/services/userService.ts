import api from "@/lib/api";

export interface UserStats {
    full_name: string;
    email: string;
    level: string;
    xp: number;
    practice_hours: number;
    lessons_completed: number;
    streak?: number;
    role?: string;
    daily_learning_goal?: number;
    learning_target?: string;
    preferred_practice_time?: string;
    target_level?: string;
}

export const userService = {
    getStats: async (): Promise<UserStats> => {
        const response = await api.get("/users/me/stats");
        return response.data;
    },
    getMyProfile: async () => {
        const response = await api.get("/users/me");
        return response.data;
    },
    updateMe: async (data: { 
        full_name?: string, 
        avatar_url?: string, 
        daily_learning_goal?: number,
        learning_target?: string,
        preferred_practice_time?: string,
        target_level?: string 
    }) => {
        const response = await api.put("/users/me", data);
        return response.data;
    },
};
