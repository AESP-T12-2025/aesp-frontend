import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UploadResponse {
    url: string;
    public_id: string;
}

// ============================================================================
// UPLOAD SERVICE
// ============================================================================

export const uploadService = {
    /**
     * Upload image to cloud storage (Cloudinary)
     * Returns secure URL and public ID
     */
    uploadImage: async (file: File | Blob): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    }
};
