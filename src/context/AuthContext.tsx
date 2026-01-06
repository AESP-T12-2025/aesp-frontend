"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

// Define User Type
export interface User {
    user_id: number;
    email: string;
    full_name: string;
    role: "ADMIN" | "LEARNER";
    avatar_url?: string;
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user profile from backend using token
    const fetchUserProfile = async () => {
        try {
            const response = await api.get("/users/me");
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // If 401, token might be invalid
            logout();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await fetchUserProfile();
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem("token", token);
        await fetchUserProfile();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/login");
    };

    const refreshProfile = async () => {
        await fetchUserProfile();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
