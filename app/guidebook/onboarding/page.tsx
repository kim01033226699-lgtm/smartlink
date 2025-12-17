'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, UserCheck, UserPlus, X, Download } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import QuestionFlow from '@/app/info-appoint/components/application-flow/question-flow';
import './onboarding.css';

type ExpandedType = 'experienced' | 'inexperienced' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'onboarding' | 'termination'>('onboarding');
  const [expandedProcess, setExpandedProcess] = useState<ExpandedType>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedSubSteps, setExpandedSubSteps] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="container">
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
          <div className="container">
            {activeTab === 'onboarding' && (
              <div className="content-section">
                {/* Menu Selection - Only show when no process is selected */}
                {expandedProcess === null && (
                  <div className="onboarding-menu-grid">
                    <div className="category-box" onClick={() => toggleProcess('experienced')}>
                      <div className="category-icon">
                        <UserCheck size={32} />
                      </div>
                      <h3 className="category-title">경력자 위촉</h3>
                    </div>
                    <div className="category-box" onClick={() => toggleProcess('inexperienced')}>
                      <div className="category-icon">
                        <UserPlus size={32} />
                      </div>
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
                          <p className="content-text mb-2">
                            내용증명 발송 후 발송일 포함 <strong className="highlight-red">11일째 되는 날</strong>부터 생, 손보 협회 인터넷 말소 가능
                          </p>

                          <div className="highlight-box">
                            <p className="highlight-red">해촉신청서 양식</p>
                          </div>

                          <p className="content-text mt-4 mb-3">
                            생,손보 코드가 다 있는 경우<br />
                            수신처: 현재 근무회사 본점, 생보협회<span className="highlight-red">(지역본부 必)</span>, 손보협회<span className="highlight-red">(총 5부 출력)</span>
                          </p>

                          <p className="content-text bg-blue-50 p-3 rounded-lg text-center font-bold text-blue-600">
                            ※ 생손보협회 지역본부 및 보험사 본점 주소<br />
                            각 홈페이지에서 확인 가능
                          </p>

                          <div className="step-button-box">
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="step-action-button"
                            >
                              협회 말소처리 안내
                            </button>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 2 - 기본정보 전달 (moved from 1) */}
                      <StepAccordion
                        stepNumber="2"
                        title="기본정보 전달"
                        isOpen={expandedSteps.has('exp-2')}
                        onToggle={() => toggleStep('exp-2')}
                      >
                        <div className="step-content">
                          <p className="content-text">
                            <strong>기본정보:</strong> 성명, 주민번호, 자택주소, 휴대폰 번호, 이메일 주소
                          </p>
                        </div>
                      </StepAccordion>

                      {/* Step 3 - 서울보증보험 동의 (moved from 2) */}
                      <StepAccordion
                        stepNumber="3"
                        title="서울보증보험 동의"
                        isOpen={expandedSteps.has('exp-3')}
                        onToggle={() => toggleStep('exp-3')}
                      >
                        <div className="step-content">
                          <p className="content-text">
                            모바일 서울보증보험 앱 설치 → 개인정보동의 → 1번 [예약 체결·이행을 위한 동의]
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

                      {/* Step 4 - 보험연수원 등록교육 수료 (moved from 3) */}
                      <StepAccordion
                        stepNumber="4"
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

                      {/* Step 5 - 위촉서류 준비 */}
                      <StepAccordion
                        stepNumber="5"
                        title="위촉서류 준비"
                        isOpen={expandedSteps.has('exp-5')}
                        onToggle={() => toggleStep('exp-5')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-1">
                            신분증 사본, 통장사본, 수료증, 등본(제출용)
                          </p>
                          <p className="content-text mb-3">
                            <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span>
                          </p>
                          <p className="content-text">
                            경력증명서(교보생명위촉용), 이클린조회
                          </p>
                        </div>
                      </StepAccordion>

                      {/* Step 6 - 전자서명 및 서류 업로드 */}
                      <StepAccordion
                        stepNumber="6"
                        title="전자서명 및 서류 업로드"
                        isOpen={expandedSteps.has('exp-6')}
                        onToggle={() => toggleStep('exp-6')}
                      >
                        <div className="step-content">
                          <h4 className="font-bold text-lg text-gray-800 mb-2">(1) (Step2) 위촉서류 전자서명 하기</h4>
                          <p className="content-text mb-2">
                            ① <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text mb-3">
                            ② <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text highlight-red font-bold mb-6">
                            ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                          </p>

                          <div className="mb-6 border-t pt-5">
                            <div className="flex flex-col gap-2 mb-3">
                              <h4 className="font-bold text-lg text-gray-800">(2) (Step3) E-Clean 정보 조회하기</h4>
                              <div className="bg-orange-500 text-white px-3 py-1.5 rounded-md inline-block text-sm font-bold shadow-sm">
                                [조회] 버튼 클릭 → 이클린 보험 서비스의 모바일 인증절차 진행
                              </div>
                            </div>

                            <div className="border-2 border-blue-400 p-4 rounded-lg bg-white shadow-sm">
                              <p className="text-blue-600 font-bold mb-2 text-sm md:text-base">
                                ♥ 조회 버튼 클릭후 모래시계가 계속 돌고 있다면? 이클린 연결 오류상태!!
                              </p>
                              <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                                → <a href="https://www.e-cleanins.or.kr" target="_blank" rel="noopener noreferrer" className="text-red-600">[E클린보험서비스]</a> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장님께 회신!!!
                              </p>
                            </div>
                          </div>

                          <div className="step-button-box mb-6">
                            <a
                              href="https://docusign.goodrich.kr/login"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="step-action-link"
                            >
                              <span>위촉지원시스템</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 7 - 각 보험사 위촉신청 */}
                      <StepAccordion
                        stepNumber="7"
                        title="각 보험사 위촉신청"
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
                      {/* Step 1 - 필요정보 */}
                      <StepAccordion
                        stepNumber="1"
                        title="필요정보"
                        isOpen={expandedSteps.has('inexp-1')}
                        onToggle={() => toggleStep('inexp-1')}
                      >
                        <div className="step-content">
                          <p className="content-text mb-4 text-blue-600 font-bold">
                            기본정보 : 성명, 주민번호, 자택주소, 휴대폰 번호, 이메일 주소, <span className="text-red-500">응시지역</span>
                          </p>

                          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4 text-center cursor-pointer hover:bg-yellow-200 transition-colors">
                            <span className="font-bold text-lg text-gray-800 flex items-center justify-center gap-2">
                              <span className="text-red-500">≫</span> 응시지역 확인 <ExternalLink size={20} className="inline" />
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
                            모바일 서울보증보험 앱 설치 → 개인정보동의 → 1번 [예약 체결·이행을 위한 동의]
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

                      {/* Step 4 */}
                      <StepAccordion
                        stepNumber="4"
                        title="위촉서류 준비"
                        isOpen={expandedSteps.has('inexp-4')}
                        onToggle={() => toggleStep('inexp-4')}
                      >
                        <div className="step-content">
                          <p className="content-text">
                            신분증 사본, 통장사본, 수료증, 등본(제출용)(br r 
                            <span className="highlight-red">(본인 주민번호 공개, 그 외 비공개 필)</span><br />
                            합격증 (생명, 손해, 제3보험)
                          </p>
                        </div>
                      </StepAccordion>

                      {/* Step 5 - 전자서명 및 서류 업로드 */}
                      <StepAccordion
                        stepNumber="5"
                        title="전자서명 및 서류 업로드"
                        isOpen={expandedSteps.has('inexp-5')}
                        onToggle={() => toggleStep('inexp-5')}
                      >
                        <div className="step-content">
                          <h4 className="font-bold text-lg text-gray-800 mb-2">(1) (Step2) 위촉서류 전자서명 하기</h4>
                          <p className="content-text mb-2">
                            ① <span className="text-blue-600 font-bold">위촉계약서(필수)</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text mb-3">
                            ② <span className="text-blue-600 font-bold">기타필수동의서</span> 하단 <span className="text-blue-600 font-bold">[서류체크]</span> 버튼 클릭 → 팝업된 화면 우측 스크롤을 모두 내려서 내용 확인후 <span className="text-blue-600 font-bold">[서명]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">마우스로 서명입력</span> → 저장 → <span className="text-blue-600 font-bold">[동의]</span> 버튼 클릭 → <span className="text-blue-600 font-bold">전자서명</span> 선택
                          </p>
                          <p className="content-text highlight-red font-bold mb-6">
                            ⁙ 전자서명 본인인증 : 카카오톡인증 or 네이버인증
                          </p>

                          <div className="mb-6 border-t pt-5">
                            <div className="flex flex-col gap-2 mb-3">
                              <h4 className="font-bold text-lg text-gray-800">(2) (Step3) E-Clean 정보 조회하기</h4>
                              <div className="bg-orange-500 text-white px-3 py-1.5 rounded-md inline-block text-sm font-bold shadow-sm">
                                [조회] 버튼 클릭 → 이클린 보험 서비스의 모바일 인증절차 진행
                              </div>
                            </div>

                            <div className="border-2 border-blue-400 p-4 rounded-lg bg-white shadow-sm">
                              <p className="text-blue-600 font-bold mb-2 text-sm md:text-base">
                                ♥ 조회 버튼 클릭후 모래시계가 계속 돌고 있다면? 이클린 연결 오류상태!!
                              </p>
                              <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                                → <a href="https://www.e-cleanins.or.kr" target="_blank" rel="noopener noreferrer" className="text-red-600">[E클린보험서비스]</a> 홈페이지에서 <span className="text-red-600">[모집종사자 본인정보조회]</span> 하여 다운로드 받은 PDF 파일을 지점장님께 회신!!!
                              </p>
                            </div>
                          </div>

                          <div className="step-button-box mb-6">
                            <a
                              href="https://docusign.goodrich.kr/login"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="step-action-link"
                            >
                              <span>위촉지원시스템</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </StepAccordion>

                      {/* Step 6 - 각 보험사 위촉신청 */}
                      <StepAccordion
                        stepNumber="6"
                        title="각 보험사 위촉신청"
                        isOpen={expandedSteps.has('inexp-6')}
                        onToggle={() => toggleStep('inexp-6')}
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
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">협회 말소처리 안내</h2>
                <button
                  className="modal-close-button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="닫기"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-subtitle">본인의 상황을 알려주세요</div>
                <QuestionFlow onComplete={() => { }} />
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
