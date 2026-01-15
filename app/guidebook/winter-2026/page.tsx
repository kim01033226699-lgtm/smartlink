'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import { BASE_PATH } from '@/lib/utils';
import BottomNavigation from '@/app/components/BottomNavigation';
import './winter-2026.css';

// Step Accordion Component
function StepAccordion({
    title,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={`mb-4 overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm transition-all ${isOpen ? 'ring-2 ring-sky-100 border-sky-200' : ''}`}>
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
            >
                <span className={`text-[0.95rem] font-bold ${isOpen ? 'text-sky-600' : 'text-slate-800'}`}>{title}</span>
                {isOpen ? (
                    <ChevronUp className="text-sky-500" size={20} />
                ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                )}
            </button>
            {isOpen && (
                <div className="border-t border-slate-100 p-5 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function WinterFestivalPage() {
    const router = useRouter();
    const [expandedStep, setExpandedStep] = useState<string | null>(null); // All sections closed by default
    const [activeSelectionTab, setActiveSelectionTab] = useState<'performance' | 'manager'>('performance');

    const toggleStep = (stepId: string) => {
        setExpandedStep(expandedStep === stepId ? null : stepId);
    };

    return (
        <>
            <div className="winter-page">
                {/* Header */}
                <header className="winter-header">
                    <button onClick={() => router.back()} className="back-button">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="w-full max-w-[700px] mx-auto flex flex-col items-center relative">
                        <div className="winter-logo-wrapper">
                            <img src={`${BASE_PATH}/images/GR-img.png`} alt="Logo" className="winter-logo" />
                        </div>
                        <div className="winter-badge">2026 윈터 페스티벌</div>
                    </div>
                </header>

                {/* Content */}
                <main className="winter-content">
                    <div className="w-full max-w-[700px] mx-auto">

                        {/* Travel Schedule - Moved to Top */}
                        <StepAccordion
                            title="■ 여행 일정"
                            isOpen={expandedStep === 'step-3'}
                            onToggle={() => toggleStep('step-3')}
                        >
                            <div className="space-y-6">
                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                                        <Plane size={18} className="text-sky-500" /> 오사카
                                    </h4>
                                    <ul className="winter-list">
                                        <li><span className="font-bold">기간</span>: 2026.04.08 ~ 04.11</li>
                                        <li className="text-sky-600 font-semibold !list-none !pl-0">→ 2박 3일, 2회차 진행</li>
                                    </ul>
                                </div>

                                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                                        <Plane size={18} className="text-sky-500" /> 마닐라
                                    </h4>
                                    <ul className="winter-list">
                                        <li><span className="font-bold">기간</span>: 2026.04.14 ~ 04.21</li>
                                        <li className="text-sky-600 font-semibold !list-none !pl-0">→ 서울 3회차, 부산 2회차 진행</li>
                                    </ul>
                                </div>
                            </div>
                        </StepAccordion>

                        {/* evaluación Period */}
                        <StepAccordion
                            title="■ 평가 기간"
                            isOpen={expandedStep === 'step-1'}
                            onToggle={() => toggleStep('step-1')}
                        >
                            <div className="winter-card bg-sky-50/50 border-sky-100">
                                <p className="font-bold text-sky-900 text-lg">
                                    2026.01.01 ~ 02.28 <span className="text-sm font-normal text-sky-600 ml-1">(2개월간)</span>
                                </p>
                            </div>
                        </StepAccordion>

                        {/* evaluación Items */}
                        <StepAccordion
                            title="■ 평가 항목"
                            isOpen={expandedStep === 'step-2'}
                            onToggle={() => toggleStep('step-2')}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-sky-500 font-bold mt-0.5">•</span>
                                    <p className="font-bold text-slate-800">신계약 정산평가업적</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-sky-500 font-bold mt-0.5">•</span>
                                    <p className="font-bold text-slate-800">달성자 배출 인원 (영업관리자 해당)</p>
                                </div>
                            </div>
                        </StepAccordion>

                        {/* Selection Criteria - Interactive */}
                        <StepAccordion
                            title="■ 선발 기준"
                            isOpen={expandedStep === 'step-4'}
                            onToggle={() => toggleStep('step-4')}
                        >
                            <div className="winter-tabs-grid">
                                <div
                                    className={`winter-tab-box ${activeSelectionTab === 'performance' ? 'active' : ''}`}
                                    onClick={() => setActiveSelectionTab('performance')}
                                >
                                    <span className="winter-tab-label">RP/SL/SM/지점장</span>
                                </div>
                                <div
                                    className={`winter-tab-box ${activeSelectionTab === 'manager' ? 'active' : ''}`}
                                    onClick={() => setActiveSelectionTab('manager')}
                                >
                                    <span className="winter-tab-label">영업관리자<br />(지점장/사업단장/본부장)</span>
                                </div>
                            </div>

                            <div className="winter-sub-box">
                                {activeSelectionTab === 'performance' ? (
                                    <div>
                                        <p className="text-slate-800 font-bold leading-relaxed">
                                            신계약 정산평가업적 <span className="text-amber-600 text-xl font-black">200만 원</span> 이상 달성자
                                        </p>
                                    </div>
                                ) : (
                                    <div className="winter-table-container mt-0 border-none shadow-none">
                                        <table className="winter-table split-or-table">
                                            <tbody>
                                                <tr>
                                                    <th className="text-center font-bold">직급</th>
                                                    <th className="text-center font-bold">신계약 정상평가업적 목표</th>
                                                    <th rowSpan={4} className="or-cell text-center font-bold">OR</th>
                                                    <th className="text-center font-bold">산하 달성자 배출 인원</th>
                                                </tr>
                                                <tr>
                                                    <td className="font-bold text-center border-t border-slate-200">지점장</td>
                                                    <td className="text-[0.75rem] leading-tight text-center border-t border-slate-200 font-normal">산하 조직 2개월 통산 1,800만 원 이상</td>
                                                    <td className="text-sky-600 text-center whitespace-nowrap border-t border-slate-200 font-normal">5명 이상</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-bold text-center font-bold">사업단장</td>
                                                    <td className="text-[0.75rem] leading-tight text-center font-normal">산하 조직 2개월 통산 3,000만 원 이상</td>
                                                    <td className="text-sky-600 text-center whitespace-nowrap font-normal">8명 이상</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-bold text-center font-bold">본부장</td>
                                                    <td className="text-[0.75rem] leading-tight text-center font-normal">산하 조직 2개월 통산 5,000만 원 이상</td>
                                                    <td className="text-sky-600 text-center whitespace-nowrap font-normal">15명 이상</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </StepAccordion>

                        {/* Refund Criteria */}
                        <StepAccordion
                            title="■ 환수 기준"
                            isOpen={expandedStep === 'step-6'}
                            onToggle={() => toggleStep('step-6')}
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2 underline underline-offset-4 decoration-slate-200">1) 해촉 시</h4>
                                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                                        <p className="text-sm text-slate-700">2026년 8월 31일 이내 해촉될 경우</p>
                                        <p className="font-bold text-red-600 mt-1">→ 여행가액 전액 환수</p>
                                    </div>
                                </div>
                                <div className="refund-highlight-box border-dashed">
                                    <span className="refund-highlight-title">2) 재평가</span>
                                    <p className="text-[0.85rem] text-slate-600 leading-relaxed mb-4">
                                        2026년 8월 수금 마감 기준으로 실적 재평가 후 환수 진행
                                    </p>

                                    <div className="space-y-5 border-t border-slate-100 pt-5">
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm mb-3">● 업적 환수기준</h5>
                                            <div className="winter-table-container mt-0 bg-white">
                                                <table className="winter-table text-[0.75rem]">
                                                    <thead>
                                                        <tr>
                                                            <th>달성률</th>
                                                            <th>환수 금액</th>
                                                            <th>환수 방법</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center">95% 이상</td>
                                                            <td className="winter-highlight text-center">가액 × 15%</td>
                                                            <td rowSpan={3} className="text-center font-medium bg-slate-50/50">수수료에서<br />3개월간<br />균등 환수</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">90% 이상</td>
                                                            <td className="winter-highlight text-center">가액 × 30%</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-center">90% 미만</td>
                                                            <td className="winter-highlight text-center">가액 × 100%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm mb-2">● 영업관리자 환수</h5>
                                            <div className="winter-card bg-orange-50/30 border-orange-100/50 py-3 px-4">
                                                <p className="text-slate-700 text-sm font-medium">
                                                    미달분만큼 여행금액에서 환수
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StepAccordion>

                    </div>
                </main>
            </div>

            <BottomNavigation />
        </>
    );

}
