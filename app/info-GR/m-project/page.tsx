'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/app/components/BottomNavigation';
import { formatCurrency, formatNumber } from '@/app/utils/calculator';
import './page.css';

interface Config {
  mProject?: {
    qualificationCriteria?: Array<{
      position: string;
      careerOptions?: Array<{ career: string; minPeriod: string }>;
      income: number;
      members: number;
    }>;
    gradeCriteria?: Array<{
      position: string;
      grades: {
        S: number;
        A: number;
        B: number;
        C?: number;
      };
    }>;
    supportCriteria?: Array<{
      position: string;
      supports: {
        [key: string]: {
          monthly: number;
          yearly: number;
          monthlySupport: number;
          total: number;
        };
      };
    }>;
  };
  pageMetadata?: {
    mProject?: {
      title: string;
      subtitle: string;
    };
  };
}

export default function MProjectPage() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [step, setStep] = useState(1);

  // Step 1 상태
  const [position, setPosition] = useState('');
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [members, setMembers] = useState('');

  // Step 2 상태
  const [teamIncome, setTeamIncome] = useState('');
  const [displayTeamIncome, setDisplayTeamIncome] = useState('');
  const [grade, setGrade] = useState('');

  // Step 3 결과
  const [result, setResult] = useState<any>(null);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);

  // 에러 상태
  const [positionError, setPositionError] = useState(false);
  const [membersError, setMembersError] = useState(false);
  const [teamIncomeError, setTeamIncomeError] = useState(false);

  // config.json 로드
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/smartlink' : '';
    fetch(`${basePath}/config.json`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>, setter: Function, displaySetter: Function) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
      displaySetter(value ? formatNumber(value) : '');
    }
  };

  const checkQualification = () => {
    let hasError = false;

    if (!position) {
      setPositionError(true);
      hasError = true;
    }
    if (!members) {
      setMembersError(true);
      hasError = true;
    }
    if (!teamIncome) {
      setTeamIncomeError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // config에서 직접 찾기
    const criteria = config?.mProject?.qualificationCriteria?.find(
      item => item.position === position
    );

    if (!criteria) {
      setModalMessage('자격 기준 데이터를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
      setShowModal(true);
      return;
    }

    // 입력된 만원 단위를 원단위로 변환
    const incomeNum = Number(income || 0) * 10000;
    const membersNum = Number(members);
    const teamIncomeNum = Number(teamIncome) * 10000;

    // 등급 계산
    const gradeConfig = config?.mProject?.gradeCriteria?.find(
      item => item.position === position
    );
    const supportConfig = config?.mProject?.supportCriteria?.find(
      item => item.position === position
    );

    if (!gradeConfig || !supportConfig) {
      setModalMessage('등급 기준 데이터를 찾을 수 없습니다.');
      setShowModal(true);
      return;
    }

    const criteria2 = gradeConfig.grades;
    let calculatedGrade = '';

    if (teamIncomeNum >= criteria2.S) {
      calculatedGrade = 'S';
    } else if (teamIncomeNum >= criteria2.A) {
      calculatedGrade = 'A';
    } else if (teamIncomeNum >= criteria2.B) {
      calculatedGrade = 'B';
    } else {
      calculatedGrade = 'C';
    }

    setGrade(calculatedGrade);

    // C등급은 미달 처리
    if (calculatedGrade === 'C') {
      setTeamIncomeError(true);
      setModalMessage('당사 Grade규정에 맞지 않습니다. 기준을 확인하시고 소득을 수정해 주세요.');
      setShowModal(true);
      return;
    }

    const supportData = supportConfig.supports[calculatedGrade];
    if (!supportData) {
      setModalMessage(`${calculatedGrade} 등급의 지원금 데이터를 찾을 수 없습니다.`);
      setShowModal(true);
      return;
    }

    let totalSupport = supportData.total;
    let additionalSupport = 0;

    if (calculatedGrade === 'S' || calculatedGrade === 'A') {
      additionalSupport = Math.floor(incomeNum * 0.1);
      totalSupport += additionalSupport;
    }

    setResult({
      position,
      grade: calculatedGrade,
      ...supportData,
      totalSupport,
      additionalSupport,
      bonusApplied: (calculatedGrade === 'S' || calculatedGrade === 'A')
    });

    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setPosition('');
    setIncome('');
    setDisplayIncome('');
    setMembers('');
    setTeamIncome('');
    setDisplayTeamIncome('');
    setGrade('');
    setResult(null);
    setShowModal(false);
    setModalMessage('');
    setPositionError(false);
    setMembersError(false);
    setTeamIncomeError(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  if (!config) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-light)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mproject-page">
        {/* Header */}
        <header className="header">
          <div className="container">
            <h1 className="title">{config?.pageMetadata?.mProject?.title || '영업관리자 지원금'}</h1>
            <p className="subtitle">{config?.pageMetadata?.mProject?.subtitle || '편의를 위한 참고용으로 정확한 내용은 규정을 준수합니다.'}</p>
            <div className="header-links">
              <button onClick={() => router.push('/info-GR/')} className="home-link">홈</button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            {/* Step 1: 자격 확인 */}
            {step === 1 && (
              <div className="step-card fade-in">
                <div className="step-title-container">
                  <h2 className="step-title">위임 자격 확인</h2>
                  <button onClick={() => setShowGradeModal(true)} className="btn-grade-info">
                    기준
                  </button>
                </div>

                <div className="form-group">
                  <label>굿리치 위촉 직급</label>
                  <select
                    name="position"
                    value={position}
                    onChange={(e) => {
                      setPosition(e.target.value);
                      if (positionError) setPositionError(false);
                    }}
                    className={`select-input ${positionError ? 'input-error' : ''}`}
                  >
                    <option value="">선택하세요</option>
                    <option value="본부장">본부장</option>
                    <option value="사업단장">사업단장</option>
                    <option value="지점장">지점장</option>
                  </select>
                  {positionError && <span className="error-message">위촉 직급을 선택해주세요</span>}
                </div>

                <div className="form-group">
                  <label>동반위촉인원(본인포함)</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      name="members"
                      value={members}
                      onChange={(e) => {
                        setMembers(e.target.value);
                        if (membersError) setMembersError(false);
                      }}
                      placeholder="0"
                      className={`text-input ${membersError ? 'input-error' : ''}`}
                      min="0"
                    />
                    <span className="input-suffix">명</span>
                    <div className="input-arrows">
                      <button
                        type="button"
                        className="arrow-btn up"
                        onClick={() => {
                          setMembers(prev => Math.max(0, Number(prev) + 1).toString());
                          if (membersError) setMembersError(false);
                        }}
                        tabIndex={-1}
                      >▲</button>
                      <button
                        type="button"
                        className="arrow-btn down"
                        onClick={() => setMembers(prev => Math.max(0, Number(prev) - 1).toString())}
                        tabIndex={-1}
                      >▼</button>
                    </div>
                  </div>
                  {membersError && <span className="error-message">동반위촉 인원을 입력해주세요</span>}
                </div>

                <div className="form-group">
                  <label>본인 직전 1년 소득</label>
                  <div className="input-with-suffix">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9,]*"
                      value={displayIncome}
                      onChange={(e) => handleIncomeChange(e, setIncome, setDisplayIncome)}
                      placeholder="0"
                      className="text-input"
                    />
                    <span className="input-suffix">만원</span>
                    <div className="input-arrows">
                      <button
                        type="button"
                        className="arrow-btn up"
                        onClick={() => {
                          const currentValue = Number(income || 0);
                          const newValue = currentValue + 1000;
                          setIncome(newValue.toString());
                          setDisplayIncome(formatNumber(newValue));
                        }}
                        tabIndex={-1}
                      >▲</button>
                      <button
                        type="button"
                        className="arrow-btn down"
                        onClick={() => {
                          const currentValue = Number(income || 0);
                          const newValue = Math.max(0, currentValue - 1000);
                          setIncome(newValue.toString());
                          setDisplayIncome(formatNumber(newValue));
                        }}
                        tabIndex={-1}
                      >▼</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>산하조직소득합계(본인포함)</label>
                  <div className="input-with-suffix">
                    <input
                      type="text"
                      name="teamIncome"
                      inputMode="numeric"
                      pattern="[0-9,]*"
                      value={displayTeamIncome}
                      onChange={(e) => {
                        handleIncomeChange(e, setTeamIncome, setDisplayTeamIncome);
                        if (teamIncomeError) setTeamIncomeError(false);
                      }}
                      placeholder="0"
                      className={`text-input ${teamIncomeError ? 'input-error' : ''}`}
                    />
                    <span className="input-suffix">만원</span>
                    <div className="input-arrows">
                      <button
                        type="button"
                        className="arrow-btn up"
                        onClick={() => {
                          const currentValue = Number(teamIncome || 0);
                          const newValue = currentValue + 1000;
                          setTeamIncome(newValue.toString());
                          setDisplayTeamIncome(formatNumber(newValue));
                          if (teamIncomeError) setTeamIncomeError(false);
                        }}
                        tabIndex={-1}
                      >▲</button>
                      <button
                        type="button"
                        className="arrow-btn down"
                        onClick={() => {
                          const currentValue = Number(teamIncome || 0);
                          const newValue = Math.max(0, currentValue - 1000);
                          setTeamIncome(newValue.toString());
                          setDisplayTeamIncome(formatNumber(newValue));
                        }}
                        tabIndex={-1}
                      >▼</button>
                    </div>
                  </div>
                  {teamIncomeError && <span className="error-message">산하조직소득합계를 입력해주세요</span>}
                </div>

                <div className="button-group">
                  <button onClick={handleReset} className="btn-secondary btn-icon" title="새로고침">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                  </button>
                  <button onClick={checkQualification} className="btn-primary btn-large">지원금 확인</button>
                </div>
              </div>
            )}

            {/* Step 2: 결과 */}
            {step === 2 && result && (
              <div className="fade-in">
                <div className="result-card">
                  <div className="result-header">
                    <h2 className="result-title">지원금 안내</h2>
                    <div className="result-summary">
                      <div className="summary-row">
                        <span className="summary-label">위임 직급</span>
                        <span className="summary-value badge">{result.position}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">적용 Grade</span>
                        <span className="summary-value grade-badge">{result.grade}</span>
                      </div>
                      <div className="summary-row total-row">
                        <span className="summary-label">총지원금액</span>
                        <span className="summary-value amount">
                          {formatNumber(Math.floor(result.total / 10000))}만원
                          <span className="monthly-breakdown">
                            ({formatNumber(Math.floor(result.total / 12 / 10000))}만원 X 12개월)
                          </span>
                        </span>
                      </div>
                      {result.bonusApplied && (
                        <div className="summary-row">
                          <span className="summary-label">추가지급</span>
                          <span className="summary-value additional">{formatNumber(Math.floor(result.additionalSupport / 10000))} 만원
                            <span className="additional-note">(S,A등급만 추가 지급)</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="result-details-grid">
                    <div className="detail-item-center">
                      <div className="yearly-goal-title">연간업적목표(정산평가업적)</div>
                      <div className="yearly-goal-amount">
                        {formatNumber(Math.floor(result.yearly / 10000))} 만원
                        <span className="monthly-amount">(월 {formatNumber(Math.floor(result.monthly / 10000))}만원)</span>
                      </div>
                    </div>
                  </div>

                  <div className="notice-section-center">
                    <ul className="notice-list-center">
                      <li><span className="checkmark">✓</span> <strong>지원금에 대한 재정보증 필수</strong></li>
                      <li><span className="checkmark">✓</span> <strong>6개월 선지급가능(재정보증 필수)</strong></li>
                      <li><span className="checkmark">✓</span> <strong>Grade 상향은 불가</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="result-button-container">
                  <button onClick={handleReset} className="btn-secondary btn-icon" title="새로고침">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container"></div>
        </footer>

        {/* 커스텀 모달 */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>알림</h3>
                <button className="btn-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* 그레이드 기준 모달 */}
        {showGradeModal && (
          <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
            <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Grade 기준</h3>
                <button className="btn-close" onClick={() => setShowGradeModal(false)}>×</button>
              </div>
              <div className="modal-body modal-body-scrollable">
                {config?.mProject?.gradeCriteria && config.mProject.gradeCriteria.map(item => {
                  const supportData = config?.mProject?.supportCriteria?.find(
                    s => s.position === item.position
                  );

                  return (
                    <div key={item.position} className="grade-criteria-section">
                      <h4 className="position-title">{item.position}</h4>
                      <table className="grade-table">
                        <thead>
                          <tr>
                            <th>등급</th>
                            <th>산하조직소득</th>
                            <th>총지원금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(item.grades).sort((a, b) => {
                            const order: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };
                            return order[a[0]] - order[b[0]];
                          }).map(([grade, income]) => {
                            const totalSupport = supportData?.supports?.[grade]?.total || 0;
                            return (
                              <tr key={grade}>
                                <td className="grade-cell">
                                  <span className={`grade-badge-modal grade-${grade}`}>{grade}</span>
                                </td>
                                <td className="income-cell">{formatNumber(Math.floor((income as number) / 10000))} 만원</td>
                                <td className="support-cell">{formatNumber(Math.floor(totalSupport / 10000))} 만원</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
}
