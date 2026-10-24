import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://acme-dashboard-demo.vercel.app'),
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard - Quản trị Tài chính Doanh nghiệp',
  },
  description:
    'Hệ thống quản lý tài chính, khách hàng và phát hành hoá đơn hiện đại xây dựng trên Next.js 15 và NextAuth v5.',
  keywords: [
    'Next.js',
    'Dashboard',
    'NextAuth',
    'PostgreSQL',
    'Tailwind CSS',
    'SEO',
  ],
  authors: [{ name: 'Acme Inc' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
