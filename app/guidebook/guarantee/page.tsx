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

  /* State for promissory note tabs */
  const [promissoryTab, setPromissoryTab] = useState<'eligibility' | 'process' | null>(null);

  /* State for eligibility type (재산세/근로소득자) */
  const [eligibilityType, setEligibilityType] = useState<'property-tax' | 'employee' | null>(null);

  /* State for promissory visit type (동행/단독) */
  const [visitType, setVisitType] = useState<'together' | 'alone' | null>(null);

  /* State for app download modal */
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);

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
      // Reset nested selection states when opening a sub-step
      if (subStepId === 'mortgage-inquiry') setDocInquiryType(null);
      if (subStepId === 'mortgage-setup') setSetupDocType(null);
      if (subStepId === 'promissory-screening') setEligibilityType(null);
      if (subStepId === 'promissory-process') setVisitType(null);
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
                    그외보증
                  </button>
                </div>
              </div>

              {/* Content Based on Selected Tab */}
              {guaranteeType === 'insurance' && (
                <div className="process-detail experienced-process">
                  <div className="step-details">
                    {/* Step 1 - 서울보증보험 동의 */}
                    <StepAccordion
                      title="1. 서울보증보험 동의"
                      isOpen={expandedSteps.has('ins-1')}
                      onToggle={() => toggleStep('ins-1')}
                    >
                      <div className="step-content">
                        <div className="ml-2">
                          <p className="content-text mb-3">
                            • 서울보증보험 앱 설치
                          </p>
                          <p className="content-text mb-3 ml-4">↓</p>
                          <p className="content-text mb-3">
                            • 개인 정보 동의
                          </p>
                          <p className="content-text mb-3 ml-4">↓</p>
                          <p className="content-text mb-3">
                            • 1번[계약체결 이행을 위한 동의]
                          </p>
                        </div>
                        <div className="flex justify-start mt-4">
                          <button
                            onClick={() => setIsAppDownloadModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Download size={20} />
                            <span>앱 설치하기</span>
                          </button>
                        </div>
                      </div>
                    </StepAccordion>

                    {/* Step 2 - 한도조회 */}
                    <StepAccordion
                      title="2. 한도조회"
                      isOpen={expandedSteps.has('ins-2')}
                      onToggle={() => toggleStep('ins-2')}
                    >
                      <div className="step-content">
                        <p className="content-text">
                          • 주임단에 요청
                        </p>
                        <p className="content-text mt-2">
                          • 필요정보: 이름, 주민번호
                        </p>
                      </div>
                    </StepAccordion>

                    {/* Step 3 - 보증보험 청약요청 */}
                    <StepAccordion
                      title="3. 보증보험 청약요청"
                      isOpen={expandedSteps.has('ins-3')}
                      onToggle={() => toggleStep('ins-3')}
                    >
                      <div className="step-content">
                        <p className="content-text">
                          • 주임단에 요청
                        </p>
                      </div>
                    </StepAccordion>

                    {/* Step 4 - 서울보증보험 전자서명 */}
                    <StepAccordion
                      title="4. 서울보증보험 전자서명"
                      isOpen={expandedSteps.has('ins-4')}
                      onToggle={() => toggleStep('ins-4')}
                    >
                      <div className="step-content">
                        <div className="p-1">
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
                      title="1. 근저당"
                      isOpen={expandedSteps.has('col-1')}
                      onToggle={() => toggleStep('col-1')}
                    >
                      <div className="step-content">
                        <p className="content-text mb-4 indent-text" style={{ marginTop: '20px' }}>
                          주임단을 통해 진행합니다.
                        </p>

                        <SubStepAccordion
                          subStepId="mortgage-inquiry"
                          title="1) 한도조회"
                          isOpen={expandedSubSteps.has('mortgage-inquiry')}
                          onToggle={() => toggleSubStep('mortgage-inquiry')}
                        >
                          <div className="step-content">
                            {/* 설명 추가 (제일 위로 이동) */}
                            <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                              <p className="content-text text-sm text-gray-700">
                                필요정보와 필요서류를 주임단 or 부문담당자에게 전달하여 채권실로 요청합니다.
                              </p>
                            </div>

                            {/* 필요정보 */}
                            <div className="mb-2">
                              <button
                                className="w-full text-left font-bold text-sm mb-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSet = new Set(expandedSubSteps);
                                  if (newSet.has('mortgage-inquiry-info')) {
                                    newSet.delete('mortgage-inquiry-info');
                                  } else {
                                    newSet.add('mortgage-inquiry-info');
                                  }
                                  setExpandedSubSteps(newSet);
                                }}
                              >
                                <span>필요정보</span>
                                {expandedSubSteps.has('mortgage-inquiry-info') ?
                                  <ChevronUp size={18} /> : <ChevronDown size={18} />
                                }
                              </button>
                              {expandedSubSteps.has('mortgage-inquiry-info') && (
                                <div className="content-text pl-2">
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
                              )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-2"></div>

                            {/* 필요서류 */}
                            <div className="mb-2">
                              <button
                                className="w-full text-left font-bold text-sm mb-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSet = new Set(expandedSubSteps);
                                  if (newSet.has('mortgage-inquiry-docs')) {
                                    newSet.delete('mortgage-inquiry-docs');
                                  } else {
                                    newSet.add('mortgage-inquiry-docs');
                                  }
                                  setExpandedSubSteps(newSet);
                                }}
                              >
                                <span>필요서류</span>
                                {expandedSubSteps.has('mortgage-inquiry-docs') ?
                                  <ChevronUp size={18} /> : <ChevronDown size={18} />
                                }
                              </button>
                              {expandedSubSteps.has('mortgage-inquiry-docs') && (
                                <div className="pl-2">
                                  <div className="nested-tabs-container">
                                    <div className="nested-tabs">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDocInquiryType('simple');
                                        }}
                                        className={`nested-tab ${docInquiryType === 'simple' ? 'active' : ''}`}
                                      >
                                        간편조회
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDocInquiryType('detailed');
                                        }}
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
                                </div>
                              )}
                            </div>
                          </div>
                        </SubStepAccordion>

                        {/* 2. 근저당 요청 */}
                        <SubStepAccordion
                          subStepId="mortgage-request"
                          title="2) 근저당 요청"
                          isOpen={expandedSubSteps.has('mortgage-request')}
                          onToggle={() => toggleSubStep('mortgage-request')}
                        >
                          <div className="step-content">
                            <p className="content-text">
                              세부 조회용 서류 심사 한도내에서 부문 담당자를 통하여 진행
                            </p>
                          </div>
                        </SubStepAccordion>

                        {/* 3. 근저당 설정 */}
                        <SubStepAccordion
                          subStepId="mortgage-setup"
                          title="3) 근저당 설정"
                          isOpen={expandedSubSteps.has('mortgage-setup')}
                          onToggle={() => toggleSubStep('mortgage-setup')}
                        >
                          <div className="step-content">
                            {/* 필요서류 */}
                            <div className="mb-2">
                              <button
                                className="w-full text-left font-bold text-sm mb-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSet = new Set(expandedSubSteps);
                                  if (newSet.has('mortgage-setup-docs')) {
                                    newSet.delete('mortgage-setup-docs');
                                  } else {
                                    newSet.add('mortgage-setup-docs');
                                  }
                                  setExpandedSubSteps(newSet);
                                }}
                              >
                                <span>필요서류</span>
                                {expandedSubSteps.has('mortgage-setup-docs') ?
                                  <ChevronUp size={18} /> : <ChevronDown size={18} />
                                }
                              </button>
                              {expandedSubSteps.has('mortgage-setup-docs') && (
                                <div className="pl-3">
                                  <div className="nested-tabs-container">
                                    <div className="nested-tabs">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSetupDocType('owner');
                                        }}
                                        className={`nested-tab ${setupDocType === 'owner' ? 'active-orange' : ''}`}
                                      >
                                        근저당설정자<br />(부동산소유자)
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSetupDocType('debtor');
                                        }}
                                        className={`nested-tab ${setupDocType === 'debtor' ? 'active-green' : ''}`}
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
                                </div>
                              )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-2"></div>

                            {/* 근저당설정방법 */}
                            <div className="mb-2">
                              <button
                                className="w-full text-left font-bold text-sm mb-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSet = new Set(expandedSubSteps);
                                  if (newSet.has('mortgage-setup-method')) {
                                    newSet.delete('mortgage-setup-method');
                                  } else {
                                    newSet.add('mortgage-setup-method');
                                  }
                                  setExpandedSubSteps(newSet);
                                }}
                              >
                                <span>근저당설정방법</span>
                                {expandedSubSteps.has('mortgage-setup-method') ?
                                  <ChevronUp size={18} /> : <ChevronDown size={18} />
                                }
                              </button>
                              {expandedSubSteps.has('mortgage-setup-method') && (
                                <div className="content-text pl-3">
                                  <p className="mb-4">
                                    <strong>(1) 서류 준비 후 (설정/변경/말소) 자격을 갖추고 물건지와 가까운 법무사 사무실에서 진행(타 지역의 경우 별도 출장비 발생 가능)</strong>
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
                                    <p className="font-bold mb-2">(2) 모든 서류 원본 등기 발송</p>
                                    <p className="text-sm">
                                      ★ 등기 발송 주소: 서울 중구 세종대로 9길 41, 7층(퍼시픽타워)<br />
                                      <span className="ml-6">굿리치 법무지원팀 채권실</span>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </SubStepAccordion>
                      </div>
                    </StepAccordion>

                    {/* Step 2 - 예금질권 */}
                    <StepAccordion
                      title="2. 예금질권"
                      isOpen={expandedSteps.has('col-2')}
                      onToggle={() => toggleStep('col-2')}
                    >
                      <div className="step-content">
                        <SubStepAccordion
                          subStepId="deposit-step1"
                          title="1) 은행 방문"
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
                          title="2) 준비물"
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
                          title="3) 은행 절차"
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
                          title="4) 확정일자 부여"
                          isOpen={expandedSubSteps.has('deposit-step4')}
                          onToggle={() => toggleSubStep('deposit-step4')}
                        >
                          <div className="content-text">
                            <p className="mb-2">
                              • 질권설정 당일 가까운 공증사무실 또는 등기국 방문하여 확정일자 필수
                            </p>
                          </div>
                        </SubStepAccordion>

                        <SubStepAccordion
                          subStepId="deposit-step5"
                          title="5) 서류 발송"
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
                                서울 중구 세종대로 9길 41, 7층(퍼시픽타워)<br />
                                굿리치 법무지원팀 채권실
                              </p>
                            </div>
                          </div>
                        </SubStepAccordion>
                      </div>
                    </StepAccordion>

                    {/* Step 3 - 공동발행 약속어음 */}
                    <StepAccordion
                      title="3. 공동발행 약속어음"
                      isOpen={expandedSteps.has('col-3')}
                      onToggle={() => toggleStep('col-3')}
                    >
                      <div className="step-content">
                        <div className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                          <p className="text-red-600 font-bold text-sm text-center">
                            ※공동약속어음은 승인 거절 될 수 있으니 유의해 주세요.
                          </p>
                        </div>

                        {/* 1. 보증인 유형 */}
                        <SubStepAccordion
                          subStepId="promissory-eligibility"
                          title="1) 보증인 유형"
                          isOpen={expandedSubSteps.has('promissory-eligibility')}
                          onToggle={() => toggleSubStep('promissory-eligibility')}
                        >
                          <div className="step-content">
                            <ul className="circle-bullet-list mt-2 ml-4">
                              <li className="font-semibold text-gray-700">재산세 5만원 이상 납세자</li>
                              <li className="font-semibold text-gray-700">근로소득자</li>
                            </ul>
                          </div>
                        </SubStepAccordion>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* 2. 보증인 심사 */}
                        <SubStepAccordion
                          subStepId="promissory-screening"
                          title="2) 보증인 심사"
                          isOpen={expandedSubSteps.has('promissory-screening')}
                          onToggle={() => toggleSubStep('promissory-screening')}
                        >
                          <div className="step-content">
                            <div className="nested-tabs-container">
                              <div className="nested-tabs">
                                <button
                                  onClick={() => setEligibilityType('property-tax')}
                                  className={`nested-tab ${eligibilityType === 'property-tax' ? 'active-orange' : ''}`}
                                >
                                  재산세 5만원 이상 납부자
                                </button>
                                <button
                                  onClick={() => setEligibilityType('employee')}
                                  className={`nested-tab ${eligibilityType === 'employee' ? 'active-green' : ''}`}
                                >
                                  근로소득자
                                </button>
                              </div>
                            </div>

                            {eligibilityType === 'property-tax' && (
                              <div className="nested-tab-content">
                                <p className="font-bold text-sm mb-2">자격요건</p>
                                <p className="content-text mb-4">재산세 5만원 이상 납부자</p>

                                <p className="font-bold text-sm mb-2">★ 필요서류</p>
                                <ul className="circle-bullet-list mb-4">
                                  <li>(1) 세목별 과세증명서</li>
                                  <li>(2) 등기사항 전부증명서(말소사항포함, 최신날짜)</li>
                                  <li>(3) 초본(소유자 = 거주자 확인)_재산세 납부자가 실시보는 물건에 거주하지 않고, 전세 계약 등이 설정되어 있는 경우 전세계약서, 임대차계약서 추가 제출</li>
                                  <li>(4) 부채증명원(등기부상 선순위 금액과 실제 피담보 채무액의 차이가 큰 경우)</li>
                                  <li>(5) 토지 또는 토지+건물 심사시 (거래기액 확인 불가능한 경우)<br />
                                    행정사 or 중개사 or 감정평가사의 시세확인서 + 사업자등록증 + 명함 첨부</li>
                                </ul>

                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                                  <p className="text-sm font-bold text-gray-800 mb-1">- 압류, 가압류 등 문제물건지 / 신탁재산은 진행 불가</p>
                                  <p className="text-sm font-bold text-gray-800 mb-1">- 전입세대열람내역서, 무상일대차거주확인서, 공실확인서 등 서류보완요청 있을 수 있음</p>
                                  <p className="text-sm font-bold text-gray-800">- 선순위 근저당 채권최고액 등이 과다하다고 판단될 경우 압부 불가</p>
                                </div>
                              </div>
                            )}

                            {eligibilityType === 'employee' && (
                              <div className="nested-tab-content">
                                <p className="font-bold text-sm mb-2">자격요건</p>
                                <p className="content-text mb-4">
                                  국내 상장사 또는 공기업 3년 이상 재직자(연봉3천만원 이상) / 8급 이상 공무원
                                </p>

                                <p className="font-bold text-sm mb-2">★ 필요서류</p>
                                <ul className="circle-bullet-list mb-4">
                                  <li>(1) 재직증명서</li>
                                  <li>(2) 원천징수영수증</li>
                                </ul>

                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-300 mb-3">
                                  <p className="text-sm font-bold text-gray-800 mb-1">- 순수 급여항목의 70% 한도 인정</p>
                                  <p className="text-sm font-bold text-gray-800 mb-1">- 모든 서류 개인정보사항, 상호, 대표이사, 보증인 성명 등 <span className="text-red-600">전체공개</span>로 발급</p>
                                  <p className="text-sm font-bold text-gray-800">- 정착교육비 1명, 영업관리자 지원금 선지급의 경우 지급금액의 <span className="text-red-600">120%</span> 발행</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </SubStepAccordion>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* 3. 공동발행 약속어음 요청 */}
                        <SubStepAccordion
                          subStepId="promissory-process"
                          title="3) 공동발행 약속어음 요청"
                          isOpen={expandedSubSteps.has('promissory-process')}
                          onToggle={() => toggleSubStep('promissory-process')}
                        >
                          <div className="step-content">
                            {/* (1) 심사 서류 전달 */}
                            <div className="mb-4">
                              <p className="font-bold text-sm mb-2">(1) 심사에 필요한 서류를 부문 담당자에게 전달하여 요청</p>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            {/* (2) 필수 준비사항 */}
                            <div className="mb-4">
                              <p className="font-bold text-sm mb-3">(2) 필수 준비사항</p>

                              <div className="space-y-2">
                                {/* 공동발행인 동행 시 */}
                                <div className="border border-gray-100 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => setVisitType(visitType === 'together' ? null : 'together')}
                                    className={`w-full flex items-center gap-2 p-3 text-sm font-bold transition-colors ${visitType === 'together' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    <span>공동발행인 동행 시</span>
                                    {visitType === 'together' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                  {visitType === 'together' && (
                                    <div className="p-4 bg-white border-t border-gray-100">
                                      <ul className="circle-bullet-list">
                                        <li>① 본사 제공 서류 일체</li>
                                        <li>② 공동발행인 신분증, 인감도장</li>
                                        <li>③ RP 본인 신분증, 막도장</li>
                                        <li className="text-red-600 font-bold">※ 신분증에 도로명 미기재 시 등본 1통 (3개월이내 발급)</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* RP 단독 방문 시 */}
                                <div className="border border-gray-100 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => setVisitType(visitType === 'alone' ? null : 'alone')}
                                    className={`w-full flex items-center gap-2 p-3 text-sm font-bold transition-colors ${visitType === 'alone' ? 'bg-green-50 text-green-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                                  >
                                    <span>RP 단독 방문 시</span>
                                    {visitType === 'alone' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                  {visitType === 'alone' && (
                                    <div className="p-4 bg-white border-t border-gray-100">
                                      <ul className="circle-bullet-list">
                                        <li>① 본사 제공 서류 일체</li>
                                        <li>② 공동발행인 인감도장, 인감증명서 1통 (3개월 이내, 본인 발급용)</li>
                                        <li>③ RP 본인 신분증, 막도장</li>
                                        <li className="text-red-600 font-bold">※ 신분증에 도로명 미기재 시 등본 1통 (3개월이내 발급)</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            {/* (3) 약속어음 발행방법 */}
                            <div className="mb-4">
                              <p className="font-bold text-sm mb-3">(3) 약속어음 발행방법</p>

                              <p className="content-text mb-2">• 필수 준비사항을 지참하여 공증사무실에서 어음 공증 진행</p>

                              <p className="content-text mb-3">• 본사로 서류 발송</p>

                              <div className="bg-gray-50 p-4 rounded-lg ml-4">
                                <p className="font-bold mb-2">발송서류:</p>
                                <ul className="circle-bullet-list mb-4">
                                  <li>① 약속어음 공정증서 정본</li>
                                  <li>② 약속어음공동발행 승락서<br />(공동발행인 직접 작성 후 인감도장 날인) 인감증명 1통(본인발급용)</li>
                                </ul>

                                <p className="font-bold mb-2">본사 주소:</p>
                                <p className="text-sm">
                                  서울 중구 세종대로 9길 41, 7층(퍼시픽타워)<br />
                                  굿리치 법무지원팀 채권실
                                </p>
                              </div>
                            </div>
                          </div>
                        </SubStepAccordion>
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

      {/* App Download Modal */}
      {isAppDownloadModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAppDownloadModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">앱 설치</h3>
              <button
                onClick={() => setIsAppDownloadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              사용하시는 기기에 맞는 스토어를 선택해주세요.
            </p>

            <div className="space-y-3">
              <a
                href="https://play.google.com/store/search?q=%EC%84%9C%EC%9A%B8%EB%B3%B4%EC%A6%9D%EB%B3%B4%ED%97%98&c=apps&hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsAppDownloadModalOpen(false)}
              >
                <Download size={20} />
                <span>Google Play</span>
              </a>

              <a
                href="https://apps.apple.com/kr/app/sgi-m-sgi서울보증/id6443694425"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsAppDownloadModalOpen(false)}
              >
                <Download size={20} />
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      )}
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
