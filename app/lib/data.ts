import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const isLocalhost =
  process.env.POSTGRES_URL?.includes('localhost') ||
  process.env.POSTGRES_URL?.includes('127.0.0.1');

const isSampleUrl =
  !process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL.includes('sample') ||
  process.env.POSTGRES_URL.includes('your_');

let dbUnavailable = false;

const sql = postgres(process.env.POSTGRES_URL || '', {
  ssl: isLocalhost ? false : 'require',
  connect_timeout: 1,
});

function handleDbError(error: any) {
  if (
    error?.code === 'ECONNREFUSED' ||
    error?.message?.includes('ECONNREFUSED') ||
    error?.name === 'AggregateError'
  ) {
    dbUnavailable = true;
  }
}

export async function fetchRevenue() {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const data = await sql<Revenue[]>`SELECT * FROM revenue`;
      if (data && data.length > 0) return data;
    } catch (error) {
      handleDbError(error);
    }
  }

  const { revenue } = await import('./placeholder-data');
  return revenue;
}

export async function fetchLatestInvoices() {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const data = await sql<LatestInvoiceRaw[]>`
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        ORDER BY invoices.date DESC
        LIMIT 5`;

      if (data && data.length > 0) {
        return data.map((invoice) => ({
          ...invoice,
          amount: formatCurrency(invoice.amount),
        }));
      }
    } catch (error) {
      handleDbError(error);
    }
  }

  const { invoices, customers } = await import('./placeholder-data');
  return invoices.slice(0, 5).map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id) || {
      name: 'Khách hàng',
      image_url: '/customers/evil-rabbit.png',
      email: 'customer@example.com',
    };
    return {
      id: invoice.customer_id,
      name: customer.name,
      image_url: customer.image_url,
      email: customer.email,
      amount: formatCurrency(invoice.amount),
    };
  });
}

export async function fetchCardData() {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
      const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
      const invoiceStatusPromise = sql`SELECT
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
           FROM invoices`;

      const data = await Promise.all([
        invoiceCountPromise,
        customerCountPromise,
        invoiceStatusPromise,
      ]);

      return {
        numberOfInvoices: Number(data[0][0].count ?? '0'),
        numberOfCustomers: Number(data[1][0].count ?? '0'),
        totalPaidInvoices: formatCurrency(data[2][0].paid ?? '0'),
        totalPendingInvoices: formatCurrency(data[2][0].pending ?? '0'),
      };
    } catch (error) {
      handleDbError(error);
    }
  }

  const { invoices, customers } = await import('./placeholder-data');
  const paidSum = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingSum = invoices
    .filter((i) => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return {
    numberOfCustomers: customers.length,
    numberOfInvoices: invoices.length,
    totalPaidInvoices: formatCurrency(paidSum),
    totalPendingInvoices: formatCurrency(pendingSum),
  };
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (!isSampleUrl && !dbUnavailable) {
    try {
      const invoices = await sql<InvoicesTable[]>`
        SELECT
          invoices.id,
          invoices.amount,
          invoices.date,
          invoices.status,
          customers.name,
          customers.email,
          customers.image_url
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        WHERE
          customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`} OR
          invoices.amount::text ILIKE ${`%${query}%`} OR
          invoices.date::text ILIKE ${`%${query}%`} OR
          invoices.status ILIKE ${`%${query}%`}
        ORDER BY invoices.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

      if (invoices && invoices.length > 0) return invoices;
    } catch (error) {
      handleDbError(error);
    }
  }

  const { invoices, customers } = await import('./placeholder-data');
  const filtered = invoices.filter((inv) => {
    const cust = customers.find((c) => c.id === inv.customer_id);
    const search = query.toLowerCase();
    return (
      !query ||
      cust?.name.toLowerCase().includes(search) ||
      cust?.email.toLowerCase().includes(search) ||
      inv.amount.toString().includes(search) ||
      inv.status.includes(search)
    );
  });

  return filtered.slice(offset, offset + ITEMS_PER_PAGE).map((inv, idx) => {
    const cust = customers.find((c) => c.id === inv.customer_id) || {
      name: 'Delba de Oliveira',
      email: 'delba@oliveira.com',
      image_url: '/customers/delba-de-oliveira.png',
    };
    return {
      id: `inv-${offset + idx + 1}`,
      customer_id: inv.customer_id,
      name: cust.name,
      email: cust.email,
      image_url: cust.image_url,
      date: inv.date,
      amount: inv.amount,
      status: inv.status as 'pending' | 'paid',
    };
  });
}

export async function fetchInvoicesPages(query: string) {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const data = await sql`SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

      const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      handleDbError(error);
    }
  }

  return 2;
}

export async function fetchInvoiceById(id: string) {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const data = await sql<InvoiceForm[]>`
        SELECT
          invoices.id,
          invoices.customer_id,
          invoices.amount,
          invoices.status
        FROM invoices
        WHERE invoices.id = ${id};
      `;

      if (data && data.length > 0) {
        return {
          ...data[0],
          amount: data[0].amount / 100,
        };
      }
    } catch (error) {
      handleDbError(error);
    }
  }

  const { invoices } = await import('./placeholder-data');
  return {
    id,
    customer_id: invoices[0].customer_id,
    amount: invoices[0].amount / 100,
    status: invoices[0].status as 'pending' | 'paid',
  };
}

export async function fetchCustomers() {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const customers = await sql<CustomerField[]>`
        SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
      `;

      if (customers && customers.length > 0) return customers;
    } catch (err) {
      handleDbError(err);
    }
  }

  const { customers } = await import('./placeholder-data');
  return customers.map((c) => ({ id: c.id, name: c.name }));
}

export async function fetchFilteredCustomers(query: string) {
  if (!isSampleUrl && !dbUnavailable) {
    try {
      const data = await sql<CustomersTableType[]>`
  		SELECT
  		  customers.id,
  		  customers.name,
  		  customers.email,
  		  customers.image_url,
  		  COUNT(invoices.id) AS total_invoices,
  		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
  		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
  		FROM customers
  		LEFT JOIN invoices ON customers.id = invoices.customer_id
  		WHERE
  		  customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
  		GROUP BY customers.id, customers.name, customers.email, customers.image_url
  		ORDER BY customers.name ASC
  	  `;

      if (data && data.length > 0) {
        return data.map((customer) => ({
          ...customer,
          total_pending: formatCurrency(customer.total_pending),
          total_paid: formatCurrency(customer.total_paid),
        }));
      }
    } catch (err) {
      handleDbError(err);
    }
  }

  const { customers, invoices } = await import('./placeholder-data');
  return customers.map((c) => {
    const userInvoices = invoices.filter((i) => i.customer_id === c.id);
    const totalPending = userInvoices
      .filter((i) => i.status === 'pending')
      .reduce((a, b) => a + b.amount, 0);
    const totalPaid = userInvoices
      .filter((i) => i.status === 'paid')
      .reduce((a, b) => a + b.amount, 0);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      image_url: c.image_url,
      total_invoices: userInvoices.length,
      total_pending: formatCurrency(totalPending),
      total_paid: formatCurrency(totalPaid),
    };
  });
}
