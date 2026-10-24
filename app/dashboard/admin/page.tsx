import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import postgres from 'postgres';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Panel | Acme Dashboard',
};

export default async function AdminPage() {
  const session = await auth();

  // =========================================================================
  // LỚP 2: KIỂM TRA PHÂN QUYỀN TẠI PAGE LEVEL (SERVER COMPONENT)
  // =========================================================================
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard');
  }

  let usersList: Array<{ id: string; name: string; email: string; role: string }> = [];
  if (process.env.POSTGRES_URL) {
    try {
      const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
      const rows = await sql`SELECT id, name, email, role FROM users ORDER BY role ASC, name ASC`;
      usersList = rows as any;
    } catch (err) {
      console.error('Failed to load users for admin:', err);
    }
  }

  return (
    <main className="w-full">
      <div className="flex w-full items-center justify-between border-b pb-4">
        <div>
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
            Admin Control Panel (RBAC Demo)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Trang được bảo vệ độc quyền bởi Middleware + Server Component + Server Action
          </p>
        </div>
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 border border-red-300">
          Admin Authenticated
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Bảo vệ Lớp 1 (Edge Middleware)
          </h2>
          <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          <p className="text-xs text-gray-600 mt-1">
            Chặn URL <code>/dashboard/admin/*</code> ngay tại Edge Runtime trước khi tới server.
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Bảo vệ Lớp 2 (Server Component Page)
          </h2>
          <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          <p className="text-xs text-gray-600 mt-1">
            Kiểm tra <code>session.user.role === &apos;admin&apos;</code> trên Node.js runtime.
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Bảo vệ Lớp 3 (Server Actions)
          </h2>
          <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          <p className="text-xs text-gray-600 mt-1">
            Ngăn chặn bypass qua POST requests trực tiếp vào database.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className={`${lusitana.className} text-xl font-bold text-gray-900 mb-4`}>
          Danh sách người dùng và vai trò trong hệ thống
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left font-semibold text-gray-900">
              <tr>
                <th className="px-4 py-3">Tên người dùng</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai trò (Role)</th>
                <th className="px-4 py-3">Quyền hạn hệ thống</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usersList.length > 0 ? (
                usersList.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {user.role === 'admin'
                        ? 'Toàn quyền (Xem, Tạo, Sửa, Xoá hoá đơn, Truy cập Admin Panel)'
                        : 'Chỉ xem (Xem Dashboard, xem danh sách hoá đơn)'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Chưa kết nối database hoặc chưa seed dữ liệu. Hãy cấu hình <code>POSTGRES_URL</code> và chạy route <code>/seed</code>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
