"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    MessageSquare,
    LogOut,
    UserCheck,
    HelpCircle,
    FileText,
    Shield,
    Package,
    Receipt,
    BarChart3
} from "lucide-react";
import clsx from "clsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Mentors", href: "/admin/mentors", icon: UserCheck },
        { name: "Topics", href: "/admin/topics", icon: BookOpen },
        { name: "Scenarios", href: "/admin/scenarios", icon: MessageSquare },
        { name: "Gói dịch vụ", href: "/admin/packages", icon: Package },
        { name: "Lịch sử mua", href: "/admin/purchases", icon: Receipt },
        { name: "Báo cáo", href: "/admin/reports", icon: BarChart3 },
        { name: "Hỗ trợ", href: "/admin/support", icon: HelpCircle },
        { name: "Kiểm duyệt", href: "/admin/moderation", icon: Shield },
        { name: "Chính sách", href: "/admin/policies", icon: FileText },
    ];

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm border-r border-gray-100 flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-black text-[#007bff]">AESP Admin</h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">{user?.full_name}</p>
                    </div>
                    <nav className="mt-4 px-3 space-y-1 flex-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all",
                                        isActive
                                            ? "bg-[#007bff] text-white shadow-md"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-[#007bff]"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-3 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
