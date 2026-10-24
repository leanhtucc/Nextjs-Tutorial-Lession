import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { auth } from '@/auth';
import {
  CardsSkeleton,
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role || 'user';
  const name = session?.user?.name || session?.user?.email || 'Người dùng';

  return (
    <main>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`${lusitana.className} text-xl md:text-2xl font-bold`}>
          Dashboard
        </h1>
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            role === 'admin'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          <span>
            Xin chào, <strong>{name}</strong>!
          </span>
          <span className="rounded bg-white px-2 py-0.5 text-xs font-bold uppercase shadow-sm">
            Vai trò: {role}
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
