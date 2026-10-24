import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <FaceFrownIcon className="w-12 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p className="text-gray-600">Không tìm thấy hoá đơn bạn yêu cầu chỉnh sửa.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Quay lại danh sách hoá đơn
      </Link>
    </main>
  );
}
