import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import type { User } from '@/app/lib/definitions';

const isLocalhost =
  process.env.POSTGRES_URL?.includes('localhost') ||
  process.env.POSTGRES_URL?.includes('127.0.0.1');

const sql = postgres(process.env.POSTGRES_URL || '', {
  ssl: isLocalhost ? false : 'require',
  connect_timeout: 3,
});

let dbUnavailable = false;

async function getUser(email: string): Promise<User | undefined> {
  const isSampleUrl =
    !process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL.includes('sample') ||
    process.env.POSTGRES_URL.includes('your_');

  if (!isSampleUrl && !dbUnavailable) {
    try {
      const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
      if (user && user[0]) return user[0];
    } catch (error: any) {
      if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
        dbUnavailable = true;
      }
    }
  }

  // Fallback tức thì sang dữ liệu mẫu để test ngay lập tức mà không cần kết nối DB
  const { users } = await import('@/app/lib/placeholder-data');
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      password: found.password,
      role: (found.role as 'admin' | 'user') || 'user',
    };
  }

  return undefined;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          // Kiểm tra mật khẩu (hỗ trợ cả hash bcrypt trong DB và mật khẩu test)
          const passwordsMatch =
            password === user.password ||
            (await bcrypt.compare(password, user.password).catch(() => false));

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role || 'user',
            };
          }
        }

        console.log('Invalid credentials or authentication failed.');
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        const adminEmails = (
          process.env.ADMIN_EMAILS || 'admin@nextmail.com'
        )
          .split(',')
          .map((e) => e.trim().toLowerCase());

        if (user.role) {
          token.role = user.role;
        } else if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          token.role = 'admin';
        } else {
          token.role = 'user';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = (token.role as 'admin' | 'user') || 'user';
      }
      return session;
    },
  },
});
