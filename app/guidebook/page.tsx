'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileText, Shield, DollarSign, GraduationCap, FileCheck, Laptop, CheckCircle, Users } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import { SupportCard } from '@/app/components/SupportCard';
import './guidebook.css';

export default function GuidebookPage() {
  const router = useRouter();

  // 스크롤 복원 비활성화 - 뒤로가기 시 레이아웃 깨짐 방지
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const categories = [
    {
      id: 1,
      title: '위촉',
      description: '위촉 및 해촉 프로세스 안내',
      path: '/guidebook/onboarding',
      icon: FileText,
      available: true
    },
    {
      id: 2,
      title: '재정보증',
      description: '보증 관련 업무 안내',
      path: '/guidebook/guarantee',
      icon: Shield,
      available: false
    },
    {
      id: 3,
      title: '지원금',
      description: '각종 지원금 신청 및 계산',
      path: '/info-GR/',
      icon: DollarSign,
      available: true
    },
    {
      id: 4,
      title: '금융캠퍼스',
      description: '교육 관련 업무 안내',
      path: '/info-gfe/',
      icon: GraduationCap,
      available: true
    },
    {
      id: 5,
      title: '보험계약',
      description: '보험계약 관련 업무 안내',
      path: '/guidebook/insurance',
      icon: FileCheck,
      available: false
    },
    {
      id: 6,
      title: '굿리치플래너GP',
      description: 'GP시스템 사용 가이드',
      path: '/guidebook/gp',
      icon: Laptop,
      available: false
    },
    {
      id: 7,
      title: '기타',
      description: '기타 업무 안내',
      path: '/guidebook/etc',
      icon: CheckCircle,
      available: false
    },
    {
      id: 8,
      title: '',
      description: '',
      path: '',
      icon: FileText,
      available: false,
      isEmpty: true
    }
  ];

  return (
    <>
      <div className="guidebook-page">
        {/* Header */}
        <header className="guidebook-header">
          <div className="container">
            <div className="guidebook-logo-wrapper">
              <img src="/smartlink/images/GR-img.png" alt="GoodRich" className="guidebook-logo" />
            </div>
            <div className="guidebook-badge">업무 가이드</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="guidebook-content">
          <div className="container">
            <div className="category-grid">
              {categories.map(category => {
                const IconComponent = category.icon;

                // Empty spacer
                if (category.isEmpty) {
                  return <div key={category.id} className="empty-spacer"></div>;
                }

                return category.available ? (
                  <SupportCard
                    key={category.id}
                    title={category.title}
                    description={category.description}
                    icon={IconComponent}
                    onClick={() => router.push(category.path)}
                  />
                ) : (
                  <div
                    key={category.id}
                    className="category-box disabled"
                  >
                    <div className="category-icon">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="category-title">{category.title}</h3>
                  </div>
                );
              })}

              {/* Special Card - Department Contact */}
              <div className="department-card">
                <div className="department-icon">
                  <Users size={32} />
                </div>
                <h3 className="department-title">담당자 연락처</h3>
              </div>
            </div>

            {/* Footer Notice */}
            <p className="guidebook-footer-notice">
              굿리치 업무 가이드는 편의를 위해 제공된 자료이며,<br />
              자세한 기준과 절차는 담당자에게 문의하여 주시기 바랍니다.
            </p>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </>
  );
}
