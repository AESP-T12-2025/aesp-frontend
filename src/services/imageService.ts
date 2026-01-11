import api from '@/lib/api';

export interface PexelsImage {
    url: string;
    medium: string;
    small: string;
    photographer?: string;
    alt?: string;
}

// Cache for images to avoid repeated API calls
const imageCache: { [key: string]: string } = {};

export const imageService = {
    getTopicImage: async (keyword: string): Promise<string> => {
        // Check cache first
        if (imageCache[keyword]) {
            return imageCache[keyword];
        }

        try {
            const res = await api.get(`/images/topic/${encodeURIComponent(keyword)}`);
            const url = res.data?.url || res.data?.medium || '';

            // Cache the result
            if (url) imageCache[keyword] = url;

            return url;
        } catch (e) {
            // Fallback to Unsplash
            return `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)},english`;
        }
    },

    searchImages: async (query: string): Promise<PexelsImage> => {
        const res = await api.get('/images/search', { params: { query } });
        return res.data;
    }
};
