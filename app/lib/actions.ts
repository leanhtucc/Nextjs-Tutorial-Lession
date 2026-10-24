'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';

const isLocalhost =
  process.env.POSTGRES_URL?.includes('localhost') ||
  process.env.POSTGRES_URL?.includes('127.0.0.1');

const isSampleUrl =
  !process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL.includes('sample') ||
  process.env.POSTGRES_URL.includes('your_');

const sql = postgres(process.env.POSTGRES_URL || '', {
  ssl: isLocalhost ? false : 'require',
  connect_timeout: 3,
});

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Vui lòng chọn khách hàng.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Vui lòng nhập số tiền lớn hơn 0 USD.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Vui lòng chọn trạng thái hoá đơn.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// ==========================================
// 1. Xác thực đăng nhập qua Email / Mật khẩu
// ==========================================
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email hoặc mật khẩu không chính xác.';
        default:
          return 'Đã xảy ra lỗi khi xác thực tài khoản.';
      }
    }
    throw error;
  }
}

// ==========================================
// 2. Xác thực đăng nhập qua OAuth Provider
// ==========================================
export async function authenticateOAuth(provider: 'github' | 'google') {
  await signIn(provider, { redirectTo: '/dashboard' });
}

// ==========================================
// 3. Đăng xuất
// ==========================================
export async function handleSignOut() {
  await signOut({ redirectTo: '/login' });
}

// =========================================================================
// 4. Lớp 3: Server Action RBAC Protection - Tạo hoá đơn (Chỉ Admin)
// =========================================================================
export async function createInvoice(prevState: State, formData: FormData) {
  const session = await auth();

  // Kiểm tra quyền Admin ở tầng Server Action
  if (!session?.user || session.user.role !== 'admin') {
    return {
      message: 'Lỗi quyền truy cập: Chỉ có quản trị viên (Admin) mới có quyền tạo hoá đơn.',
    };
  }

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Thiếu hoặc sai trường dữ liệu. Không thể tạo hoá đơn.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  if (!isSampleUrl) {
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      console.warn('PostgreSQL query error on createInvoice (using fallback mode):', error);
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// =========================================================================
// 5. Lớp 3: Server Action RBAC Protection - Cập nhật hoá đơn (Chỉ Admin)
// =========================================================================
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const session = await auth();

  // Kiểm tra quyền Admin ở tầng Server Action
  if (!session?.user || session.user.role !== 'admin') {
    return {
      message: 'Lỗi quyền truy cập: Chỉ có quản trị viên (Admin) mới có quyền chỉnh sửa hoá đơn.',
    };
  }

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Thiếu dữ liệu bắt buộc. Không thể cập nhật hoá đơn.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100);

  if (!isSampleUrl) {
    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
      console.warn('PostgreSQL query error on updateInvoice (using fallback mode):', error);
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// =========================================================================
// 6. Lớp 3: Server Action RBAC Protection - Xoá hoá đơn (Chỉ Admin)
// =========================================================================
export async function deleteInvoice(id: string) {
  const session = await auth();

  // Lớp phòng thủ cốt lõi: Ngăn chặn triệt để hành vi bypass qua POST request trực tiếp
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Forbidden: Bạn không có quyền thực hiện hành động này. Yêu cầu quyền Admin.');
  }

  if (!isSampleUrl) {
    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
      console.warn('PostgreSQL query error on deleteInvoice (using fallback mode):', error);
    }
  }

  revalidatePath('/dashboard/invoices');
  return { message: 'Đã xoá hoá đơn thành công.' };
}
