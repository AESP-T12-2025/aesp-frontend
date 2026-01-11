import api from '@/lib/api';

export const authService = {
    login: async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', email); // OAuth2 expects 'username'
        formData.append('password', password);
        const res = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return res.data;
    },
    register: async (data: { email: string, password: string, full_name?: string, role?: string }) => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },
    getMe: async () => {
        const res = await api.get('/users/me');
        return res.data;
    }
};
