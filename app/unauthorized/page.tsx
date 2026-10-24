import Link from 'next/link';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <ShieldExclamationIcon className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        403 - Quyền truy cập bị từ chối (Forbidden)
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        Bạn không có quyền quản trị viên (Admin) để truy cập tài nguyên này. Vui
        lòng liên hệ quản trị hệ thống hoặc quay về bảng điều khiển người dùng.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Quay lại Bảng điều khiển
      </Link>
    </main>
  );
}
