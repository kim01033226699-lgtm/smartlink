'use client';
import { useRouter } from 'next/navigation';
import { GraduationCap, DollarSign, UserCog, Plus } from 'lucide-react';
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
        <header className="menu-header">
          <div className="container">
            <h1 className="menu-title">굿리치 지원금</h1>
            <p className="menu-subtitle">이해를 돕기 위한 요약으로, 정확한 내용은 관련 규정을 확인해 주세요</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="menu-content">
          <div className="container">
            <div className="menu-grid">
              {menus.map(menu => {
                const IconComponent = menu.icon;
                return menu.available ? (
                  <div
                    key={menu.id}
                    className="support-card"
                    onClick={() => router.push(menu.path)}
                  >
                    {/* Plus Button */}
                    <div className="support-card-plus">
                      <Plus className="support-card-plus-icon" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="support-card-content">
                      {/* Large Centered Icon */}
                      <div className="support-card-icon-wrapper">
                        <IconComponent className="support-card-icon" strokeWidth={1.5} />
                      </div>

                      {/* Title */}
                      <h2 className="support-card-title">{menu.title}</h2>
                    </div>
                  </div>
                ) : (
                  <div
                    key={menu.id}
                    className="menu-box disabled"
                  >
                    <div className="menu-box-inner">
                      <h2 className="menu-box-title">{menu.title}</h2>
                      <p className="menu-box-desc">{menu.description}</p>
                    </div>
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

