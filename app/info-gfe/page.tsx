'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import './info-gfe.css';

export default function InfoGfePage() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState('campus');
  const [dbOption, setDbOption] = useState('db-select');

  return (
    <>
      <div className="page active" style={{ paddingBottom: '80px' }}>
        <header className="page-header">
          <button onClick={() => router.back()} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="container">
            <h1 className="page-title">금융캠퍼스</h1>
            <p className="text-xs text-white/90 mt-2 break-keep">편의를 위한 참고용으로 정확한 내용은 규정을 준수합니다.</p>
          </div>
        </header>

        <main className="page-content">
          <div className="container">
            {/* Main Tab Navigation */}
            <div className="tab-nav">
              <button
                className={`tab-button ${mainTab === 'campus' ? 'active' : ''}`}
                onClick={() => setMainTab('campus')}
              >
                <div style={{ fontSize: '1.32rem', fontWeight: 700 }}>금융캠퍼스</div>
              </button>
              <button
                className={`tab-button ${mainTab === 'basic' ? 'active' : ''}`}
                onClick={() => setMainTab('basic')}
              >
                <div style={{ fontSize: '1.32rem', fontWeight: 700 }}>베이직</div>
              </button>
            </div>

            {/* 금융캠퍼스 Content */}
            <div className={`tab-content ${mainTab === 'campus' ? 'active' : ''}`}>
              {/* 조건 섹션 */}
              <div className="info-section">
                <h3>조건</h3>
                <ul className="info-list">
                  <li>보험 경력이 없거나, 직전 3년 이내 경력일수 0일 이면 입과 신청 가능 (단, 3년 초과자는 불가)</li>
                  <li>학력 : 초대졸 이상(경단녀 및 특화시장 출신자는 고졸 가능)</li>
                  <li>특화시장 : 군장교 및 부사관, 간호사, 학원강사, 학습지 교사, (자동차/카드)대출 영업직 등</li>
                </ul>
              </div>

              {/* 지원나이 섹션 */}
              <div className="info-section">
                <h3>지원나이</h3>
                <ul className="info-list">
                  <li>만 20세~45세 (2026년 기준 1982년 출생까지)</li>
                </ul>
              </div>

              {/* 혜택 섹션 */}
              <div className="info-section">
                <h3>혜택</h3>

                {/* DB 옵션 탭 */}
                <div className="tab-nav">
                  <button
                    className={`tab-button ${dbOption === 'db-select' ? 'active' : ''}`}
                    onClick={() => setDbOption('db-select')}
                  >
                    DB선택형
                  </button>
                  <button
                    className={`tab-button ${dbOption === 'db-no-select' ? 'active' : ''}`}
                    onClick={() => setDbOption('db-no-select')}
                  >
                    DB미선택형
                  </button>
                </div>

                {/* DB선택형 상세 */}
                <div className={`detail-card ${dbOption === 'db-select' ? 'active' : ''}`}>
                  <div className="sub-title">지원금</div>
                  <ul className="info-list">
                    <li>1차 지원금(1~6차월) : 월 120만원 (각월 정산평가업적 30만원 이상 시) / 최대 지원금액 720만원</li>
                    <li>2차 지원금(7~12차월) : 월 100만원 (각월 정산평가업적 50만원 이상 시) / 최대 지원금액 600만원</li>
                  </ul>

                  <div className="sub-title">DB</div>
                  <ul className="info-list">
                    <li>1차 DB(1~6차월) : 월 10건 (3개월 최저보장 후 분기평가 시행) / 최대 지원DB 60건</li>
                    <li>2차 DB(7~12차월) : 월 10건 (업적 달성자에 한하여 3개월 지급 후 분기평가 시행) / 최대 지원DB 60건</li>
                    <li className="font-semibold">분기평가 기준</li>
                    <ul className="info-list" style={{ marginLeft: '1rem', marginTop: '0.2rem' }}>
                      <li>1차평가(4차월) 직전 3개월 평균 정산평가업적 30만원 이상</li>
                      <li>2차평가(7차월) 직전 3개월 평균 정산평가업적 50만원 이상</li>
                      <li>3차평가(10차월) 직전 3개월 평균 정산평가업적 50만원 이상</li>
                    </ul>
                  </ul>

                  <div className="sub-title">환수</div>
                  <ul className="info-list">
                    <li>1차 지원금 환수 : 목표업적(정산평가업적 420만원) 미달 시, 기지원금 대비 미달률만큼 6개월간 분할 환수</li>
                    <li>2차 지원금 환수 : 목표업적(정산평가업적 600만원) 미달 시, 기지원금 대비 미달률만큼 6개월간 분할 환수</li>
                    <li>해촉 환수 : 위촉의무기간(24개월) 이내 해촉 시, 지원금액 전액 환수 (해촉사유 불문) ※ 기지원금, 지원금액 : DB비용 제외한 지원금</li>
                  </ul>
                </div>

                {/* DB미선택형 상세 */}
                <div className={`detail-card ${dbOption === 'db-no-select' ? 'active' : ''}`}>
                  <div className="sub-title">지원금</div>
                  <ul className="info-list">
                    <li>1차 지원금(1~6차월) : 월 170만원 (각월 정산평가업적 50만원 이상 시) / 최대 지원금액 1,020만원</li>
                    <li>2차 지원금(7~12차월) : 월 120만원 (각월 정산평가업적 70만원 이상 시) / 최대 지원금액 720만원</li>
                  </ul>

                  <div className="sub-title">환수</div>
                  <ul className="info-list">
                    <li>1차 지원금 환수 : 목표업적(정산평가업적 600만원) 미달 시, 기지원금 대비 미달률만큼 6개월간 분할 환수</li>
                    <li>2차 지원금 환수 : 목표업적(정산평가업적 720만원) 미달 시, 기지원금 대비 미달률만큼 6개월간 분할 환수</li>
                    <li>해촉 환수 : 위촉의무기간(24개월) 이내 해촉 시, 지원금액 전액 환수 (해촉사유 불문) ※ 기지원금, 지원금액 : DB비용 제외한 지원금</li>
                  </ul>
                </div>
              </div>

              {/* 안내사항 섹션 */}
              <div className="info-section">
                <h3>안내사항</h3>
                <ul className="info-list">
                  <li>지원금에 대한 재정보증이 필요하며 보증보험 가입불가자는 지원이 불가합니다.</li>
                  <li>금융캠퍼스 신청 시 정착교육비, 활동수수료 등의 지원금 중복 신청은 불가합니다.</li>
                  <li>지원 기간 종료 후 전체 계약에 대한 유지율 평가를 진행하여 환수합니다.</li>
                </ul>
              </div>

              {/* 문의 섹션 */}
              <div className="info-section">
                <h3 style={{ color: 'var(--secondary-color)' }}>문의</h3>
                <ul className="info-list">
                  <li><strong>금융캠퍼스 교육 문의</strong> : 정진래 차장 (02-6410-7440)</li>
                  <li><strong>베이직과정 교육 문의</strong> : 최인석 과장 (02-6410-7427)</li>
                  <li><strong>지원금 지급 및 평가</strong> : 이천영 팀장 (02-6410-7264)</li>
                  <li><strong>지원안 제출</strong> : 박세현 차장 (02-6410-7028)</li>
                  <li><strong>DB배정</strong> : 제영록 과장 (02-6410-7431)</li>
                  <li><strong>규정 문의, DB평가</strong> : 고현진 과장 (02-6410-7380)</li>
                </ul>
              </div>
            </div>

            {/* 베이직 Content */}
            <div className={`tab-content ${mainTab === 'basic' ? 'active' : ''}`}>
              {/* 조건 섹션 */}
              <div className="info-section">
                <h3>조건</h3>
                <ul className="info-list">
                  <li>보험경력 1년 이하 또는 보험경력 1-5년인 경우, 직전 1년 보험영업 소득금액 500만원 미만</li>
                  <li>학력: 초대졸 이상(경단녀 및 특화시장 출신자는 고졸 가능)</li>
                  <li>특화시장 : 군장교 및 부사관, 간호사, 학원강사, 학습지 교사, (자동차/카드)대출 영업직 등</li>
                </ul>
              </div>

              {/* 지원나이 섹션 */}
              <div className="info-section">
                <h3>지원나이</h3>
                <ul className="info-list">
                  <li>만 20세~만 50세 (2026년 기준 1977년 출생까지)</li>
                </ul>
              </div>

              {/* 혜택 섹션 */}
              <div className="info-section">
                <h3>혜택</h3>
                <div className="sub-title">지원금</div>
                <ul className="info-list">
                  <li>6개월간 [정산평가업적의 100%] 지급 / 최대 지원금액 600만원</li>
                  <li>단, 각월 정산평가업적 30만원 이상 시 지급하며 월 최대 지급한도는 100만원</li>
                </ul>

                <div className="sub-title">DB</div>
                <ul className="info-list">
                  <li>월 7건 (3개월 최저보장 후 분기평가 시행) / 최대 지원DB 42건</li>
                  <li className="font-semibold">분기평가(4차월)</li>
                  <div style={{ marginLeft: '1.5rem', marginTop: '0.2rem' }}>
                    - 직전 3개월 평균 정산평가업적 30만원 이상자에 4~6차월 DB 지급
                  </div>
                </ul>

                <div className="sub-title">환수</div>
                <ul className="info-list">
                  <li>위촉의무기간(24개월) 이내 해촉 시, 지원금액 전액 환수 (해촉사유 불문) ※ 지원금액 : DB비용 제외한 지원금</li>
                </ul>
              </div>

              {/* 안내사항 섹션 */}
              <div className="info-section">
                <h3>안내사항</h3>
                <ul className="info-list">
                  <li>지원 기간 종료 후 전체 계약에 대한 유지율 평가를 진행하여 환수합니다.</li>
                  <li>금융캠퍼스 베이직 신청 시 정착교육비, 활동수수료 등의 지원금 중복 신청은 불가합니다.</li>
                </ul>
              </div>

              {/* 문의 섹션 */}
              <div className="info-section">
                <h3 style={{ color: 'var(--secondary-color)' }}>문의</h3>
                <ul className="info-list">
                  <li><strong>베이직과정 교육 문의</strong> : 최인석 과장 (02-6410-7427)</li>
                  <li><strong>지원금 지급 및 평가</strong> : 이천영 팀장 (02-6410-7264)</li>
                  <li><strong>지원안 제출</strong> : 박세현 차장 (02-6410-7028)</li>
                  <li><strong>DB배정</strong> : 제영록 과장 (02-6410-7431)</li>
                  <li><strong>규정 문의, DB평가</strong> : 고현진 과장 (02-6410-7380)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <footer className="page-footer">
          <div className="container"></div>
        </footer>
      </div>

      <BottomNavigation />
    </>
  );
}
