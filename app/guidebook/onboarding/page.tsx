'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, UserCheck, UserPlus, X, Download, ChevronRight } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import ApplicationPreview from "@/app/info-appoint/components/application-flow/application-preview";
import QuestionFlow from '@/app/info-appoint/components/application-flow/question-flow';
import PersonalInfoForm from "@/app/info-appoint/components/application-flow/personal-info-form";
import { Button } from "@/app/components/ui/button";
import './onboarding.css';

interface PersonalInfo {
  company: string;
  companyAddress: string;
  residentNumber: string;
  name: string;
  address: string;
  phone: string;
  submissionDate: string;
  recipients: string[];
}

type ExpandedType = 'experienced' | 'inexperienced' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedSubSteps, setExpandedSubSteps] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'question' | 'sample' | 'personal-info' | 'preview' | 'completed'>('question');
  const [activeTab, setActiveTab] = useState<'onboarding' | 'termination'>('onboarding');
  const [expandedProcess, setExpandedProcess] = useState<ExpandedType>(null);

  // Flow State
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  /* State for Step 1 mode */
  const [cancellationMode, setCancellationMode] = useState<'certified' | 'application' | null>(null);
  const [isSendExpanded, setIsSendExpanded] = useState(false);
  const [isCancelExpanded, setIsCancelExpanded] = useState(false);

  const openModal = (view: 'question' | 'sample' | 'personal-info') => {
    setModalView(view);
    setIsModalOpen(true);

    // If opening form directly, set default results required for form logic
    if (view === 'personal-info') {
      setSelectedResults(['생명보험협회', '손해보험협회', '현재 재직회사']);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalView('question'); // Reset view on close
    // Reset flow state
    setSelectedResults([]);
    setPersonalInfo(null);
  };

  const handleQuestionsComplete = (results: string[]) => {
    setSelectedResults(results);
    setModalView('sample');
  };

  const handlePersonalInfoComplete = (info: PersonalInfo) => {
    setPersonalInfo(info);
    setModalView('preview');
  };

  const toggleProcess = (process: ExpandedType) => {
    setExpandedProcess(expandedProcess === process ? null : process);
    setExpandedSteps(new Set());
    setExpandedSubSteps(new Set());
  };

  const toggleStep = (stepId: string) => {
    if (expandedSteps.has(stepId)) {
      // 이미 열려있으면 닫기
      setExpandedSteps(new Set());
      setExpandedSubSteps(new Set());
    } else {
      // 다른 단계는 모두 닫고 현재 단계만 열기
      setExpandedSteps(new Set([stepId]));
      setExpandedSubSteps(new Set());
    }
  };

  const toggleSubStep = (subStepId: string) => {
    if (expandedSubSteps.has(subStepId)) {
      // 이미 열려있으면 닫기
      setExpandedSubSteps(new Set());
    } else {
      // 다른 서브스텝은 모두 닫고 현재 서브스텝만 열기
      setExpandedSubSteps(new Set([subStepId]));
    }
  };

  const handleBackButton = () => {
    if (expandedProcess !== null) {
      // If viewing process details, go back to menu selection
      setExpandedProcess(null);
      setExpandedSteps(new Set());
      setExpandedSubSteps(new Set());
    } else {
      // If on menu selection, go back to previous page
      router.back();
    }
  };

  return (
    <>
      <div className="onboarding-page">
        {/* Header */}
        <header className="onboarding-header">
          <button onClick={handleBackButton} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center relative">
            <div className="onboarding-logo-wrapper">
              <img
                src="/smartlink/images/GR-img.png"
                alt="GoodRich Logo"
                className="onboarding-logo"
              /></div>
            <div className="onboarding-badge">위촉절차안내</div>
          </div>
        </header>

        {/* Content */}
        <main className="onboarding-content">
          <div className="w-full max-w-[700px] mx-auto min-h-screen">
            {activeTab === 'onboarding' && (
              <div className="content-section">
                {/* Menu Selection - Only show when no process is selected */}
                {expandedProcess === null && (
                  <div className="onboarding-menu-grid">
                    <div className="category-box" onClick={() => toggleProcess('experienced')}>
                      <h3 className="category-title">경력자 위촉</h3>
                    </div>
                    <div className="category-box" onClick={() => toggleProcess('inexperienced')}>
                      <h3 className="category-title">무경력자 위촉</h3>
                    </div>
                  </div>
                )}

                {/* Experienced Process Detail */}
                {expandedProcess === 'experienced' && (
                  <div className="process-detail experienced-process">
                    <div className="detail-header">
                      <h3 className="detail-title">경력자 위촉 프로세스</h3>
                    </div>

                    {/* Detailed Steps */}
                    <div className="step-details">
                      {/* Step 1 - 협회 말소하기 (moved from 4) */}
                      <StepAccordion
                        stepNumber="1"
                        title="협회 말소하기"
                        isOpen={expandedSteps.has('exp-1')}
                        onToggle={() => toggleStep('exp-1')}
                      >
                        <div className="step-content">
                          {/* Main Choice Buttons */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => setCancellationMode('certified')}
                              className={`p-4 rounded-xl border-2 transition-all ${cancellationMode === 'certified'
                                ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold'
                                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                                }`}
                            >
                              내용증명으로<br />협회말소
                            </button>
                            <button
                              onClick={() => setCancellationMode('application')}
                              className={`p-4 rounded-xl border-2 transition-all ${cancellationMode === 'application'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                            >
                              해촉신청서로<br />협회말소
                            </button>
                          </div>

                          {/* Certified Mail Mode Content */}
                          {cancellationMode === 'certified' && (
                            <div className="fade-in bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-4">
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                <span className="w-1 h-4 bg-orange-500 rounded-full mr-2"></span>
                                내용증명 보내기
                              </h4>

                              <div className="space-y-3">
                                <button
                                  onClick={() => openModal('personal-info')}
                                  className="w-full p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors group"
                                >
                                  <span className="font-medium text-gray-700">1. 내용증명 작성하기</span>
                                  <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </button>

                                <div className="space-y-2">
                                  <button
                                    onClick={() => setIsSendExpanded(!isSendExpanded)}
                                    className="w-full text-left p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
                                  >
                                    <span className="font-medium text-gray-700">2. 내용증명 발송하기</span>
                                    {isSendExpanded ? <ChevronRight size={16} className="rotate-90 text-gray-500 transition-transform" /> : <ChevronRight size={16} className="text-gray-500 transition-transform" />}
                                  </button>

                                  {isSendExpanded && (
                                    <div className="pl-2 pr-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 mb-2 text-sm text-gray-700 shadow-sm">
                                        <p><strong>발송처</strong> : 현재 재직회사, 생명보험협회, 손해보험협회,우체국,본인보관용으로 총 5부를 출력(생보 or 손보 코드가 하나만 있는 경우에는 해당협회에만 내용증명 제출(총 4부만 출력)</p>
                                      </div>
                                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 text-sm text-gray-700 shadow-sm">
                                        <p><strong>발송방법</strong> : 출력한 내용증명에 자필서명 또는 날인 후 우체국에 내용증명으로 발송</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <button
                                    onClick={() => setIsCancelExpanded(!isCancelExpanded)}
                                    className="w-full text-left p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col hover:bg-gray-100 transition-colors relative"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-medium text-gray-700">3. 협회말소하기</span>
                                      {isCancelExpanded ? <ChevronRight size={16} className="rotate-90 text-gray-500 transition-transform" /> : <ChevronRight size={16} className="text-gray-500 transition-transform" />}
                                    </div>
                                    <p className="text-xs text-orange-600 mt-1">
                                      내용증명 발송 후 발송일 포함 11일째 되는 날부터 말소 가능
                                    </p>
                                  </button>

                                  {isCancelExpanded && (
                                    <div className="grid grid-cols-2 gap-2 pl-2 pr-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                                      <a
                                        href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-bold hover:bg-blue-100 text-center transition-colors"
                                      >
                                        손보협회<br />온라인 말소
                                      </a>
                                      <a
                                        href="https://fp.insure.or.kr/process/process01"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-bold hover:bg-blue-100 text-center transition-colors"
                                      >
                                        생보협회<br />온라인 말소
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-100 hidden">
                                {/* Moved to header */}
                              </div>
                            </div>
                          )}

                          {/* Application Mode Content */}
                          {cancellationMode === 'application' && (
                            <div className="fade-in bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-4">
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                                해촉신청서로 협회말소
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <a
                                  href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-bold hover:bg-blue-100 text-center transition-colors"
                                >
                                  손보협회<br />온라인 말소
                                </a>
                                <a
                                  href="https://fp.insure.or.kr/process/process01"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 font-bold hover:bg-blue-100 text-center transition-colors"
                                >
                                  생보협회<br />온라인 말소
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </StepAccordion>

                      {/* Step 2 - 서울보증보험 동의 (moved from 3) */}
                      <StepAccordion
                        stepNumber="2"
                        title="서울보증보험 동의"
                        isOpen={expandedSteps.has('exp-3')}
                        onToggle={() => toggleStep('exp-3')}
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

                      {/* Step 3 - 보험연수원 등록교육 수료 (moved from 4) */}
                      <StepAccordion
                        stepNumber="3"
                        title="보험연수원 등록교육 수료"
                        isOpen={expandedSteps.has('exp-4')}
                        onToggle={() => toggleStep('exp-4')}
                      >
                        <div className="step-content">
                          <SubStepAccordion
                            subStepId="exp-4-1"
                            title="4-1. 경력 확인"
                            isOpen={expandedSubSteps.has('exp-4-1')}
                            onToggle={() => toggleSubStep('exp-4-1')}
                          >
                            <p className="content-text">
                              협회등록일 기준 직전 <strong className="highlight-red">3년</strong> 이내<br />
                              <strong className="highlight-red">1년</strong> 이상 경력 인정
                            </p>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="exp-4-2"
                            title="4-2 수강신청하기"
                            isOpen={expandedSubSteps.has('exp-4-2')}
                            onToggle={() => toggleSubStep('exp-4-2')}
                          >
                            <p className="content-text">
                              ▶ 보험연수원 로그인 → 모집종사자 교육 → 보험설계사 → 경력자등록교육 → 수강신청
                            </p>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="exp-4-3"
                            title="4-3. 수강과목 선택 방법"
                            isOpen={expandedSubSteps.has('exp-4-3')}
                            onToggle={() => toggleSubStep('exp-4-3')}
                          >
                            <div className="course-option">
                              <p className="course-title text-blue-600">▶ 생보, 손보 : 둘다 경력 (총 30H)</p>
                              <p className="course-detail">(경력자교육) 생명 + 손해 + 제3보험 (30H)</p>
                            </div>
                            <div className="course-option">
                              <p className="course-title text-orange-500">▶ 생보 경력, 손보 신입 (총 45H)</p>
                              <p className="course-detail">(경력자교육) 생명 + 제3보험 (25H)</p>
                              <p className="course-detail">(신규등록교육) 손보 (20H)</p>
                            </div>
                            <div className="course-option">
                              <p className="course-title text-orange-500">▶ 생보 신입, 손보 경력 (총 45H)</p>
                              <p className="course-detail">(경력자교육) 손보 + 제3보험 (25H)</p>
                              <p className="course-detail">(신규등록교육) 생보 (20H)</p>
                            </div>

                            <div className="step-button-box">
                              <a
                                href="https://is.in.or.kr/main/sukang/reg/compTrainning.do?lecture_type=1&search_gubun_code=01&search_high_code=05&search_mid_code=01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="step-action-link"
                              >
                                <span>수강신청</span>
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="exp-4-4"
                            title="4-4 수료증 출력"
                            isOpen={expandedSubSteps.has('exp-4-4')}
                            onToggle={() => toggleSubStep('exp-4-4')}
                          >
                            <p className="content-text">
                              ▶ 나의강의실 → 수료증 출력하기 → 발급사유[협회제출용] 기재 → PDF 저장
                            </p>
                          </SubStepAccordion>
                        </div>
                      </StepAccordion>

                      {/* Step 4 - 굿리치 위촉방법 */}
                      <StepAccordion
                        stepNumber="4"
                        title="굿리치 위촉방법"
                        isOpen={expandedSteps.has('exp-5')}
                        onToggle={() => toggleStep('exp-5')}
                      >
                        <div className="step-content">
                          <p className="content-text font-bold text-lg mb-2">(1) 기본정보 전달</p>
                          <p className="content-text mb-6">
                            기본정보 : 성명, 주민번호, 자택주소, 휴대폰번호, 이메일 주소
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(2) 위촉서류</p>
                          <p className="content-text mb-6">
                            신분증 사본, 통장사본, 수료증, 등본(제출용) <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span> 경력증명서(교보생명위촉용), 이클린조회
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(3) 전자서명</p>
                          <h4 className="font-bold text-gray-800 mb-2">* 위촉서류 전자서명하기</h4>
                          <p className="content-text mb-2">
                            ① <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text mb-3">
                            ② <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text highlight-red font-bold mb-6">
                            ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(4) 서류업로드 & E-Clean정보 조회하기</p>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="bg-orange-500 text-white px-3 py-1.5 rounded-md inline-block text-sm font-bold shadow-sm">
                              [조회] 버튼 클릭 → 이클린 보험 서비스의 모바일 인증절차 진행
                            </div>
                          </div>

                          <div className="border-2 border-blue-400 p-4 rounded-lg bg-white shadow-sm">
                            <p className="text-blue-600 font-bold mb-2 text-sm md:text-base">
                              ♥ 조회 버튼 클릭후 모래시계가 계속 돌고 있다면? 이클린 연결 오류상태!!
                            </p>
                            <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                              → <span className="text-red-600">[E클린보험서비스]</span> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장님께 회신!!!
                            </p>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 5 - 원수사 위촉안내 */}
                      <StepAccordion
                        stepNumber="5"
                        title="원수사 위촉안내"
                        isOpen={expandedSteps.has('exp-7')}
                        onToggle={() => toggleStep('exp-7')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-3">
                            <strong>모바일 보험사 위촉신청</strong><br />
                            : 2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크들어가서 동의 완료해주세요.
                          </p>
                          <p className="content-text">
                            <strong>서면 보험사 위촉신청서 서명</strong><br />
                            : <span className="highlight-red">위촉서류 원본 발송시 함께 보내주세요.</span>
                          </p>
                        </div>
                      </StepAccordion>

                      {/* 위촉일 조회 링크 */}
                      <div className="link-box">
                        <a
                          href="https://kim01033226699-lgtm.github.io/appoint_info/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          <span>위촉일 조회</span>
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inexperienced Process Detail */}
                {expandedProcess === 'inexperienced' && (
                  <div className="process-detail inexperienced-process">
                    <div className="detail-header">
                      <h3 className="detail-title">무경력자 위촉 프로세스</h3>
                    </div>

                    {/* Detailed Steps */}
                    <div className="step-details">
                      {/* Step 1 - 모집인 시험 접수 */}
                      <StepAccordion
                        stepNumber="1"
                        title="모집인 시험 접수"
                        isOpen={expandedSteps.has('inexp-1')}
                        onToggle={() => toggleStep('inexp-1')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-4 text-blue-600 font-bold">
                            기본정보 : 성명, 주민번호, 휴대폰번호(본인명의), 이메일주소, <span className="text-red-500">응시지역</span>
                          </p>

                          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4 text-left">
                            <span className="font-bold text-lg text-gray-800 flex items-center justify-start gap-2">
                              <span className="text-red-500">≫</span> 응시지역 확인
                            </span>
                          </div>

                          <div className="text-red-500 font-bold">
                            <p className="mb-1 text-lg">생명보험 시험응시 경우</p>
                            <p className="pl-4">{"->"} 메트라이프생명 url 접속 응시 필수</p>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 2 */}
                      <StepAccordion
                        stepNumber="2"
                        title="서울보증보험 동의"
                        isOpen={expandedSteps.has('inexp-2')}
                        onToggle={() => toggleStep('inexp-2')}
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

                      {/* Step 3 */}
                      <StepAccordion
                        stepNumber="3"
                        title="보험연수원 등록교육 수료"
                        isOpen={expandedSteps.has('inexp-3')}
                        onToggle={() => toggleStep('inexp-3')}
                      >
                        <div className="step-content">
                          <SubStepAccordion
                            subStepId="inexp-3-1"
                            title="3-1. 수강신청하기"
                            isOpen={expandedSubSteps.has('inexp-3-1')}
                            onToggle={() => toggleSubStep('inexp-3-1')}
                          >
                            <p className="content-text">
                              보험연수원 (<a href="https://is.in.or.kr" target="_blank" rel="noopener noreferrer" className="link-text">https://is.in.or.kr</a>)<br />
                              모집종사자교육 → 신규등록교육 → (신규) 생명+손해+제3보험 (40H)
                            </p>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="inexp-3-2"
                            title="3-2. 수강과목 선택"
                            isOpen={expandedSubSteps.has('inexp-3-2')}
                            onToggle={() => toggleSubStep('inexp-3-2')}
                          >
                            <p className="content-text">
                              신규등록교육 전체 과정 (40H) 수강
                            </p>

                            <div className="step-button-box">
                              <a
                                href="https://is.in.or.kr/main/sukang/reg/compTrainning.do?lecture_type=1&search_gubun_code=01&search_high_code=04&search_mid_code=01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="step-action-link"
                              >
                                <span>수강신청</span>
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="inexp-3-3"
                            title="3-3. 수료증 발급방법"
                            isOpen={expandedSubSteps.has('inexp-3-3')}
                            onToggle={() => toggleSubStep('inexp-3-3')}
                          >
                            <p className="content-text">
                              나의강의실 → 수료증 출력하기 → 발급사유[협회제출용] 기재 → PDF저장
                            </p>
                          </SubStepAccordion>
                        </div>
                      </StepAccordion>

                      {/* Step 4 - 굿리치 위촉방법 */}
                      <StepAccordion
                        stepNumber="4"
                        title="굿리치 위촉방법"
                        isOpen={expandedSteps.has('inexp-4')}
                        onToggle={() => toggleStep('inexp-4')}
                      >
                        <div className="step-content">
                          <p className="content-text font-bold text-lg mb-2">(1) 기본정보 전달</p>
                          <p className="content-text mb-6">
                            기본정보 : 성명, 주민번호, 자택주소, 휴대폰번호, 이메일 주소
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(2) 위촉서류</p>
                          <p className="content-text mb-6">
                            신분증 사본, 통장사본, 수료증, 등본(제출용) <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span> 경력증명서(교보생명위촉용), 이클린조회
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(3) 전자서명</p>
                          <h4 className="font-bold text-gray-800 mb-2">* 위촉서류 전자서명하기</h4>
                          <p className="content-text mb-2">
                            ① <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text mb-3">
                            ② <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text highlight-red font-bold mb-6">
                            ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                          </p>

                          <p className="content-text font-bold text-lg mb-2">(4) 서류업로드 & E-Clean정보 조회하기</p>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="bg-orange-500 text-white px-3 py-1.5 rounded-md inline-block text-sm font-bold shadow-sm">
                              [조회] 버튼 클릭 → 이클린 보험 서비스의 모바일 인증절차 진행
                            </div>
                          </div>

                          <div className="border-2 border-blue-400 p-4 rounded-lg bg-white shadow-sm">
                            <p className="text-blue-600 font-bold mb-2 text-sm md:text-base">
                              ♥ 조회 버튼 클릭후 모래시계가 계속 돌고 있다면? 이클린 연결 오류상태!!
                            </p>
                            <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                              → <span className="text-red-600">[E클린보험서비스]</span> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장님께 회신!!!
                            </p>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 5 - 원수사 위촉안내 */}
                      <StepAccordion
                        stepNumber="5"
                        title="원수사 위촉안내"
                        isOpen={expandedSteps.has('inexp-5')}
                        onToggle={() => toggleStep('inexp-5')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-3">
                            <strong>모바일 보험사 위촉신청</strong><br />
                            : 2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크들어가서 동의 완료해주세요.
                          </p>
                          <p className="content-text">
                            <strong>서면 보험사 위촉신청서 서명</strong><br />
                            : <span className="highlight-red">위촉서류 원본 발송시 함께 보내주세요.</span>
                          </p>
                        </div>
                      </StepAccordion>

                      {/* 위촉일 조회 링크 */}
                      <div className="link-box">
                        <a
                          href="https://kim01033226699-lgtm.github.io/appoint_info/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          <span>위촉일 조회</span>
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div >
            )
            }

            {
              activeTab === 'termination' && (
                <div className="content-section">
                  <h2 className="section-title">해촉 업무</h2>
                  <div className="empty-state">
                    <p>해촉 업무 내용이 준비 중입니다.</p>
                  </div>
                </div>
              )
            }
          </div >
        </main >
      </div >

      {/* Modal for Application Flow */}
      {
        isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalView === 'question' ? '협회 말소처리 안내' :
                    modalView === 'personal-info' ? '내용증명 작성하기' : '내용증명 샘플보기'}
                </h2>
                <button
                  className="modal-close-button"
                  onClick={closeModal}
                  aria-label="닫기"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                {modalView === 'question' && (
                  <>
                    <div className="modal-subtitle">본인의 상황을 알려주세요</div>
                    <QuestionFlow
                      onComplete={handleQuestionsComplete}
                    />
                  </>
                )}

                {modalView === 'sample' && (
                  <>
                    <ApplicationPreview
                      personalInfo={{
                        company: "A금융서비스",
                        companyAddress: "서울시 강남구 강남길 21",
                        residentNumber: "800101-1234567",
                        name: "홍길동",
                        address: "서울시 강남구 강남길 12",
                        phone: "010-1234-5678",
                        submissionDate: "2025-01-01",
                        recipients: [
                          "생명보험협회 - 서울특별시 중구 퇴계로 173, 16층(충무로3가)",
                          "손해보험협회 - 서울특별시 종로구 종로1길 50 15층 B동(케이트윈타워) 손해보험협회 자격관리팀",
                          "A금융서비스 - 서울시 강남구 강남길 21",
                        ],
                      }}
                      selectedResults={['생명보험협회', '손해보험협회', '현재 재직회사']}
                      onPdfDownloaded={() => { }}
                      onBack={() => setModalView('question')}
                      isSample={true}
                    />
                    <div className="mt-4">
                      <button
                        className="w-full py-6 rounded-xl border-2 border-[#FFE082] bg-orange-50 text-gray-600 font-bold text-lg transition-all duration-150 hover:bg-orange-100 hover:shadow-lg active:scale-95"
                        onClick={() => setModalView('personal-info')}
                      >
                        내용증명 작성을 도와드릴까요?
                      </button>
                    </div>
                  </>
                )}

                {modalView === 'personal-info' && (
                  <PersonalInfoForm
                    onComplete={handlePersonalInfoComplete}
                    onBack={() => setModalView('sample')}
                    selectedResults={selectedResults}
                  />
                )}

                {modalView === 'preview' && personalInfo && (
                  <ApplicationPreview
                    personalInfo={personalInfo}
                    selectedResults={selectedResults}
                    onPdfDownloaded={() => setModalView('completed')}
                    onBack={() => setModalView('personal-info')}
                  />
                )}

                {modalView === 'completed' && (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-6xl">✅</div>
                    <h2 className="mb-8 text-2xl font-bold text-gray-900">다운로드가 완료됐습니다.</h2>
                    <Button
                      onClick={closeModal}
                      className="bg-goodrich-yellow-light transition-all duration-150 hover:opacity-90 active:scale-95"
                      size="lg"
                    >
                      닫기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      <BottomNavigation />
    </>
  );
}

// Step Accordion Component
function StepAccordion({
  stepNumber,
  title,
  isOpen,
  onToggle,
  children
}: {
  stepNumber: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`step-accordion ${isOpen ? 'active' : ''}`}>
      <button className="step-accordion-header" onClick={onToggle}>
        <div className="step-accordion-number">{stepNumber}</div>
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
