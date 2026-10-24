'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Invoice error boundary caught:', error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        <ExclamationTriangleIcon className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Đã xảy ra sự cố!
      </h2>
      <p className="text-sm text-gray-600 max-w-md mb-6">
        {error.message || 'Không thể thực hiện yêu cầu. Có thể bạn không đủ quyền hạn hoặc lỗi kết nối.'}
      </p>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset()}
      >
        Thử lại
      </button>
    </main>
  );
}
