import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Post {
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at?: string;
    likes_count?: number;
    comments_count?: number;
    is_liked?: boolean;
    user_name?: string;
}

export interface Comment {
    comment_id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    user_name?: string;
}

export interface PostCreate {
    content: string;
}

export interface PostUpdate {
    content: string;
}

export interface CommentCreate {
    content: string;
}

// ============================================================================
// SOCIAL SERVICE
// ============================================================================

export const socialService = {
    // ========================================================================
    // COMMUNITY FEED
    // ========================================================================

    /**
     * Get community feed (all posts)
     * Public feed for all users
     */
    getFeed: async (skip: number = 0, limit: number = 20): Promise<Post[]> => {
        const res = await api.get('/social/posts', {
            params: { skip, limit }
        });
        return res.data;
    },

    /**
     * Get specific user's posts
     * Filter posts by user ID
     */
    getUserPosts: async (userId: number, skip: number = 0, limit: number = 20): Promise<Post[]> => {
        const res = await api.get(`/social/users/${userId}/posts`, {
            params: { skip, limit }
        });
        return res.data;
    },

    // ========================================================================
    // POST MANAGEMENT
    // ========================================================================

    /**
     * Create new post
     * Publish content to community feed
     */
    createPost: async (content: string): Promise<Post> => {
        const res = await api.post('/social/posts', { content });
        return res.data;
    },

    /**
     * Update own post
     * Edit post content
     */
    updatePost: async (postId: number, content: string): Promise<Post> => {
        const res = await api.put(`/social/posts/${postId}`, { content });
        return res.data;
    },

    /**
     * Delete own post
     * Remove post from feed
     */
    deletePost: async (postId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/social/posts/${postId}`);
        return res.data;
    },

    // ========================================================================
    // COMMENTS
    // ========================================================================

    /**
     * Get comments for a post
     * Retrieve all comments on specific post
     */
    getComments: async (postId: number): Promise<Comment[]> => {
        const res = await api.get(`/social/posts/${postId}/comments`);
        return res.data;
    },

    /**
     * Add comment to post
     * Post a comment on specific post
     */
    addComment: async (postId: number, content: string): Promise<Comment> => {
        const res = await api.post(`/social/posts/${postId}/comments`, { content });
        return res.data;
    },

    /**
     * Delete own comment
     * Remove comment from post
     */
    deleteComment: async (commentId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/social/comments/${commentId}`);
        return res.data;
    },

    // ========================================================================
    // REACTIONS (LIKES)
    // ========================================================================

    /**
     * Like a post
     * Add like to post
     */
    likePost: async (postId: number): Promise<{ message: string; likes_count: number }> => {
        const res = await api.post(`/social/posts/${postId}/like`);
        return res.data;
    },

    /**
     * Unlike a post
     * Remove like from post
     */
    unlikePost: async (postId: number): Promise<{ message: string; likes_count: number }> => {
        const res = await api.delete(`/social/posts/${postId}/like`);
        return res.data;
    },

    /**
     * Toggle like (legacy method)
     * Like or unlike based on current state
     */
    toggleLike: async (postId: number) => {
        const res = await api.post(`/social/posts/${postId}/like`);
        return res.data;
    },

    // ========================================================================
    // ADMIN MODERATION
    // ========================================================================

    /**
     * Get all posts for moderation (Admin only)
     * Admin view of all posts with moderation options
     */
    getAdminPosts: async (skip: number = 0, limit: number = 50): Promise<Post[]> => {
        const res = await api.get('/social/admin/posts', {
            params: { skip, limit }
        });
        return res.data;
    },

    /**
     * Delete post as admin (Admin only)
     * Remove inappropriate post
     */
    deletePostAsAdmin: async (postId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/social/admin/posts/${postId}`);
        return res.data;
    },

    /**
     * Delete comment as admin (Admin only)
     * Remove inappropriate comment
     */
    deleteCommentAsAdmin: async (commentId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/social/admin/comments/${commentId}`);
        return res.data;
    }
};
