import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <FaceFrownIcon className="w-16 text-gray-400" />
      <h1 className="text-3xl font-bold text-gray-900">404 - Trang không tồn tại</h1>
      <p className="text-gray-600 max-w-sm">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Về Trang chủ
      </Link>
    </main>
  );
}
