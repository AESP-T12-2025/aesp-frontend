"use client";

import { useState, useEffect, useRef } from "react";
import { User, Loader2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import api, { User as UserType } from "@/lib/api";
import { adminService } from "@/services/adminService";
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
            const response = await api.get("/users");
            if (isMounted.current) setUsers(Array.isArray(response.data) ? response.data : []);
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
            toast.success(`User ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
            setUsers(prev => prev.map(u =>
                u.user_id === userId ? { ...u, is_active: !currentStatus } : u
            ));
        } catch (err) {
            toast.error("Failed to update user status");
            console.error(err);
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Enable/Disable accounts and view user list</p>
                </div>
                <button onClick={fetchUsers} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
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
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Click to toggle)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.user_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={user.role}
                                            onChange={async (e) => {
                                                const newRole = e.target.value;
                                                if (newRole === user.role) return;
                                                try {
                                                    await adminService.changeUserRole(user.user_id, newRole);
                                                    toast.success(`Changed ${user.full_name} to ${newRole}`);
                                                    setUsers(prev => prev.map(u =>
                                                        u.user_id === user.user_id ? { ...u, role: newRole } : u
                                                    ));
                                                } catch (err) {
                                                    toast.error("Failed to change role");
                                                }
                                            }}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer border-0 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : user.role === 'MENTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                                        >
                                            <option value="LEARNER">LEARNER</option>
                                            <option value="MENTOR">MENTOR</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {/* Toggle Switch for Enable/Disable */}
                                        <button
                                            onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                                            disabled={togglingId === user.user_id}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${user.is_active
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                } ${togglingId === user.user_id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                        >
                                            {togglingId === user.user_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : user.is_active ? (
                                                <ToggleRight className="w-5 h-5" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5" />
                                            )}
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
