import api from '@/lib/api';

export interface ServicePackage {
    package_id?: number;
    id?: number;
    name: string;
    description?: string;
    price: number;
    duration_days?: number;
    features?: string[] | string;
    mentor_included?: boolean;
    is_active?: boolean;
}

export interface PaymentRequest {
    package_id: number;
    payment_method: string;
}

export const paymentService = {
    getPackages: async (mentorIncluded?: boolean): Promise<ServicePackage[]> => {
        const res = await api.get('/payment/packages', {
            params: { mentor_included: mentorIncluded }
        });
        return res.data;
    },

    createTransaction: async (data: PaymentRequest) => {
        const res = await api.post('/payment/create-transaction', data);
        return res.data;
    },

    getMySubscription: async () => {
        const res = await api.get('/payment/my-subscription');
        return res.data;
    },

    // Admin CRUD
    createPackage: async (data: Omit<ServicePackage, 'package_id' | 'id'>) => {
        const res = await api.post('/payment/packages', data);
        return res.data;
    },
    updatePackage: async (id: number, data: Partial<ServicePackage>) => {
        const res = await api.put(`/payment/packages/${id}`, data);
        return res.data;
    },
    deletePackage: async (id: number) => {
        const res = await api.delete(`/payment/packages/${id}`);
        return res.data;
    },

    // Upgrade/downgrade
    upgradeSubscription: async (newPackageId: number) => {
        const res = await api.post('/payment/upgrade', { package_id: newPackageId });
        return res.data;
    },
    cancelSubscription: async () => {
        const res = await api.post('/payment/cancel');
        return res.data;
    }
};

