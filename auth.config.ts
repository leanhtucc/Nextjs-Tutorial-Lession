import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isAdminRoute =
        nextUrl.pathname.startsWith('/dashboard/admin') ||
        nextUrl.pathname.startsWith('/dashboard/invoices/create') ||
        nextUrl.pathname.includes('/edit');

      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false; // Chuyển hướng người dùng chưa đăng nhập về /login
        }

        // =====================================================================
        // LỚP 1: BẢO VỆ ROUTE BẰNG EDGE MIDDLEWARE
        // Ngay khi request đến Edge, kiểm tra vai trò admin
        // Nếu user thường cố tình truy cập URL admin -> Lập tức chặn & redirect
        // =====================================================================
        if (isAdminRoute && auth?.user?.role !== 'admin') {
          return Response.redirect(new URL('/unauthorized', nextUrl));
        }

        return true;
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
  },
  providers: [], // Sẽ được bổ sung đầy đủ providers trong auth.ts
} satisfies NextAuthConfig;
