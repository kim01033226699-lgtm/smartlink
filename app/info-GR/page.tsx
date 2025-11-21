'use client';
import { useEffect } from 'react';
import BottomNavigation from '@/app/components/BottomNavigation';

export default function InfoGRPage() {
  // 정적 HTML 파일 직접 참조
  const iframeSrc = '/info-GR/index.html';

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
      <div style={{ width: '100vw', height: 'calc(100vh - 62px)', overflow: 'hidden', margin: 0, padding: 0 }}>
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
