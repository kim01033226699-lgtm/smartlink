'use client';
import { use, useEffect } from 'react';
import BottomNavigation from '@/app/components/BottomNavigation';

export default function InfoGRPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const resolvedParams = use(params);
  const pathSegments = resolvedParams.path || [];

  // 개발 환경에서는 Vite dev server 사용
  const isDev = process.env.NODE_ENV === 'development';
  const iframeSrc = isDev
    ? 'http://localhost:5173/'
    : (pathSegments.length > 0
        ? `/info-GR/${pathSegments.join('/')}`
        : '/info-GR/');

  useEffect(() => {
    // 외부 body 스크롤 제거
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // 컴포넌트 언마운트 시 원래대로 복구
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, paddingBottom: '62px' }}>
        <iframe
          src={iframeSrc}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            display: 'block',
          }}
          title="Info GR"
        />
      </div>
      <BottomNavigation />
    </>
  );
}
