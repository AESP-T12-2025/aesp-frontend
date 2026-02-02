import axios from "axios";

// API URL priority:
// 1. NEXT_PUBLIC_API_URL env variable (if set)
// 2. Production backend URL (default for Vercel)
// Note: For local dev, create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aesp-backend.onrender.com";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Debug logging only in development
if (process.env.NODE_ENV === 'development') {
    console.log("🔗 API URL:", API_URL);
}

// Add interceptor to include token if available (Week 1 placeholder)
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;

// API Helper Types
export interface User {
    user_id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
}

export interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    image_url?: string;
}

export interface Scenario {
    scenario_id: number;
    title: string;
    difficulty_level: string;
    topic_id: number;
}