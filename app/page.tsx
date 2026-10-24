import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ | Acme Dashboard',
  description:
    'Nền tảng quản lý hoá đơn, theo dõi doanh thu và phân quyền người dùng đa lớp với Next.js 15 và NextAuth v5.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Acme Dashboard - Giải pháp Quản trị Tài chính Tinh gọn',
    description:
      'Hệ thống quản lý khách hàng và hoá đơn cho doanh nghiệp với bảo mật 3 lớp RBAC.',
    url: '/',
    siteName: 'Acme Dashboard',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acme Dashboard - Next.js 15 Enterprise App',
    description: 'Bảo mật đa lớp RBAC và tối ưu hoá SEO Lighthouse 100.',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Acme Dashboard',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    description:
      'Hệ thống quản lý tài chính, khách hàng và phát hành hoá đơn hiện đại xây dựng trên Next.js 15 và NextAuth v5.',
    url: 'https://acme-dashboard-demo.vercel.app',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Acme Inc.',
      url: 'https://acme-dashboard-demo.vercel.app',
    },
  };

  return (
    <main className="flex min-h-screen flex-col p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Chào mừng đến với Acme.</strong> Đây là nền tảng quản trị tài
            chính và hoá đơn doanh nghiệp được xây dựng trên{' '}
            <span className="text-blue-500 font-semibold">Next.js 15 App Router</span>
            , tích hợp xác thực NextAuth v5 và bảo mật phân quyền RBAC đa cấp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Đăng nhập hệ thống</span>{' '}
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Ảnh chụp màn hình trang quản trị Acme Dashboard phiên bản máy tính"
            priority
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Ảnh chụp màn hình trang quản trị Acme Dashboard phiên bản điện thoại"
            priority
          />
        </div>
      </div>
    </main>
  );
}
