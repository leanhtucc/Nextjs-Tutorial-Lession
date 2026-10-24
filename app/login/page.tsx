import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập | Acme Dashboard',
  description:
    'Đăng nhập vào hệ thống quản trị Acme Dashboard để quản lý khách hàng, theo dõi hoá đơn và doanh thu.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Đăng nhập tài khoản | Acme Dashboard',
    description:
      'Cổng xác thực an toàn dành cho Quản trị viên và Người dùng của Acme Dashboard.',
    url: '/login',
    siteName: 'Acme Dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đăng nhập | Acme Dashboard',
    description: 'Truy cập bảng điều khiển Acme Dashboard với phân quyền RBAC.',
  },
};

export default function LoginPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trang đăng nhập Acme Dashboard',
    description:
      'Trang xác thực người dùng hỗ trợ OAuth và đăng nhập tài khoản / mật khẩu.',
    url: 'https://acme-dashboard-demo.vercel.app/login',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: 'https://acme-dashboard-demo.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Đăng nhập',
          item: 'https://acme-dashboard-demo.vercel.app/login',
        },
      ],
    },
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
