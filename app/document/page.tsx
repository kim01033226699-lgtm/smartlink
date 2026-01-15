'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, FileText, Download, CheckCircle2 } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import { BASE_PATH } from '@/lib/utils';
import './documents.css';

export default function DocumentGuidePage() {
    const router = useRouter();
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['doc-1'])); // Default open first step

    const toggleStep = (stepId: string) => {
        setExpandedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stepId)) {
                newSet.delete(stepId);
            } else {
                newSet.add(stepId);
            }
            return newSet;
        });
    };

    return (
        <>
            <div className="documents-page">
                {/* Header */}
                <header className="documents-header">
                    <button onClick={() => router.back()} className="back-button">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="header-content">
                        <img src={`${BASE_PATH}/images/GR-img.png`} alt="GoodRich" className="documents-logo" />
                        <div className="documents-badge">문서양식 가이드</div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="documents-content">
                    <div className="w-full max-w-[700px] mx-auto">
                        <div className="content-section">
                            {/* Notice */}
                            <div className="documents-notice">
                                <p className="notice-text">
                                    *모든 문서는 최신 본을 사용해 주세요.<br />
                                    *작성 방법이나 제출처가 궁금하시면 아래 항목을 클릭해 확인해 보세요.
                                </p>
                            </div>

                            {/* Accordions */}
                            <div className="space-y-4">
                                <StepAccordion
                                    id="doc-1"
                                    title="1. 위해촉 (위촉 및 해촉)"
                                    isOpen={expandedSteps.has('doc-1')}
                                    onToggle={() => toggleStep('doc-1')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="선위촉신청서:"
                                            desc=""
                                        />
                                        <DocItem
                                            name="위촉불가특인:"
                                            desc=""
                                        />
                                        <DocItem
                                            name="재위촉요청서:"
                                            desc=""
                                        />
                                        <DocItem
                                            name="해촉신청서:"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-2"
                                    title="2. 수수료계좌"
                                    isOpen={expandedSteps.has('doc-2')}
                                    onToggle={() => toggleStep('doc-2')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="변경신청서:"
                                            desc="본인계좌사본 제출"
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-3"
                                    title="3. 지원금"
                                    isOpen={expandedSteps.has('doc-3')}
                                    onToggle={() => toggleStep('doc-3')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="정착교육비:"
                                            desc=""
                                        />
                                        <DocItem
                                            name="M-Project신청서&별첨문서"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-4"
                                    title="4. 금융캠퍼스"
                                    isOpen={expandedSteps.has('doc-4')}
                                    onToggle={() => toggleStep('doc-4')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="금융캠퍼스 신청서"
                                            desc=""
                                        />
                                        <DocItem
                                            name="베이직 신청서"
                                            desc=""
                                        />
                                        <DocItem
                                            name="금융캠퍼스 지원안(DB 지급형)"
                                            desc=""
                                        />
                                        <DocItem
                                            name="금융캠퍼스 지원안(DB 미지급형)"
                                            desc=""
                                        />
                                        <DocItem
                                            name="베이직 지원안"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-5"
                                    title="5. DB 신청"
                                    isOpen={expandedSteps.has('doc-5')}
                                    onToggle={() => toggleStep('doc-5')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="기계약 DB 신청서"
                                            desc=""
                                        />
                                        <DocItem
                                            name="미과금 DB 신청서"
                                            desc=""
                                        />
                                        <DocItem
                                            name="미과금 DB 제외 신청서"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-6"
                                    title="6. 영업관리자"
                                    isOpen={expandedSteps.has('doc-6')}
                                    onToggle={() => toggleStep('doc-6')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="*관리자 위임"
                                            desc=""
                                        />
                                        <DocItem
                                            name="*관리자 평가"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-7"
                                    title="7. 저업적평가"
                                    isOpen={expandedSteps.has('doc-7')}
                                    onToggle={() => toggleStep('doc-7')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="사업계획서"
                                            desc=""
                                        />
                                        <DocItem
                                            name="유예,해촉 공문"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>

                                <StepAccordion
                                    id="doc-8"
                                    title="8. 공문양식(기본)"
                                    isOpen={expandedSteps.has('doc-8')}
                                    onToggle={() => toggleStep('doc-8')}
                                >
                                    <div className="space-y-1">
                                        <DocItem
                                            name="기본공문양식"
                                            desc=""
                                        />
                                    </div>
                                </StepAccordion>
                            </div>

                            {/* Action Button */}
                            <div className="drive-link-box">
                                <a
                                    href="https://drive.google.com/drive/folders/1RwthlbiB-KXizdVB-RMtwM80cAUPO0aq?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="drive-button"
                                >
                                    <FileText size={20} />
                                    <span>구글 드라이브 문서함 바로가기</span>
                                    <ExternalLink size={16} />
                                </a>
                                <p className="mt-4 text-xs text-gray-400">
                                    클릭 시 구글 드라이브 문서 저장소로 이동하여<br />
                                    직접 파일을 다운로드 할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <BottomNavigation />
        </>
    );
}

interface StepAccordionProps {
    id: string;
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function StepAccordion({ title, isOpen, onToggle, children }: StepAccordionProps) {
    return (
        <div className={`step-accordion ${isOpen ? 'is-open' : ''}`}>
            <button className="accordion-header" onClick={onToggle}>
                <span className="accordion-title">{title}</span>
                <div className="accordion-icon">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>
            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
}

function DocItem({ name, desc }: { name: string; desc: string }) {
    return (
        <div className="doc-item">
            <div className="flex items-start gap-2">
                <div className="mt-1">
                    <CheckCircle2 size={16} className="text-orange-500" />
                </div>
                <div>
                    <span className="doc-name">{name}</span>
                    <p className="doc-desc" dangerouslySetInnerHTML={{ __html: desc }} />
                </div>
            </div>
        </div>
    );
}
