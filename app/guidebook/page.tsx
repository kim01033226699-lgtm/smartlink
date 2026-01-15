'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, ExternalLink,
  UserCheck, UserPlus, X, Download, ChevronRight,
  FileText, ClipboardList, Check, Building2, Play,
  Plane, Laptop, HelpCircle, FileCheck, Terminal,
  DollarSign, GraduationCap, Shield, CheckCircle, Users
} from "lucide-react";
import BottomNavigation from '@/app/components/BottomNavigation';
import { SupportCard } from '@/app/components/SupportCard';
import ManagerInfoModal from './components/ManagerInfoModal';
import { useState } from 'react';
import { BASE_PATH } from '@/lib/utils';
import './guidebook.css';

export default function GuidebookPage() {
  const router = useRouter();
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

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
      id: 6,
      title: '2026\n윈터페스티벌',
      description: '2026 윈터페스티벌 가이드',
      path: '/guidebook/winter-2026',
      icon: Plane,
      available: true
    },
    {
      id: 1,
      title: '위촉 관리',
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
      id: 2,
      title: '재정보증',
      description: '보증 관련 업무 안내',
      path: '/guidebook/guarantee',
      icon: Shield,
      available: true
    },
    {
      id: 7,
      title: '문서양식',
      description: '각종 업무 서식 및 문서 자료',
      path: 'https://drive.google.com/drive/folders/1RwthlbiB-KXizdVB-RMtwM80cAUPO0aq?usp=sharing',
      icon: CheckCircle,
      available: true
    },
    {
      id: 5,
      title: '제규정',
      description: '사내 주요 규정 가이드',
      path: '/guidebook/regulations',
      icon: FileCheck,
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
    },
    {
      id: 9,
      title: '담당자 확인',
      description: '',
      path: '',
      icon: Users,
      available: true,
      isContactAction: true
    }
  ];

  return (
    <>
      <div className="guidebook-page">
        {/* Header */}
        <header className="guidebook-header">
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center">
            <div className="guidebook-logo-wrapper">
              <img src={`${BASE_PATH}/images/GR-img.png`} alt="GoodRich" className="guidebook-logo" />
            </div>
            <div className="text-center mt-2">
              <h1 className="text-xl font-bold text-gray-900">업무 가이드</h1>
              <p className="text-xs text-gray-500 mt-2 break-keep">
                굿리치 업무 가이드는 편의를 위해 정리된 자료입니다.<br />
                자세한 기준과 절차를 확인 바랍니다.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="guidebook-content">
          <div className="w-full max-w-[700px] mx-auto px-4">
            <div className="category-grid">
              {categories.map(category => {
                // Empty spacer
                if (category.isEmpty) {
                  return <div key={category.id} className="empty-spacer"></div>;
                }

                // Contact Action Button
                if (category.isContactAction) {
                  return (
                    <div
                      key={category.id}
                      className="category-box bg-orange-500 border-none"
                      style={{ background: '#FF9800' }}
                      onClick={() => {
                        setIsManagerModalOpen(true);
                      }}
                    >
                      <h3 className="category-title text-white font-bold" style={{ color: 'white' }}>담당자 확인 &gt;</h3>
                    </div>
                  );
                }

                // Custom Styling Logic
                const isWinter = category.title === '2026\n윈터페스티벌';
                const isCommission = category.title === '위촉 관리';
                const isInactive = ['제규정', '기타', '굿리치플래너GP'].includes(category.title);

                let cardClass = "category-box";
                if (isCommission) cardClass += " active-commission";
                if (isInactive) cardClass += " disabled-blur";

                const isSolidOrange = isWinter;

                return (
                  <div
                    key={category.id}
                    className={cardClass}
                    style={isSolidOrange ? { background: '#FF9800', border: 'none' } : {}}
                    onClick={() => {
                      if (category.available && !isInactive) {
                        if (category.path.startsWith('http')) {
                          window.open(category.path, '_blank');
                        } else {
                          router.push(category.path);
                        }
                      }
                    }}
                  >
                    <h3 className="category-title" style={isSolidOrange ? { color: 'white', fontWeight: 'bold' } : {}}>
                      {category.title.split('\n').map((line, i) => (
                        <span key={i} className={i > 0 ? "title-sub" : ""}>
                          {line}
                        </span>
                      ))}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />

      <ManagerInfoModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      />
    </>
  );
}
