'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import './info-GR.css';

export default function InfoGRPage() {
  const router = useRouter();

  const menus = [
    {
      id: 1,
      title: '정착교육비',
      description: '정착교육비 지원금 계산',
      path: '/info-GR/settlement-education',
      available: true
    },
    {
      id: 2,
      title: '활동수수료',
      description: '활동수수료 I,II 제도 안내',
      path: '/info-GR/activity-fee',
      available: true
    },
    {
      id: 3,
      title: '영업관리자 지원금',
      description: '위임 자격 및 지원금 계산',
      path: '/info-GR/m-project',
      available: true
    }
  ];

  return (
    <>
      <div className="menu-page">
        {/* Header */}
        {/* Header */}
        <header className="menu-header">
          <button onClick={() => router.back()} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center px-4">
            <h1 className="menu-title">굿리치 지원금</h1>
            <p className="text-xs text-white/90 mt-2 break-keep">편의를 위한 참고용으로 정확한 내용은 규정을 준수합니다.</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="menu-content">
          <div className="w-full max-w-[700px] mx-auto px-4">
            <div className="menu-grid">
              {menus.map(menu => {
                return (
                  <div
                    key={menu.id}
                    className="menu-box"
                    onClick={() => {
                      if (menu.available) {
                        router.push(menu.path);
                      }
                    }}
                  >
                    <h2 className="menu-box-title">{menu.title}</h2>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="menu-footer">
          <div className="container"></div>
        </footer>
      </div>

      <BottomNavigation />
    </>
  );
}


