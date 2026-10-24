import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khách hàng | Acme Dashboard',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
