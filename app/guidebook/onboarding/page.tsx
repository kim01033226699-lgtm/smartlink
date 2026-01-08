'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, UserCheck, UserPlus, X, Download, ChevronRight } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import ApplicationPreview from "@/app/info-appoint/components/application-flow/application-preview";
import QuestionFlow from '@/app/info-appoint/components/application-flow/question-flow';
import PersonalInfoForm from "@/app/info-appoint/components/application-flow/personal-info-form";
import { Button } from "@/app/components/ui/button";
import { BASE_PATH } from '@/lib/utils';
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
  const [modalView, setModalView] = useState<'question' | 'sample' | 'personal-info' | 'preview' | 'completed' | 'blank-download'>('question');
  const [activeTab, setActiveTab] = useState<'onboarding' | 'termination'>('onboarding');
  const [expandedProcess, setExpandedProcess] = useState<ExpandedType>(null);

  // Flow State
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  /* State for Step 1 mode */
  const [isSendExpanded, setIsSendExpanded] = useState(false);
  const [isCancelExpanded, setIsCancelExpanded] = useState(false);
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
  const [isAutoDownload, setIsAutoDownload] = useState(false);

  const openModal = (view: 'question' | 'sample' | 'personal-info' | 'blank-download') => {
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
    setIsAutoDownload(false);
  };

  const handleModalClose = () => {
    if (modalView === 'sample' || modalView === 'blank-download') {
      setModalView('personal-info');
    } else {
      closeModal();
    }
  };

  const handleQuestionsComplete = (results: string[]) => {
    setSelectedResults(results);
    setModalView('sample');
  };

  const handlePersonalInfoComplete = (info: PersonalInfo) => {
    setPersonalInfo(info);
    setIsAutoDownload(false);
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
      // Reset Step 1 internal states when opening its sub-steps
      if (subStepId === 'exp-1-certified' || subStepId === 'exp-1-application') {
        setIsSendExpanded(false);
        setIsCancelExpanded(false);
      }
    }
  };


  return (
    <>
      <div className="onboarding-page">
        {/* Header */}
        <header className="onboarding-header">
          <button
            onClick={() => {
              if (expandedProcess) {
                setExpandedProcess(null);
              } else {
                router.back();
              }
            }}
            className="back-button"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-full max-w-[700px] mx-auto flex flex-col items-center relative">
            <div className="onboarding-logo-wrapper">
              <img
                src={`${BASE_PATH}/images/GR-img.png`}
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
                        title="1. 협회 말소하기"
                        isOpen={expandedSteps.has('exp-1')}
                        onToggle={() => toggleStep('exp-1')}
                      >
                        <div className="step-content">
                          {/* 내용증명 토글 */}
                          <SubStepAccordion
                            subStepId="exp-1-certified"
                            title="1) 내용증명으로 말소"
                            isOpen={expandedSubSteps.has('exp-1-certified')}
                            onToggle={() => toggleSubStep('exp-1-certified')}
                          >
                            <div className="fade-in">
                              <div className="space-y-0 relative mt-2">

                                {/* Step 1 Button */}
                                <div className="relative">
                                  <button
                                    onClick={() => openModal('personal-info')}
                                    className="w-full text-left py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="font-bold text-gray-800 text-[0.95rem]">(1) 내용증명 작성하기</span>
                                    <ChevronRight size={20} className="text-gray-400" />
                                  </button>
                                </div>

                                {/* Step 2 Button */}
                                <div className="relative border-b border-gray-100">
                                  <button
                                    onClick={() => setIsSendExpanded(!isSendExpanded)}
                                    className="w-full text-left py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="font-bold text-gray-800 text-[0.95rem]">(2) 내용증명 발송하기</span>
                                    <ChevronRight
                                      size={20}
                                      className={`text-gray-400 transition-transform ${isSendExpanded ? 'rotate-90' : ''}`}
                                    />
                                  </button>

                                  {isSendExpanded && (
                                    <div className="pl-2 pr-2 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                                      <ul className="space-y-4 text-sm text-gray-700">
                                        <li className="flex items-start">
                                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                                          <span className="leading-relaxed">
                                            <strong>발송처</strong> : 현재 재직회사, 생명보험협회, 손해보험협회, 우체국, 본인보관용으로 총 5부를 출력
                                            <span className="block text-xs text-gray-500 mt-1">
                                              (생보 or 손보 코드가 하나만 있는 경우에는 해당협회에만 내용증명 제출 (총 4부만 출력))
                                            </span>
                                          </span>
                                        </li>
                                        <li className="flex items-start">
                                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                                          <span className="leading-relaxed">
                                            <strong>발송방법</strong> : 출력한 내용증명에 자필서명 또는 날인 후 우체국에 내용증명으로 발송
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Step 3 Button */}
                                <div className="relative border-b border-gray-100">
                                  <button
                                    onClick={() => setIsCancelExpanded(!isCancelExpanded)}
                                    className="w-full text-left py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="font-bold text-gray-800 text-[0.95rem]">(3) 협회말소하기</span>
                                      <span className="text-xs text-orange-600 font-medium">
                                        내용증명 발송 후 발송일 포함 11일째 되는 날부터 말소 가능
                                      </span>
                                    </div>
                                    <ChevronRight
                                      size={20}
                                      className={`text-gray-400 transition-transform mt-1 ${isCancelExpanded ? 'rotate-90' : ''}`}
                                    />
                                  </button>

                                  {isCancelExpanded && (
                                    <div className="grid grid-cols-2 gap-3 pl-2 pr-2 pb-6 mt-2 animate-in slide-in-from-top-2 duration-200">
                                      <a
                                        href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white border border-blue-200 rounded-lg text-sm text-blue-600 font-bold hover:bg-blue-50 text-center transition-colors shadow-sm"
                                      >
                                        손보협회<br />온라인 말소
                                      </a>
                                      <a
                                        href="https://fp.insure.or.kr/process/process01"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white border border-blue-200 rounded-lg text-sm text-blue-600 font-bold hover:bg-blue-50 text-center transition-colors shadow-sm"
                                      >
                                        생보협회<br />온라인 말소
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SubStepAccordion>

                          {/* 해촉신청서 토글 */}
                          <SubStepAccordion
                            subStepId="exp-1-application"
                            title="2) 해촉신청서로 말소"
                            isOpen={expandedSubSteps.has('exp-1-application')}
                            onToggle={() => toggleSubStep('exp-1-application')}
                          >
                            <div className="fade-in">
                              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <p className="text-sm text-gray-600 mb-3">
                                  해촉신청서를 통해 온라인으로 협회 말소를 진행할 수 있습니다.
                                </p>

                                {/* Tab Navigation for Associations */}
                                <div className="cancellation-tabs">
                                  <a
                                    href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cancellation-tab"
                                  >
                                    손보협회 온라인 말소
                                  </a>
                                  <a
                                    href="https://fp.insure.or.kr/process/process01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cancellation-tab"
                                  >
                                    생보협회 온라인 말소
                                  </a>
                                </div>
                              </div>
                            </div>
                          </SubStepAccordion>
                        </div>
                      </StepAccordion>

                      <StepAccordion
                        title="2. 서울보증보험 동의"
                        isOpen={expandedSteps.has('exp-3')}
                        onToggle={() => toggleStep('exp-3')}
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
                              • 1번 [계약 체결·이행을 위한 동의]
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

                      {/* Step 3 - 보험연수원 등록교육 수료 (moved from 4) */}
                      <StepAccordion
                        title="3. 보험연수원 등록교육 수료"
                        isOpen={expandedSteps.has('exp-4')}
                        onToggle={() => toggleStep('exp-4')}
                      >
                        <div className="step-content">
                          <SubStepAccordion
                            subStepId="exp-3-1"
                            title="1) 경력 확인"
                            isOpen={expandedSubSteps.has('exp-3-1')}
                            onToggle={() => toggleSubStep('exp-3-1')}
                          >
                            <p className="content-text">
                              협회등록일 기준 직전 <strong className="highlight-red">3년</strong> 이내 <strong className="highlight-red">1년</strong> 이상 경력 인정
                            </p>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="exp-3-2"
                            title="2) 수강신청하기"
                            isOpen={expandedSubSteps.has('exp-3-2')}
                            onToggle={() => toggleSubStep('exp-3-2')}
                          >
                            <p className="content-text">
                              ▶ 보험연수원 로그인 → 모집종사자 교육 → 보험설계사 → 경력자등록교육 → 수강신청
                            </p>
                          </SubStepAccordion>

                          <SubStepAccordion
                            subStepId="exp-3-3"
                            title="3) 수강과목 선택 방법"
                            isOpen={expandedSubSteps.has('exp-3-3')}
                            onToggle={() => toggleSubStep('exp-3-3')}
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
                            subStepId="exp-3-4"
                            title="4) 수료증 출력"
                            isOpen={expandedSubSteps.has('exp-3-4')}
                            onToggle={() => toggleSubStep('exp-3-4')}
                          >
                            <p className="content-text">
                              ▶ 나의강의실 → 수료증 출력하기 → 발급사유[협회제출용] 기재 → PDF 저장
                            </p>
                          </SubStepAccordion>
                        </div>
                      </StepAccordion>

                      {/* Step 4 - 굿리치 위촉방법 */}
                      <StepAccordion
                        title="4. 굿리치 위촉방법"
                        isOpen={expandedSteps.has('exp-5')}
                        onToggle={() => toggleStep('exp-5')}
                      >
                        <div className="step-content">
                          {/* (1) 기본정보 담당 주임단에 전달 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">1) 기본정보 담당 주임단에 전달</p>
                            <p className="content-text">
                              기본정보 : 성명, 주민번호, 자택주소, 휴대폰번호, 이메일 주소
                            </p>
                          </div>

                          {/* (2) 위촉서류 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">2) 위촉서류</p>
                            <p className="content-text">
                              신분증 사본, 통장사본, 수료증, 등본(제출용) <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span> 경력증명서(교보생명위촉용), 이클린조회
                            </p>
                          </div>

                          {/* (3) 전자서명 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">3) 전자서명</p>
                            <h4 className="font-bold text-gray-800 mb-2">* 위촉서류 전자서명하기</h4>
                            <p className="content-text mb-2">
                              (1) <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                            </p>
                            <p className="content-text mb-3">
                              (2) <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                            </p>
                            <p className="content-text highlight-red font-bold">
                              ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                            </p>
                          </div>

                          {/* (4) 서류업로드 & E-Clean정보 조회하기 */}
                          <div className="pb-4">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">4) 서류업로드 & E-Clean정보 조회하기</p>
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
                                👉 <a href="https://eclean.knia.or.kr/eclean/recr020m" target="_blank" rel="noopener noreferrer" className="text-red-600 underline hover:text-red-700">E클린보험서비스</a> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장에게 회신
                              </p>
                            </div>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 5 - 원수사 위촉안내 */}
                      <StepAccordion
                        title="5. 원수사 위촉안내"
                        isOpen={expandedSteps.has('exp-7')}
                        onToggle={() => toggleStep('exp-7')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-3">
                            <strong>모바일 보험사 위촉신청</strong><br />
                            2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크를 클릭하여 동의 완료를 합니다.
                          </p>
                          <p className="content-text">
                            <strong>서면 보험사 위촉신청서 작성 및 서명</strong><br />
                            <span className="highlight-red">작성된 서류는 위촉서류 원본 발송 시 함께 본사 담당자에게 보내 주셔야 합니다.(주임단에게 제출)</span>
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
                        title="1. 모집인 시험 접수"
                        isOpen={expandedSteps.has('inexp-1')}
                        onToggle={() => toggleStep('inexp-1')}
                      >
                        <div className="step-content">
                          {/* 기본정보 제출 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="font-bold text-lg text-gray-900 mb-2">기본정보를 소속 주임단에 제출</p>
                            <p className="content-text">
                              성명, 주민번호, 휴대폰번호(본인명의), 이메일주소, <span className="text-red-600 font-bold">응시지역</span>
                            </p>
                          </div>

                          {/* 응시 가능 지역 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="font-bold text-lg text-gray-800 mb-2">응시 가능 지역</p>
                            <p className="content-text mb-3">
                              서울, 인천, 부산, 대구, 광주, 대전, 원주, 울산, 전주, 서산, 강릉, 제주, 춘천
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed pt-2 border-t border-gray-200">
                              <span className="text-orange-600 font-bold">→</span> 응시지역 및 시험 일정은 매월 <span className="font-bold text-blue-600">GP공지사항 - 자격시험 응시 일정 공지</span>를 통해 확인해야 합니다.
                            </p>
                          </div>

                          {/* 생명보험 시험응시 */}
                          <div className="pb-4">
                            <p className="font-bold text-lg text-gray-900 mb-2">생명보험 시험응시 경우</p>
                            <p className="content-text">
                              <span className="text-red-600 font-bold">→</span> 문자로 수신한 <span className="font-bold text-red-600">메트라이프생명 url</span> 접속하여 관련 서류 업로드하여 응시해야 합니다.
                            </p>
                          </div>
                        </div>
                      </StepAccordion>

                      <StepAccordion
                        title="2. 서울보증보험 동의"
                        isOpen={expandedSteps.has('inexp-2')}
                        onToggle={() => toggleStep('inexp-2')}
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
                              • 1번 [계약 체결·이행을 위한 동의]
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

                      {/* Step 3 */}
                      <StepAccordion
                        title="3. 보험연수원 등록교육 수료"
                        isOpen={expandedSteps.has('inexp-3')}
                        onToggle={() => toggleStep('inexp-3')}
                      >
                        <div className="step-content">
                          <SubStepAccordion
                            subStepId="inexp-3-1"
                            title="1) 수강신청하기"
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
                            title="2) 수강과목 선택"
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
                            title="3) 수료증 발급방법"
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
                        title="4. 굿리치 위촉방법"
                        isOpen={expandedSteps.has('inexp-4')}
                        onToggle={() => toggleStep('inexp-4')}
                      >
                        <div className="step-content">
                          {/* (1) 기본정보 담당 주임단에 전달 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">1) 기본정보 담당 주임단에 전달</p>
                            <p className="content-text">
                              기본정보 : 성명, 주민번호, 자택주소, 휴대폰번호, 이메일 주소
                            </p>
                          </div>

                          {/* (2) 위촉서류 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">2) 위촉서류</p>
                            <p className="content-text">
                              신분증 사본, 통장사본, 수료증, 등본(제출용) <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span> 경력증명서(교보생명위촉용), 이클린조회
                            </p>
                          </div>

                          {/* (3) 전자서명 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">3) 전자서명</p>
                            <h4 className="font-bold text-gray-800 mb-2">* 위촉서류 전자서명하기</h4>
                            <p className="content-text mb-2">
                              (1) <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                            </p>
                            <p className="content-text mb-3">
                              (2) <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                            </p>
                            <p className="content-text highlight-red font-bold">
                              ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                            </p>
                          </div>

                          {/* (4) 서류업로드 & E-Clean정보 조회하기 */}
                          <div className="pb-4">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">4) 서류업로드 & E-Clean정보 조회하기</p>
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
                                👉 <a href="https://eclean.knia.or.kr/eclean/recr020m" target="_blank" rel="noopener noreferrer" className="text-red-600 underline hover:text-red-700">E클린보험서비스</a> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장에게 회신
                              </p>
                            </div>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 5 - 원수사 위촉안내 */}
                      <StepAccordion
                        title="5. 원수사 위촉안내"
                        isOpen={expandedSteps.has('inexp-5')}
                        onToggle={() => toggleStep('inexp-5')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-3">
                            <strong>모바일 보험사 위촉신청</strong><br />
                            2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크를 클릭하여 동의 완료를 합니다.
                          </p>
                          <p className="content-text">
                            <strong>서면 보험사 위촉신청서 작성 및 서명</strong><br />
                            <span className="highlight-red">작성된 서류는 위촉서류 원본 발송 시 함께 본사 담당자에게 보내 주셔야 합니다.(주임단에게 제출)</span>
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
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className={modalView === 'blank-download' ? "" : "modal-content"} onClick={(e) => e.stopPropagation()}>
              <div className={modalView === 'blank-download' ? "hidden" : "modal-header"}>
                <h2 className="modal-title">
                  {modalView === 'question' ? '협회 말소처리 안내' :
                    modalView === 'personal-info' ? '내용증명 작성하기' :
                      ''}
                </h2>
                <button
                  className="modal-close-button"
                  onClick={handleModalClose}
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
                  <div className="flex flex-col items-center">
                    <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                      <img
                        src={`${BASE_PATH}/images/sample-preview.png`}
                        alt="내용증명 샘플"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}

                {modalView === 'blank-download' && (
                  <ApplicationPreview
                    personalInfo={{
                      company: " ",
                      companyAddress: " ",
                      residentNumber: " ",
                      name: " ",
                      address: " ",
                      phone: " ",
                      submissionDate: new Date().toISOString().split('T')[0],
                      recipients: []
                    }}
                    selectedResults={[]}
                    onPdfDownloaded={() => setModalView('personal-info')}
                    onBack={() => setModalView('personal-info')}
                    autoDownload={true}
                  />
                )}

                {modalView === 'personal-info' && (
                  <PersonalInfoForm
                    onComplete={handlePersonalInfoComplete}
                    onBack={() => setModalView('sample')}
                    selectedResults={selectedResults}
                    onOpenSample={() => setModalView('sample')}
                    onOpenBlank={() => setModalView('blank-download')}
                  />
                )}

                {modalView === 'preview' && personalInfo && (
                  <ApplicationPreview
                    personalInfo={personalInfo}
                    selectedResults={selectedResults}
                    onPdfDownloaded={() => setModalView('completed')}
                    onBack={() => setModalView('personal-info')}
                    autoDownload={isAutoDownload}
                  />
                )}

                {modalView === 'completed' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">내용증명 생성 완료!</h3>
                    <p className="text-gray-600 mb-8">
                      다운로드된 PDF 파일을 확인해주세요.<br />
                      해당 파일을 출력하여 협회 말소 절차를 진행하시면 됩니다.
                    </p>
                    <Button
                      onClick={closeModal}
                      className="w-full py-6 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold"
                    >
                      확인
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

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
                className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsAppDownloadModalOpen(false)}
              >
                <Download size={20} />
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      )}
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
