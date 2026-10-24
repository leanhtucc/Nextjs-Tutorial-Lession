import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo hoá đơn | Acme Dashboard',
};

export default async function Page() {
  const session = await auth();

  // =========================================================================
  // LỚP 2: KIỂM TRA PHÂN QUYỀN TẠI PAGE LEVEL (SERVER COMPONENT)
  // Ngăn chặn người dùng vai trò 'user' truy cập giao diện tạo hoá đơn
  // =========================================================================
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard/invoices');
  }

  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Hoá đơn', href: '/dashboard/invoices' },
          {
            label: 'Tạo hoá đơn mới (Admin)',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-800">
        🛡️ <strong>Khu vực Quản trị viên:</strong> Bạn đang thao tác với quyền <code>admin</code>. Các thay đổi tại đây sẽ trực tiếp ghi vào cơ sở dữ liệu.
      </div>
      <Form customers={customers} />
    </main>
  );
}
