import api from '@/lib/api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success' | 'warning';
    created_at: string;
    is_read: boolean;
}

export interface DeviceRegistration {
    token: string;
    platform: 'android' | 'ios' | 'web';
    device_id: string;
}

export interface NotificationCreate {
    title: string;
    message: string;
    type?: string;
    user_id?: number;
    data?: any;
}

export interface NotificationPreferences {
    email_notifications?: boolean;
    push_notifications?: boolean;
    notification_types?: Record<string, boolean>;
}

export const notificationService = {
    // ========================================================================
    // USER ENDPOINTS
    // ========================================================================

    /**
     * Get all notifications for current user
     */
    getAll: async (): Promise<Notification[]> => {
        const res = await api.get('/notifications');
        return res.data;
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async (): Promise<{ count: number }> => {
        const res = await api.get('/notifications/unread-count');
        return res.data;
    },

    /**
     * Mark single notification as read
     */
    markRead: async (id: number) => {
        const res = await api.patch(`/notifications/${id}/read`);
        return res.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllRead: async () => {
        const res = await api.post('/notifications/mark-all-read');
        return res.data;
    },

    /**
     * Delete a notification
     */
    delete: async (id: number) => {
        const res = await api.delete(`/notifications/${id}`);
        return res.data;
    },

    // ========================================================================
    // DEVICE TOKEN ENDPOINTS (Issue #50: Push Notifications)
    // ========================================================================

    /**
     * Register device for push notifications
     */
    registerDevice: async (device: DeviceRegistration) => {
        const res = await api.post('/notifications/devices', device);
        return res.data;
    },

    /**
     * Unregister device from push notifications
     */
    unregisterDevice: async (deviceId: string) => {
        const res = await api.delete(`/notifications/devices/${deviceId}`);
        return res.data;
    },

    /**
     * Get user's registered devices
     */
    getMyDevices: async () => {
        const res = await api.get('/notifications/devices');
        return res.data;
    },

    // ========================================================================
    // PREFERENCES
    // ========================================================================

    /**
     * Get notification preferences
     */
    getPreferences: async () => {
        const res = await api.get('/notifications/preferences');
        return res.data;
    },

    /**
     * Update notification preferences
     */
    updatePreferences: async (preferences: NotificationPreferences) => {
        const res = await api.put('/notifications/preferences', preferences);
        return res.data;
    },

    /**
     * Partially update notification preferences
     */
    patchPreferences: async (preferences: NotificationPreferences) => {
        const res = await api.patch('/notifications/preferences', preferences);
        return res.data;
    },

    // ========================================================================
    // ADMIN ENDPOINTS (Issue #50)
    // ========================================================================

    /**
     * Create a notification for a user (admin only)
     */
    createNotification: async (notification: NotificationCreate) => {
        const res = await api.post('/notifications', notification);
        return res.data;
    },

    /**
     * Send push notification (admin only)
     */
    sendPushNotification: async (notification: NotificationCreate) => {
        const res = await api.post('/notifications/send', notification);
        return res.data;
    },

    /**
     * Broadcast notification to multiple users (admin only)
     */
    broadcastNotification: async (data: {
        title: string;
        message: string;
        type?: string;
        target_users?: string; // 'all' or comma-separated user IDs
        data?: any;
    }) => {
        const res = await api.post('/notifications/broadcast', data);
        return res.data;
    }
};
