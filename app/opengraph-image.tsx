import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Acme Dashboard - Hệ thống Quản trị Doanh nghiệp';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #1e3a8a, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-2px',
              color: '#ffffff',
            }}
          >
            Acme Dashboard
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#dbeafe',
            textAlign: 'center',
            maxWidth: '850px',
            marginBottom: '30px',
          }}
        >
          Nền tảng Quản trị Doanh nghiệp Hiện đại - Next.js 15 & NextAuth v5
        </div>
        <div
          style={{
            display: 'flex',
            gap: '15px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            🛡️ Bảo mật RBAC 3 Lớp
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            ⚡ Lighthouse 100 SEO
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
