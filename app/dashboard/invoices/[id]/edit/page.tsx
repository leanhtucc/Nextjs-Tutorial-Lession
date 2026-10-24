import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa hoá đơn | Acme Dashboard',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const session = await auth();

  // =========================================================================
  // LỚP 2: KIỂM TRA PHÂN QUYỀN TẠI PAGE LEVEL (SERVER COMPONENT)
  // =========================================================================
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard/invoices');
  }

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Hoá đơn', href: '/dashboard/invoices' },
          {
            label: 'Chỉnh sửa hoá đơn (Admin)',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
