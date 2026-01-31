import api from '@/lib/api';

export const socialService = {
    getFeed: async () => {
        const res = await api.get('/social/posts');
        return res.data;
    },
    createPost: async (content: string) => {
        const res = await api.post('/social/posts', { content });
        return res.data;
    },
    addComment: async (postId: number, content: string) => {
        const res = await api.post(`/social/posts/${postId}/comments`, { content });
        return res.data;
    },
    toggleLike: async (postId: number) => {
        const res = await api.post(`/social/posts/${postId}/like`);
        return res.data;
    }
};
