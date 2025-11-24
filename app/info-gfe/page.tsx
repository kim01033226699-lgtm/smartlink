'use client';
import { useState } from 'react';
import BottomNavigation from '@/app/components/BottomNavigation';
import './info-gfe.css';

export default function InfoGfePage() {
  const [mainTab, setMainTab] = useState('campus');
  const [dbOption, setDbOption] = useState('db-select');

  return (
    <>
      <div className="page active" style={{ paddingBottom: '80px' }}>
        <header className="page-header">
          <div className="container">
            <h1 className="page-title">금융캠퍼스</h1>
            <p className="page-subtitle">이해를 돕기 위한 요약으로, 정확한 내용은 관련 규정을 확인해 주세요.</p>
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
                  <li>만 20세~45세 (2025년 기준 1980년 출생까지)</li>
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
                  <div className="detail-box">
                    <div className="detail-item">
                      <strong>지원금</strong>
                      <ul className="info-list">
                        <li>1-6차월 : 120만원 (각월 정산평가업적 30만 원 이상 시)</li>
                        <li>7-12차월 : 100만원 (6개 월 통산 정산평가업적 600만 원 초과 달성자 신청 가능, 단 각월 정산평가업적 50만원 이상 시 지급하며 13차월에 업적 미달시 환수)</li>
                      </ul>
                    </div>
                    <div className="detail-item">
                      <strong>DB</strong>
                      <ul className="info-list">
                        <li>매월 10건 x 12개 월</li>
                        <li>단, 초기 3개월 지급 ( 1차평가(4차월):30만 이상 시 ,2차평가(7차월):50만원 이상 시 계속 지급(직전 3개월 평균 정산평가업적 기준) .</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* DB미선택형 상세 */}
                <div className={`detail-card ${dbOption === 'db-no-select' ? 'active' : ''}`}>
                  <div className="detail-box">
                    <div className="detail-item">
                      <strong>지원금</strong>
                      <ul className="info-list">
                        <li>1차 지원금(1-6차월) : 월 170만 원(지원금 120만 원 + 시장개발비 50만 원, 각월 정산평가업적 50만 원 이상 시 지급) 단, 6개월 통산 정산평가업적 기준 미달시 50% 환수</li>
                        <li>2차 지원금(7-12차월) : 월 120만 원, 초기 6개월 통산 정산평가업적 720만 원 초과 달성자에 한해 신청 가능, 단, 7-12차월 통산 정산평가업적 기준 미달시 환수</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 안내사항 섹션 */}
              <div className="info-section">
                <h3>안내사항</h3>
                <ul className="info-list">
                  <li>지원금에 대한 재정보증이 필요하며 보증보험 가입불가자는 지원이 불가합니다.</li>
                  <li>지원 기간 종료 후 전체 계약에 대한 유지율 평가를 진행하여 환수합니다.</li>
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
                  <li>만 20세~만 50세 (2025년 기준 1975년 출생까지)</li>
                </ul>
              </div>

              {/* 혜택 섹션 */}
              <div className="info-section">
                <h3>혜택</h3>
                <div className="detail-box">
                  <div className="detail-item">
                    <strong>지원금</strong>
                    <ul className="info-list">
                      <li>6개월간 정산평가업적의 100% 지급</li>
                      <li>단, 월 최저 정산평가업적 30만원 이상시 지급, 최대한도 100만원</li>
                    </ul>
                  </div>
                  <div className="detail-item">
                    <strong>DB</strong>
                    <ul className="info-list">
                      <li>매월 7건 x 6개월</li>
                      <li>단, 초기 3개월 지급 후 직전 3개월 평균 정산평가업적 30만원 이상자에 한하여 추가 3개월간 매월 지원</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 안내사항 섹션 */}
              <div className="info-section">
                <h3>안내사항</h3>
                <ul className="info-list">
                  <li>지원 기간 종료 후 전체 계약에 대한 유지율 평가를 진행하여 환수합니다.</li>
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
