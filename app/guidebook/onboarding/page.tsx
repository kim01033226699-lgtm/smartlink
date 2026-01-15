'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronDown, ChevronUp, ExternalLink,
  UserCheck, UserPlus, X, Download, ChevronRight,
  Mail, ClipboardList, Check, FileText, Building2, Play
} from 'lucide-react';
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
  const [malsoMethod, setMalsoMethod] = useState<'certified' | 'application' | null>(null);

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
                    <div className="detail-header mb-8 text-center">
                      <h3 className="text-2xl font-bold text-[#1D2939]">경력자 위촉 프로세스</h3>
                    </div>

                    {/* Detailed Steps */}
                    <div className="space-y-4">
                      {/* Step 1 - 협회 말소하기 */}
                      <StepAccordion
                        title="1. 협회 말소하기"
                        isOpen={expandedSteps.has('exp-1')}
                        onToggle={() => toggleStep('exp-1')}
                      >
                        <div className="malso-container">
                          <div className="malso-header">
                            <h3 className="malso-main-title">기존 협회 등록을 말소해 주세요</h3>
                            <p className="malso-subtitle">새로운 위촉을 위해서는 이전 소속협회의 해촉 처리가 선행되어야 합니다. 원하시는 말소 방법을 선택해 주세요.</p>
                          </div>

                          <div className="malso-cards-grid">
                            <div
                              className={`malso-card ${malsoMethod === 'certified' ? 'active' : ''}`}
                              onClick={() => setMalsoMethod(malsoMethod === 'certified' ? null : 'certified')}
                            >
                              <div className="malso-card-icon-wrapper">
                                <Mail className="malso-card-icon" size={24} />
                              </div>
                              <h4 className="malso-card-label">내용증명 말소</h4>
                              {malsoMethod === 'certified' && <div className="malso-check-tag"><Check size={14} /></div>}
                            </div>

                            <div
                              className={`malso-card ${malsoMethod === 'application' ? 'active' : ''}`}
                              onClick={() => setMalsoMethod(malsoMethod === 'application' ? null : 'application')}
                            >
                              <div className="malso-card-icon-wrapper">
                                <ClipboardList className="malso-card-icon" size={24} />
                              </div>
                              <h4 className="malso-card-label">해촉신청서 말소</h4>
                              {malsoMethod === 'application' && <div className="malso-check-tag"><Check size={14} /></div>}
                            </div>
                          </div>

                          {malsoMethod === 'certified' && (
                            <div className="malso-detail-view bg-white py-8 px-4 space-y-16">
                              {/* Step 1: 내용증명 직접 작성하기 */}
                              <div className="flex flex-col items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">1</div>
                                <div className="text-left w-full">
                                  <button
                                    onClick={() => openModal('personal-info')}
                                    className="flex items-center justify-start gap-2 mb-2 hover:opacity-70 transition-opacity group"
                                  >
                                    <h5 className="text-xl font-bold text-[#FF6B00]">내용증명 직접 작성하기</h5>
                                    <FileText size={20} className="text-[#FF6B00]" />
                                  </button>
                                  <p className="text-slate-500 text-[0.95rem] font-medium leading-relaxed">
                                    내용증명을 직접 작성하고 다운로드할 수 있습니다.
                                  </p>
                                </div>
                              </div>

                              {/* Step 2: 발송하기 */}
                              <div className="flex flex-col items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">2</div>
                                <div className="w-full max-w-lg">
                                  <h5 className="text-xl font-bold text-slate-900 text-left mb-6">발송하기</h5>
                                  <div className="space-y-6">
                                    <div className="flex items-start gap-2.5">
                                      <div className="mt-2 w-1.5 h-1.5 bg-slate-200 rounded-full flex-shrink-0"></div>
                                      <div className="text-[0.95rem] leading-relaxed text-slate-600 font-medium">
                                        <span className="font-bold text-slate-800">발송처</span> : 현재 재직회사, 생명보험협회, 손해보험협회, 우체국, 본인보관용으로 총 5부를 출력
                                        <div className="text-slate-400 text-[0.85rem] mt-1.5 font-normal break-keep">
                                          (생보 or 손보 코드가 하나만 있는 경우에는 해당협회에만 내용증명 제출 (총 4부만 출력))
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                      <div className="mt-2 w-1.5 h-1.5 bg-slate-200 rounded-full flex-shrink-0"></div>
                                      <div className="text-[0.95rem] leading-relaxed text-slate-600 font-medium">
                                        <span className="font-bold text-slate-800">발송방법</span> : 출력한 내용증명에 자필서명 또는 날인 후 우체국에 내용증명으로 발송
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Step 3: 협회 온라인 직접 말소하기 */}
                              <div className="flex flex-col items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">3</div>
                                <div className="w-full max-w-lg">
                                  <h5 className="text-xl font-bold text-slate-900 text-left mb-4">협회 온라인 직접 말소하기</h5>
                                  <p className="text-slate-500 text-[0.95rem] font-medium text-left leading-relaxed mb-6">
                                    내용증명 발송 후 <span className="text-[#FF6B00] font-bold">발송일 포함 11일째</span> 되는 날부터 온라인 말소 가능합니다.
                                  </p>
                                  <div className="grid grid-cols-2 gap-4">
                                    <a
                                      href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-6 bg-white border border-slate-100 rounded-2xl text-[0.95rem] text-slate-700 font-bold hover:border-[#FF6B00]/30 hover:bg-orange-50/30 text-center transition-all shadow-sm flex flex-col items-center gap-3 active:scale-95"
                                    >
                                      <Building2 className="w-10 h-10 text-blue-500/30 mb-1" />
                                      <span>손보협회 말소</span>
                                    </a>
                                    <a
                                      href="https://fp.insure.or.kr/process/process01"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-6 bg-white border border-slate-100 rounded-2xl text-[0.95rem] text-slate-700 font-bold hover:border-[#FF6B00]/30 hover:bg-orange-50/30 text-center transition-all shadow-sm flex flex-col items-center gap-3 active:scale-95"
                                    >
                                      <Building2 className="w-10 h-10 text-green-500/30 mb-1" />
                                      <span>생보협회 말소</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {malsoMethod === 'application' && (
                            <div className="malso-detail-view fade-in">
                              <div className="py-2">
                                <p className="text-sm text-gray-600 mb-6">
                                  전회사에서 해촉신청서를 받아 협회 직접 말소하는 방법입니다.
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                  <a
                                    href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-700 font-bold hover:border-orange-200 hover:bg-orange-50 text-center transition-all shadow-sm flex flex-col items-center gap-2"
                                  >
                                    <Building2 className="w-8 h-8 text-blue-600 opacity-40 mb-1" />
                                    <span>손보협회 말소</span>
                                  </a>
                                  <a
                                    href="https://fp.insure.or.kr/process/process01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-700 font-bold hover:border-orange-200 hover:bg-orange-50 text-center transition-all shadow-sm flex flex-col items-center gap-2"
                                  >
                                    <Building2 className="w-8 h-8 text-green-600 opacity-40 mb-1" />
                                    <span>생보협회 말소</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </StepAccordion>

                      {/* Step 2 - 서울보증보험 동의 */}
                      <StepAccordion
                        title="2. 서울보증보험 동의"
                        isOpen={expandedSteps.has('exp-2')}
                        onToggle={() => toggleStep('exp-2')}
                      >
                        <div className="space-y-6 pt-2 pb-4">
                          <div className="px-2">
                            <div className="flex flex-col items-start gap-3 px-1">
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">서울보증보험 앱 설치</span>
                              </div>
                              <div className="w-full max-w-xs flex justify-center py-1 pr-12">
                                <ChevronDown className="text-blue-300" size={24} />
                              </div>
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">개인 정보 동의</span>
                              </div>
                              <div className="w-full max-w-xs flex justify-center py-1 pr-12">
                                <ChevronDown className="text-blue-300" size={24} />
                              </div>
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">계약 체결·이행을 위한 동의</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center border-t border-slate-100 pt-6">
                            <button
                              onClick={() => setIsAppDownloadModalOpen(true)}
                              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                              <Download className="group-hover:bounce" size={20} />
                              <span>앱 설치하기</span>
                            </button>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 3 - 보험연수원 등록교육 수료 */}
                      <StepAccordion
                        title="3. 보험연수원 등록교육 수료"
                        isOpen={expandedSteps.has('exp-3')}
                        onToggle={() => toggleStep('exp-3')}
                      >
                        <div className="space-y-12 py-8 px-4 bg-white">
                          {/* 1. 경력 확인 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">1) 경력 확인</p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                              <p className="text-lg leading-relaxed text-slate-700">
                                협회등록일 기준 직전 <span className="text-[#FF6B00] font-bold underline underline-offset-4 decoration-[#FF6B00]/30">3년</span> 이내 <span className="text-[#FF6B00] font-bold underline underline-offset-4 decoration-[#FF6B00]/30">1년</span> 이상 경력 인정
                              </p>
                            </div>
                          </div>

                          {/* 2. 수강신청하기 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">2) 수강신청하기</p>
                            <div className="flex justify-start">
                              <div className="flex flex-wrap items-center gap-2.5 text-[0.85rem] font-bold">
                                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">보험연수원 로그인</div>
                                <ChevronRight className="text-slate-300" size={16} />
                                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">모집종사자 교육</div>
                                <ChevronRight className="text-slate-300" size={16} />
                                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">보험설계사</div>
                                <ChevronRight className="text-slate-300" size={16} />
                                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">경력자등록교육</div>
                                <ChevronRight className="text-slate-300" size={16} />
                                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">수강신청</div>
                              </div>
                            </div>
                          </div>

                          {/* 3. 수강과목 선택 방법 */}
                          <div className="pb-4 mb-4 border-b border-gray-200">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">3) 수강과목 선택 방법</p>
                            <div className="space-y-5">
                              {/* Option 1 */}
                              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Play className="text-blue-500 fill-blue-500" size={12} />
                                  <h5 className="font-bold text-blue-600 text-lg">생보, 손보 : 둘다 경력 (총 30H)</h5>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">(경력자교육) 생명 + 손해 + 제3보험 (30H)</p>
                              </div>

                              {/* Option 2 */}
                              <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Play className="text-[#FF6B00] fill-[#FF6B00]" size={12} />
                                  <h5 className="font-bold text-[#FF6B00] text-lg">생보 경력, 손보 신입 (총 45H)</h5>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-slate-500 text-sm font-medium">(경력자교육) 생명 + 제3보험 (25H)</p>
                                  <p className="text-slate-500 text-sm font-medium">(신규등록교육) 손보 (20H)</p>
                                </div>
                              </div>

                              {/* Option 3 */}
                              <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Play className="text-[#FF6B00] fill-[#FF6B00]" size={12} />
                                  <h5 className="font-bold text-[#FF6B00] text-lg">생보 신입, 손보 경력 (총 45H)</h5>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-slate-500 text-sm font-medium">(경력자교육) 손보 + 제3보험 (25H)</p>
                                  <p className="text-slate-500 text-sm font-medium">(신규등록교육) 생보 (20H)</p>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="mt-8 flex justify-center">
                                <a
                                  href="https://is.in.or.kr"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 active:scale-95"
                                >
                                  <span>수강신청</span>
                                  <ExternalLink size={18} />
                                </a>
                              </div>
                            </div>
                          </div>


                          {/* 4. 수료증 출력 */}
                          <div className="pb-4">
                            <p className="content-text font-bold text-[0.95rem] mb-2 text-gray-900">4) 수료증 출력</p>
                            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[0.8rem] font-bold text-slate-700">
                              <span>나의 강의실</span>
                              <ChevronRight size={12} />
                              <span>수료증 출력하기</span>
                              <ChevronRight size={12} />
                              <span>발급사유[협회제출용]기재</span>
                              <ChevronRight size={12} />
                              <span>PDF저장</span>
                            </div>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 4 - 굿리치 위촉방법 */}
                      <StepAccordion
                        title="4. 굿리치 위촉방법"
                        isOpen={expandedSteps.has('exp-4')}
                        onToggle={() => toggleStep('exp-4')}
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
                            <p className="content-text mb-2 text-sm">
                              (1) <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                            </p>
                            <p className="content-text mb-3 text-sm">
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
                        isOpen={expandedSteps.has('exp-5')}
                        onToggle={() => toggleStep('exp-5')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-3">
                            <strong>모바일 보험사 위촉신청</strong><br />
                            2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크를 클릭하여 동의 완료를 합니다.
                          </p>
                          <p className="content-text">
                            <strong>서면 보험사 위촉신청서 작성 및 서명</strong><br />
                            <span className="highlight-red font-bold">작성된 서류는 위촉서류 원본 발송 시 함께 본사 담당자에게 보내 주셔야 합니다.(주임단에게 제출)</span>
                          </p>
                        </div>
                      </StepAccordion>
                    </div>

                    {/* Footer Link */}
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
                )}

                {/* Inexperienced Process Detail */}
                {expandedProcess === 'inexperienced' && (
                  <div className="process-detail inexperienced-process px-1">
                    <div className="detail-header mb-8 text-center">
                      <h3 className="text-2xl font-bold text-[#1D2939]">무경력자 위촉 프로세스</h3>
                    </div>

                    {/* Detailed Steps */}
                    <div className="space-y-4">
                      {/* Step 1 - 모집인 시험 접수 */}
                      <StepAccordion
                        title="1. 모집인 시험 접수"
                        isOpen={expandedSteps.has('inexp-1')}
                        onToggle={() => toggleStep('inexp-1')}
                      >
                        <div className="space-y-6 py-2">
                          {/* (1) 기본정보 제출 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-[0.95rem]">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</div>
                              기본정보를 소속 주임단에 제출
                            </h4>
                            <div className="pl-8">
                              <p className="text-slate-600 leading-relaxed">
                                성명, 주민번호, 휴대폰번호(본인명의), 이메일주소, <span className="text-red-600 font-bold">응시지역</span>
                              </p>
                            </div>
                          </div>

                          {/* (2) 응시 가능 지역 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-[0.95rem]">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</div>
                              응시 가능 지역
                            </h4>
                            <div className="pl-8 space-y-3">
                              <p className="text-slate-600 leading-relaxed font-semibold">
                                서울, 인천, 부산, 대구, 광주, 대전, 원주, 울산, 전주, 서산, 강릉, 제주, 춘천
                              </p>
                              <div className="pt-2">
                                <p className="text-[0.85rem] text-slate-500 leading-relaxed">
                                  <span className="text-orange-600 font-bold">→</span> 응시지역 및 시험 일정은 매월 <span className="font-bold text-blue-600 underline decoration-2 underline-offset-4 cursor-pointer">GP공지사항 - 자격시험 응시 일정 공지</span>를 확인하세요.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* (3) 생명보험 시험응시 */}
                          <div className="pb-2">
                            <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-[0.95rem]">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</div>
                              생명보험 시험응시 경우
                            </h4>
                            <div className="pl-8">
                              <p className="text-slate-600 leading-relaxed">
                                <span className="text-red-600 font-bold">→</span> 문자로 수신한 <span className="font-bold text-red-600">메트라이프생명 url</span> 접속하여 관련 서류 업로드하여 응시해야 합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </StepAccordion>

                      <StepAccordion
                        title="2. 서울보증보험 동의"
                        isOpen={expandedSteps.has('inexp-2')}
                        onToggle={() => toggleStep('inexp-2')}
                      >
                        <div className="space-y-6 pt-2 pb-4">
                          <div className="px-2">
                            <div className="flex flex-col items-start gap-3 px-1">
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">서울보증보험 앱 설치</span>
                              </div>
                              <div className="w-full max-w-xs flex justify-center py-1 pr-12">
                                <ChevronDown className="text-blue-300" size={24} />
                              </div>
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">개인 정보 동의</span>
                              </div>
                              <div className="w-full max-w-xs flex justify-center py-1 pr-12">
                                <ChevronDown className="text-blue-300" size={24} />
                              </div>
                              <div className="flex items-center justify-start px-6 w-full max-w-xs bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span className="font-bold text-slate-800">계약 체결·이행을 위한 동의</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center border-t border-slate-100 pt-6">
                            <button
                              onClick={() => setIsAppDownloadModalOpen(true)}
                              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                            >
                              <Download className="group-hover:bounce" size={20} />
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
                        <div className="space-y-8 pt-2 pb-4">
                          {/* (1) 수강신청하기 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-bold text-slate-900 mb-3 text-[0.95rem]">1) 수강신청하기</h4>
                            <div className="pl-1 space-y-3">
                              <p className="text-slate-500 leading-relaxed italic text-sm">
                                보험연수원 (<a href="https://is.in.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">is.in.or.kr</a>)
                              </p>
                              <div className="py-1">
                                <p className="text-slate-800 font-medium text-[0.9rem]">
                                  모집종사자교육 <ChevronRight className="inline-block mx-1 text-slate-400" size={14} /> 신규등록교육 <ChevronRight className="inline-block mx-1 text-slate-400" size={14} /> (신규) 생명+손해+제3보험 (40H)
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* (2) 수강과목 선택 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-bold text-slate-900 mb-3 text-[0.95rem]">2) 수강과목 선택</h4>
                            <div className="pl-1 space-y-5">
                              <p className="text-slate-600 leading-relaxed">
                                신규등록교육 전체 과정 <span className="font-bold text-slate-900 bg-orange-50 px-1.5 py-0.5 rounded">(40H)</span> 수강
                              </p>

                              <div className="pt-1">
                                <a
                                  href="https://is.in.or.kr/main/sukang/reg/compTrainning.do?lecture_type=1&search_gubun_code=01&search_high_code=04&search_mid_code=01"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between w-full bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                  <span className="font-bold">수강신청 바로가기</span>
                                  <ExternalLink size={18} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* (3) 수료증 발급방법 */}
                          <div className="pb-2">
                            <h4 className="font-bold text-slate-900 mb-3 text-[0.95rem]">3) 수료증 발급방법</h4>
                            <div className="pl-1 space-y-3">
                              <p className="text-slate-700 leading-relaxed flex items-start gap-2 text-sm">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>나의강의실 <ChevronRight className="inline-block mx-1 text-slate-400" size={12} /> 수료증 출력하기</span>
                              </p>
                              <p className="text-slate-700 leading-relaxed flex items-start gap-2 text-sm">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>발급사유 <span className="text-blue-600 font-bold underline underline-offset-2">[협회제출용]</span> 기재</span>
                              </p>
                              <p className="text-slate-700 leading-relaxed flex items-start gap-2 text-sm">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>PDF 파일로 저장</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 4 - 굿리치 위촉방법 */}
                      <StepAccordion
                        title="4. 굿리치 위촉방법"
                        isOpen={expandedSteps.has('inexp-4')}
                        onToggle={() => toggleStep('inexp-4')}
                      >
                        <div className="space-y-8 pt-2 pb-4">
                          {/* (1) 기본정보 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-bold text-slate-900 mb-2 text-[0.95rem]">1) 기본정보 담당 주임단에 전달</h4>
                            <div className="pl-1">
                              <p className="text-slate-600 text-sm leading-relaxed">
                                기본정보 : 성명, 주민번호, 자택주소, 휴대폰번호, 이메일 주소
                              </p>
                            </div>
                          </div>

                          {/* (2) 위촉서류 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-bold text-slate-900 mb-2 text-[0.95rem]">2) 위촉서류</h4>
                            <div className="pl-1 space-y-2">
                              <p className="text-slate-600 text-sm leading-relaxed">
                                신분증 사본, 통장사본, 수료증, 등본(제출용)
                              </p>
                              <div className="inline-flex items-center bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100">
                                <span className="font-bold text-[0.75rem] tracking-tight">주민번호 공개 필수 (그 외 비공개)</span>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed">
                                경력증명서(교보생명위촉용), 이클린조회
                              </p>
                            </div>
                          </div>

                          {/* (3) 전자서명 */}
                          <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-bold text-slate-900 mb-4 text-[0.95rem]">3) 전자서명 가이드</h4>
                            <div className="space-y-4 pl-1">
                              <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-0.5">1</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                  <span className="font-bold">위촉계약서(필수)</span>: 하단 <span className="text-blue-600 font-medium">[서류체크]</span> → 스크롤 하단 → <span className="text-blue-600 font-medium">[서명]</span> → 저장 → <span className="text-blue-600 font-medium">[동의]</span> → 전자서명
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-0.5">2</div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                  <span className="font-bold">기타필수동의서</span>: 하단 <span className="text-blue-600 font-medium">[서류체크]</span> → 스크롤 하단 → <span className="text-blue-600 font-medium">[서명]</span> → 저장 → <span className="text-blue-600 font-medium">[동의]</span> → 전자서명
                                </p>
                              </div>
                              <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 mt-2">
                                <p className="text-[0.75rem] text-orange-700 font-medium">
                                  ※ 본인인증: 카카오톡 또는 네이버 인증 가능
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* (4) E-Clean */}
                          <div className="space-y-5">
                            <h4 className="font-bold text-slate-900 text-[0.95rem]">4) 서류업로드 & E-Clean 조회</h4>
                            <div className="bg-orange-500 text-white p-4 rounded-xl shadow-sm text-center">
                              <span className="font-bold text-sm">[조회] 버튼 클릭 → 이클린 모바일 인증</span>
                            </div>
                            <div className="bg-white border-2 border-blue-100/60 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                              <div className="relative z-10">
                                <p className="text-blue-600 font-bold text-[0.85rem] flex items-center gap-2 mb-3">
                                  <span className="text-lg">💡</span>
                                  조회 시 로딩이 계속된다면? (연결 오류)
                                </p>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  👉 <a href="https://eclean.knia.or.kr/eclean/recr020m" target="_blank" rel="noopener noreferrer" className="text-red-500 font-bold underline underline-offset-4 decoration-red-200">E클린보험서비스</a>에서 <span className="text-slate-800 font-bold">[본인정보조회]</span> 후 PDF를 지점장에게 회신해주세요.
                                </p>
                              </div>
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
                        <div className="space-y-5 pt-2 pb-4">
                          <div className="border-b border-slate-100 pb-5">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-[0.95rem]">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              모바일 보험사 위촉신청
                            </h4>
                            <div className="pl-4">
                              <p className="text-slate-600 text-sm leading-relaxed">
                                2주에 걸쳐 각 생명보험사별 위촉동의 url 발송됩니다. 각 보험사 링크를 클릭하여 동의 완료를 합니다.
                              </p>
                            </div>
                          </div>
                          <div className="pb-2">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-[0.95rem]">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              서면 보험사 위촉 신청
                            </h4>
                            <div className="pl-4">
                              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                                작성된 서류는 위촉서류 원본 발송 시 함께 본사 담당자에게 보내 주셔야 합니다. (주임단에게 제출)
                              </p>
                            </div>
                          </div>
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
              </div>
            )}

            {activeTab === 'termination' && (
              <div className="content-section">
                <h2 className="section-title">해촉 업무</h2>
                <div className="empty-state">
                  <p>해촉 업무 내용이 준비 중입니다.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

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
      {
        isAppDownloadModalOpen && (
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
        )
      }
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
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 transition-all overflow-hidden ${isOpen ? 'ring-1 ring-orange-100 shadow-md border-l-4 border-l-orange-500' : 'hover:shadow-md'}`}>
      <button
        className={`w-full text-left p-6 flex items-center justify-between transition-colors ${isOpen ? 'bg-orange-50/30' : 'bg-white'}`}
        onClick={onToggle}
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-orange-600' : 'text-slate-800'}`}>
          {title}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : 'text-slate-400'}`}>
          <ChevronDown size={24} />
        </div>
      </button>
      {isOpen && (
        <div className="px-3 pt-2 pb-6 bg-white animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
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
