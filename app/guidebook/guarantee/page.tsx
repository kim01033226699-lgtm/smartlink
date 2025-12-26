'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Download } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import './guarantee.css';

export default function GuaranteePage() {
  const router = useRouter();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedSubSteps, setExpandedSubSteps] = useState<Set<string>>(new Set());

  /* State for guarantee type */
  const [guaranteeType, setGuaranteeType] = useState<'insurance' | 'collateral' | null>(null);

  /* State for collateral sub-tabs */
  const [mortgageSubTab, setMortgageSubTab] = useState<'inquiry' | 'setup' | null>(null);

  /* State for document inquiry type */
  const [docInquiryType, setDocInquiryType] = useState<'simple' | 'detailed' | null>(null);

  /* State for mortgage setup document type */
  const [setupDocType, setSetupDocType] = useState<'owner' | 'debtor' | null>(null);

  const toggleStep = (stepId: string) => {
    if (expandedSteps.has(stepId)) {
      setExpandedSteps(new Set());
      setExpandedSubSteps(new Set());
    } else {
      setExpandedSteps(new Set([stepId]));
      setExpandedSubSteps(new Set());
    }
  };

  const toggleSubStep = (subStepId: string) => {
    if (expandedSubSteps.has(subStepId)) {
      setExpandedSubSteps(new Set());
    } else {
      setExpandedSubSteps(new Set([subStepId]));
    }
  };

  return (
    <>
      <div className="guarantee-page">
        {/* Header */}
        <header className="guarantee-header">
          <button onClick={() => router.back()} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center relative">
            <div className="guarantee-logo-wrapper">
              <img
                src="/smartlink/images/GR-img.png"
                alt="GoodRich Logo"
                className="guarantee-logo"
              />
            </div>
            <div className="guarantee-badge">재정보증</div>
          </div>
        </header>

        {/* Content */}
        <main className="guarantee-content">
          <div className="w-full max-w-[700px] mx-auto min-h-screen">
            <div className="content-section">
              {/* Notice Text */}
              <div className="guarantee-notice">
                <p className="notice-text">
                  *영업수수료 보증과 지원금 보증은 별개로 각각 진행됩니다.
                </p>
              </div>

              {/* Guarantee Type Tabs - Top Section */}
              <div className="guarantee-tabs-container">
                <div className="guarantee-tabs">
                  <button
                    onClick={() => setGuaranteeType('insurance')}
                    className={`guarantee-tab ${guaranteeType === 'insurance' ? 'active active-blue' : ''}`}
                  >
                    보증보험
                  </button>
                  <button
                    onClick={() => setGuaranteeType('collateral')}
                    className={`guarantee-tab ${guaranteeType === 'collateral' ? 'active active-orange' : ''}`}
                  >
                    근저당<br />예금질권<br />공동약속어음
                  </button>
                </div>
              </div>

              {/* Content Based on Selected Tab */}
              {guaranteeType === 'insurance' && (
                <div className="process-detail experienced-process">
                  <div className="step-details">
                    {/* Step 1 - 서울보증보험 동의 */}
                    <StepAccordion
                      title="① 서울보증보험 동의"
                      isOpen={expandedSteps.has('ins-1')}
                      onToggle={() => toggleStep('ins-1')}
                    >
                      <div className="step-content">
                        <p className="content-text">
                          모바일 서울보증보험 앱 설치 → 개인정보동의 → 1번 [계약 체결·이행을 위한 동의]
                        </p>
                        <div className="app-download-container">
                          <a href="https://play.google.com/store/search?q=%EC%84%9C%EC%9A%B8%EB%B3%B4%EC%A6%9D%EB%B3%B4%ED%97%98&c=apps&hl=ko" target="_blank" rel="noopener noreferrer" className="app-store-button google">
                            <Download size={20} />
                            <span>Google Play</span>
                          </a>
                          <a href="https://apps.apple.com/kr/app/sgi-m-sgi서울보증/id6443694425" target="_blank" rel="noopener noreferrer" className="app-store-button apple">
                            <Download size={20} />
                            <span>App Store</span>
                          </a>
                        </div>
                      </div>
                    </StepAccordion>

                    {/* Step 2 - 한도조회 */}
                    <StepAccordion
                      title="② 한도조회"
                      isOpen={expandedSteps.has('ins-2')}
                      onToggle={() => toggleStep('ins-2')}
                    >
                      <div className="step-content">
                        <p className="content-text">
                          서울보증보험 → 01.보험계약체결용 필수 동의 후 한도조회 요청
                        </p>
                      </div>
                    </StepAccordion>

                    {/* Step 3 - 링크 수신 후 전자서명 */}
                    <StepAccordion
                      title="③ 링크 수신 후 전자서명"
                      isOpen={expandedSteps.has('ins-3')}
                      onToggle={() => toggleStep('ins-3')}
                    >
                      <div className="step-content">
                        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
                          <p className="content-text font-bold text-orange-800 mb-2">
                            ⚠️ 중요 안내
                          </p>
                          <p className="content-text text-gray-800">
                            서울보증보험사의 문자에 <span className="text-red-600 font-bold">청약 승인일로부터 14일 이내</span>에 전자서명 완료
                          </p>
                          <p className="content-text text-red-600 font-bold mt-2">
                            ※ 미완료시 수수료 및 지원금 지급 불가
                          </p>
                        </div>
                      </div>
                    </StepAccordion>
                  </div>
                </div>
              )}

              {guaranteeType === 'collateral' && (
                <div className="process-detail experienced-process collateral-theme">
                  <div className="step-details">
                    {/* Step 1 - 근저당 */}
                    <StepAccordion
                      title="① 근저당"
                      isOpen={expandedSteps.has('col-1')}
                      onToggle={() => toggleStep('col-1')}
                    >
                      <div className="step-content">
                        {/* Sub-tabs for 근저당 */}
                        <div className="sub-tabs-container">
                          <div className="sub-tabs">
                            <button
                              onClick={() => setMortgageSubTab('inquiry')}
                              className={`sub-tab ${mortgageSubTab === 'inquiry' ? 'active' : ''}`}
                            >
                              근저당 한도 조회
                            </button>
                            <button
                              onClick={() => setMortgageSubTab('setup')}
                              className={`sub-tab ${mortgageSubTab === 'setup' ? 'active' : ''}`}
                            >
                              근저당 설정
                            </button>
                          </div>
                        </div>

                        {/* Content based on sub-tab selection */}
                        {mortgageSubTab === 'inquiry' && (
                          <div className="sub-tab-content">
                            <SubStepAccordion
                              subStepId="mortgage-inquiry-info"
                              title="한도조회필요정보"
                              isOpen={expandedSubSteps.has('mortgage-inquiry-info')}
                              onToggle={() => toggleSubStep('mortgage-inquiry-info')}
                            >
                              <div className="content-text">
                                <ul className="circle-bullet-list">
                                  <li>RP 성명 :</li>
                                  <li>사용인번호 :</li>
                                  <li>위촉(예정)일 :</li>
                                  <li>담보제공자 성명, 주민번호 :</li>
                                  <li>RP 와 담보제공자의 관계 :</li>
                                  <li>담보대상 : (영업수수료 or 지원금 종류등)</li>
                                  <li>보증 종류: 근저당 (소유자거주 or 전월세계약(보증금 기재 필수)</li>
                                  <li>필요금액 :</li>
                                </ul>
                              </div>
                            </SubStepAccordion>

                            <SubStepAccordion
                              subStepId="mortgage-inquiry-docs"
                              title="필요서류"
                              isOpen={expandedSubSteps.has('mortgage-inquiry-docs')}
                              onToggle={() => toggleSubStep('mortgage-inquiry-docs')}
                            >
                              <div className="nested-tabs-container">
                                <div className="nested-tabs">
                                  <button
                                    onClick={() => setDocInquiryType('simple')}
                                    className={`nested-tab ${docInquiryType === 'simple' ? 'active' : ''}`}
                                  >
                                    간편조회
                                  </button>
                                  <button
                                    onClick={() => setDocInquiryType('detailed')}
                                    className={`nested-tab ${docInquiryType === 'detailed' ? 'active' : ''}`}
                                  >
                                    세부조회
                                  </button>
                                </div>
                              </div>

                              {docInquiryType === 'simple' && (
                                <div className="nested-tab-content">
                                  <p className="content-text mb-2">
                                    <strong>용도:</strong> 대략적인 담보 가능 범위 확인
                                  </p>
                                  <ul className="circle-bullet-list">
                                    <li>등기부 등본</li>
                                  </ul>
                                </div>
                              )}

                              {docInquiryType === 'detailed' && (
                                <div className="nested-tab-content">
                                  <p className="content-text mb-2">
                                    <strong>용도:</strong> 실제 설정 가능 한도 산정
                                  </p>
                                  <ul className="circle-bullet-list">
                                    <li>등기부등본</li>
                                    <li>세목별과세증명</li>
                                    <li>담보제공자 초본</li>
                                    <li>부채증명원(부채가 있는 경우)</li>
                                  </ul>
                                </div>
                              )}
                            </SubStepAccordion>
                          </div>
                        )}

                        {mortgageSubTab === 'setup' && (
                          <div className="sub-tab-content">
                            <SubStepAccordion
                              subStepId="mortgage-setup-docs"
                              title="필요서류"
                              isOpen={expandedSubSteps.has('mortgage-setup-docs')}
                              onToggle={() => toggleSubStep('mortgage-setup-docs')}
                            >
                              <div className="nested-tabs-container">
                                <div className="nested-tabs">
                                  <button
                                    onClick={() => setSetupDocType('owner')}
                                    className={`nested-tab ${setupDocType === 'owner' ? 'active' : ''}`}
                                  >
                                    근저당설정자<br />(부동산소유자)
                                  </button>
                                  <button
                                    onClick={() => setSetupDocType('debtor')}
                                    className={`nested-tab ${setupDocType === 'debtor' ? 'active' : ''}`}
                                  >
                                    채무자<br />(RP본인)
                                  </button>
                                </div>
                              </div>

                              {setupDocType === 'owner' && (
                                <div className="nested-tab-content">
                                  <ul className="circle-bullet-list">
                                    <li>등기권리증</li>
                                    <li>소유자 인감증명서 (3개월이내, 본인발급용) 1통<br />소유자가 제 3자인 경우 2통</li>
                                    <li>소유자 인감도장</li>
                                    <li>초본(3개월이내, 과거변동내역 포함)</li>
                                    <li>등기사항전부증명서</li>
                                    <li>당사 제공 서류 일체</li>
                                  </ul>
                                </div>
                              )}

                              {setupDocType === 'debtor' && (
                                <div className="nested-tab-content">
                                  <ul className="circle-bullet-list">
                                    <li>등본(3개월 이내)</li>
                                    <li>막도장</li>
                                  </ul>
                                </div>
                              )}
                            </SubStepAccordion>

                            <SubStepAccordion
                              subStepId="mortgage-setup-method"
                              title="근저당설정방법"
                              isOpen={expandedSubSteps.has('mortgage-setup-method')}
                              onToggle={() => toggleSubStep('mortgage-setup-method')}
                            >
                              <div className="content-text">
                                <p className="mb-4">
                                  <strong>1. 서류 준비 후 (설정/변경/말소) 자격을 갖추고 물건지와 가까운 법무사 사무실에서 진행</strong>
                                </p>

                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <p className="font-bold mb-2">채권자 겸 근저당권리자 = 등기권리자</p>
                                  <p className="text-sm">굿리치 주식회사(GoodRich Co., Ltd.) (110111-3403451)</p>
                                  <p className="text-sm">주소: 서울특별시 중구 세종대로 9길 41,(서소문동)</p>
                                  <p className="text-sm">대표이사 : 한승표</p>
                                </div>

                                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                                  <p className="font-bold mb-2">채권최고액: 금 ___________ 원</p>
                                  <p className="text-sm text-gray-700 mt-2">
                                    접수 완료 시 등기접수증 수령 후 RP 성명 및 채권최고액을 기재하여<br />
                                    등기 발송 전 <span className="text-red-600 font-bold">팩스(0303-3441-9000)</span>로 먼저 보내 주세요.
                                  </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="font-bold mb-2">⇒ 모든 서류 원본 등기 발송</p>
                                  <p className="text-sm">
                                    ★ 등기 발송 주소: 서울 중구 세종대로 9길 41, 7층(파시픽타워)<br />
                                    <span className="ml-6">굿리치 법무지원팀 채권실</span>
                                  </p>
                                </div>
                              </div>
                            </SubStepAccordion>
                          </div>
                        )}
                      </div>
                    </StepAccordion>

                    {/* Step 2 - 예금질권 */}
                    <StepAccordion
                      title="② 예금질권"
                      isOpen={expandedSteps.has('col-2')}
                      onToggle={() => toggleStep('col-2')}
                    >
                      <div className="step-content">
                        <SubStepAccordion
                          subStepId="deposit-step1"
                          title="1. 은행 방문"
                          isOpen={expandedSubSteps.has('deposit-step1')}
                          onToggle={() => toggleSubStep('deposit-step1')}
                        >
                          <div className="content-text">
                            <ul className="circle-bullet-list">
                              <li>당사에서 받은 서류 지참</li>
                              <li>예금주와 회사대리인 (RP 또는 영업관리자)</li>
                            </ul>
                          </div>
                        </SubStepAccordion>

                        <SubStepAccordion
                          subStepId="deposit-step2"
                          title="2. 준비물"
                          isOpen={expandedSubSteps.has('deposit-step2')}
                          onToggle={() => toggleSubStep('deposit-step2')}
                        >
                          <div className="content-text">
                            <ul className="circle-bullet-list">
                              <li>은행 방문자 각 각 신분증</li>
                              <li>질권 설정할 예금</li>
                            </ul>
                          </div>
                        </SubStepAccordion>

                        <SubStepAccordion
                          subStepId="deposit-step3"
                          title="3. 은행 절차"
                          isOpen={expandedSubSteps.has('deposit-step3')}
                          onToggle={() => toggleSubStep('deposit-step3')}
                        >
                          <div className="content-text">
                            <ul className="circle-bullet-list">
                              <li>예금통장 개설</li>
                              <li>예금 개설 후 질권 설정 진행</li>
                            </ul>
                          </div>
                        </SubStepAccordion>

                        <SubStepAccordion
                          subStepId="deposit-step4"
                          title="4. 확정일자 부여"
                          isOpen={expandedSubSteps.has('deposit-step4')}
                          onToggle={() => toggleSubStep('deposit-step4')}
                        >
                          <div className="content-text">
                            <p className="mb-2">
                              질권설정 당일 가까운 공증사무실 또는 등기국 방문하여 확정일자 필수
                            </p>
                          </div>
                        </SubStepAccordion>

                        <SubStepAccordion
                          subStepId="deposit-step5"
                          title="5. 서류 발송"
                          isOpen={expandedSubSteps.has('deposit-step5')}
                          onToggle={() => toggleSubStep('deposit-step5')}
                        >
                          <div className="content-text">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-bold mb-3">원본 서류:</p>
                              <p className="text-sm mb-2">
                                - 당사에서 받은 서류 일체, 확정일자 받은 질권설정승낙서, 통장,<br />
                                국세완납증명서(홈택스 발급 가능), 지방세 납세확인서(정부24 발급 가능)
                              </p>
                              <p className="font-bold mt-4 mb-2">등기 발송 주소:</p>
                              <p className="text-sm">
                                서울 중구 세종대로 9길 41, 7층(파시픽타워)<br />
                                굿리치 법무지원팀 채권실
                              </p>
                            </div>
                          </div>
                        </SubStepAccordion>
                      </div>
                    </StepAccordion>

                    {/* Step 3 - 공동약속어음/승인제한 */}
                    <StepAccordion
                      title="③ 공동약속어음/승인제한"
                      isOpen={expandedSteps.has('col-3')}
                      onToggle={() => toggleStep('col-3')}
                    >
                      <div className="step-content">
                      </div>
                    </StepAccordion>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </>
  );
}

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
    <div className={`step-accordion ${isOpen ? 'active' : ''}`}>
      <button className="step-accordion-header" onClick={onToggle}>
        <div className="step-accordion-title-wrapper">
          <div className="step-accordion-title">
            {title}
            <div className="step-accordion-icon">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
      </button>
      {isOpen && <div className="step-accordion-content">{children}</div>}
    </div>
  );
}

// Sub Step Accordion Component
function SubStepAccordion({
  subStepId,
  title,
  isOpen,
  onToggle,
  children
}: {
  subStepId: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`sub-step-accordion ${isOpen ? 'active' : ''}`}>
      <button className="sub-step-header" onClick={onToggle}>
        <h4 className="sub-step-title">
          {title}
          <div className="sub-step-icon">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </h4>
      </button>
      {isOpen && <div className="sub-step-content">{children}</div>}
    </div>
  );
}
