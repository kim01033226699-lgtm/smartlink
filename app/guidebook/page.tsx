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
      title: '위촉 관리', // Updated Title
      description: '위촉 및 해촉 프로세스 안내',
      path: '/guidebook/onboarding',
      icon: FileText,
      available: true
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
      id: 2,
      title: '재정보증',
      description: '보증 관련 업무 안내',
      path: '/guidebook/guarantee',
      icon: Shield,
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
      id: 6,
      title: '굿리치플래너GP',
      description: 'GP시스템 사용 가이드',
      path: '/guidebook/gp',
      icon: Laptop,
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
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center">
            <div className="guidebook-logo-wrapper">
              <img src="/smartlink/images/GR-img.png" alt="GoodRich" className="guidebook-logo" />
            </div>
            <div className="text-center mt-2">
              <h1 className="text-xl font-bold text-gray-900">업무 가이드</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="guidebook-content">
          <div className="w-full max-w-[700px] mx-auto px-4">
            {/* Notice Text Section - Left Aligned with top margin */}
            <div className="mb-6 mt-[30px] text-left px-2">
              <p className="text-sm text-gray-600 leading-relaxed">
                굿리치 업무 가이드는 편의를 위해 제공된 자료이며,<br />
                자세한 기준과 절차는 담당자에게 문의하여 주시기 바랍니다.
              </p>
            </div>

            <div className="category-grid">
              {categories.map(category => {
                // Empty spacer
                if (category.isEmpty) {
                  return <div key={category.id} className="empty-spacer"></div>;
                }

                // Custom Styling Logic based on Title
                const isCommission = category.title === '위촉 관리';
                const isInactive = ['보험계약', '재정보증', '기타', '굿리치플래너GP'].includes(category.title);

                let cardClass = "category-box";
                if (isCommission) cardClass += " active-commission"; // Orange style
                if (isInactive) cardClass += " disabled-blur"; // Blur style

                return (
                  <div
                    key={category.id}
                    className={cardClass}
                    onClick={() => {
                      if (category.available && !isInactive) {
                        router.push(category.path);
                      }
                    }}
                  >
                    {/* Icon Removed - Title Only */}
                    <h3 className="category-title">{category.title}</h3>
                  </div>
                );
              })}

              {/* Special Card - Department Contact - New Horizontal Design */}
              <div className="col-span-3 mt-4"> {/* col-span-3 to take full width in grid */}
                <div className="bg-[#FFF8E1] rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFE082] flex items-center justify-center text-[#F57F17] font-bold text-lg flex-shrink-0">
                      ?
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 m-0 leading-tight">도움이 필요하신가요?</h3>
                      <p className="text-xs text-gray-600 mt-1 m-0">담당자에게 바로 문의하세요</p>
                    </div>
                  </div>
                  <button className="bg-orange-500 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center gap-1 hover:bg-orange-600 transition-colors whitespace-nowrap">
                    담당자 확인 &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </>
  );
}
