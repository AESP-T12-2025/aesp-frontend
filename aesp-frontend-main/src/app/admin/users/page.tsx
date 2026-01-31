"use client";

import { useState, useEffect, useRef } from "react";
import { User, Edit, Trash2, Loader2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { adminService } from "@/services/adminService";
import { User as UserType } from "@/lib/api";
import toast from "react-hot-toast";

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        fetchUsers();
        return () => { isMounted.current = false; };
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await adminService.getAllUsers();
            if (isMounted.current) setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (err) {
            console.error("Fetch users error:", err);
            let errorMessage = "Failed to fetch users. Check console for details.";
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { detail?: string } }, message?: string };
                errorMessage = axiosError.response?.data?.detail || axiosError.message || errorMessage;
            }
            if (isMounted.current) setError(errorMessage);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        setTogglingId(userId);
        try {
            await adminService.updateUserStatus(userId, !currentStatus);
            toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`);
            fetchUsers();
        } catch (err) {
            toast.error("Lỗi cập nhật trạng thái");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex space-x-2">
                    <button onClick={fetchUsers} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Add User
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                                            disabled={togglingId === user.user_id}
                                            className={`p-1.5 rounded-lg transition-colors ${user.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                            title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                        >
                                            {togglingId === user.user_id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : user.is_active ? (
                                                <ToggleRight className="w-5 h-5" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900 p-1.5">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 p-1.5">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
