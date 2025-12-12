'use client';
import { useRouter } from 'next/navigation';
import { GraduationCap, DollarSign, UserCog, Plus } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import { SupportCard } from '@/app/components/SupportCard';
import './info-GR.css';

export default function InfoGRPage() {
  const router = useRouter();

  const menus = [
    {
      id: 1,
      title: '정착교육비',
      description: '정착교육비 지원금 계산',
      path: '/info-GR/settlement-education',
      icon: GraduationCap,
      available: true
    },
    {
      id: 2,
      title: '활동수수료',
      description: '활동수수료 I,II 제도 안내',
      path: '/info-GR/activity-fee',
      icon: DollarSign,
      available: true
    },
    {
      id: 3,
      title: '영업관리자 지원금',
      description: '위임 자격 및 지원금 계산',
      path: '/info-GR/m-project',
      icon: UserCog,
      available: true
    }
  ];

  return (
    <>
      <div className="menu-page">
        {/* Header */}
        {/* Header */}
        <header className="menu-header">
          <div className="container">
            <h1 className="menu-title">굿리치 지원금</h1>
            <p className="menu-subtitle">편의를 위한 참고용으로 정확한 내용은 규정을 준수합니다.</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="menu-content">
          <div className="container">
            <div className="menu-grid">
              {menus.map(menu => {
                const IconComponent = menu.icon;
                return menu.available ? (
                  <SupportCard
                    key={menu.id}
                    title={menu.title}
                    description={menu.description}
                    icon={IconComponent}
                    onClick={() => router.push(menu.path)}
                  />
                ) : (
                  <div
                    key={menu.id}
                    className="menu-box disabled"
                  >
                    <div className="menu-icon">
                      <IconComponent size={32} />
                    </div>
                    <h2 className="menu-box-title">{menu.title}</h2>
                    {/* description hidden in guidebook disabled items usually, but keeping structure similar to category-box */}
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


