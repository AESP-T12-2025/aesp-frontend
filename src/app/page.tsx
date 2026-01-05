import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">AESP System</h1>
        <p className="mb-8 text-gray-600">Frontend System for Week 1.</p>
        <Link
          href="/admin"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
