'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/app/components/BottomNavigation';
import { calculateSupport, formatNumber } from '@/app/utils/calculator';
import './UserPage.css';

interface Config {
  incomeRanges: Array<{
    minIncome: number;
    maxIncome: number | null;
    percentage: number;
  }>;
  types: {
    A: {
      label: string;
      schedules: Array<{
        round: number;
        month: number;
        percentage: number;
      }>;
    };
    B: {
      label: string;
      schedules: Array<{
        round: number;
        month: number;
        percentage: number;
      }>;
    };
  };
  options: Array<{
    id: string;
    period: number;
    percentage: number;
    label: string;
  }>;
  documents: {
    required: string[];
    optional: string[];
  };
}

export default function SettlementEducationPage() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/smartlink' : '';
    fetch(`${basePath}/config.json`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value);
      setIncomeError('');
    }
  };

  const handleNextStep = () => {
    if (!income || parseInt(income) === 0) {
      setIncomeError('소득을 입력해주세요.');
      return;
    }

    if (!config) {
      setIncomeError('설정을 로드하는 중입니다...');
      return;
    }

    // 만원 단위를 원 단위로 변환 (입력값 * 10,000)
    const incomeValue = parseInt(income) * 10000;
    const supportData = calculateSupport(incomeValue, config);

    if (supportData.percentage === 0) {
      setIncomeError('지원 대상이 아닙니다.');
      return;
    }

    setResult(supportData);
    setStep(2);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const optionId = e.target.value;
    setSelectedOption(optionId);

    if (optionId && result) {
      setIsCalculating(true);

      setTimeout(() => {
        let option;
        if (optionId === 'option1') {
          option = { id: 'option1', label: 'Option-1: 12개월 평가기간 적용', period: 12, percentage: 60 };
        } else if (optionId === 'option2') {
          option = { id: 'option2', label: 'Option-2: 18개월 평가기간 적용', period: 18, percentage: 70 };
        } else if (optionId === 'option3') {
          option = { id: 'option3', label: 'Option-3: 24개월 평가기간 적용', period: 24, percentage: 80 };
        }

        if (option) {
          const finalGoal = Math.floor((result.amount * option.percentage) / 100);
          const intermediateGoals = calculateIntermediateGoals(finalGoal, option.period);

          setResult({
            ...result,
            selectedOption: option,
            finalGoal,
            intermediateGoals
          });
        }
        setIsCalculating(false);
      }, 1200);
    }
  };

  const calculateIntermediateGoals = (finalGoal: number, period: number) => {
    const monthlyAverage = Math.floor(finalGoal / period);

    if (period === 12) {
      return [
        { month: 3, amount: Math.floor(finalGoal * 0.25) },
        { month: 6, amount: Math.floor(finalGoal * 0.50) }
      ];
    } else if (period === 18) {
      return [
        { month: 6, amount: Math.floor(finalGoal * 0.33) },
        { month: 12, amount: Math.floor(finalGoal * 0.67) }
      ];
    } else if (period === 24) {
      return [
        { month: 6, amount: Math.floor(finalGoal * 0.25) },
        { month: 12, amount: Math.floor(finalGoal * 0.50) },
        { month: 18, amount: Math.floor(finalGoal * 0.75) }
      ];
    }
    return [];
  };

  const handleReset = () => {
    setStep(1);
    setIncome('');
    setIncomeError('');
    setSelectedOption('');
    setResult(null);
    setIsCalculating(false);
  };

  if (!config) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-light)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="user-page">
        {/* Header */}
        <header className="header">
          <div className="container">
            <h1 className="title">정착교육비</h1>
            <p className="subtitle">이해를 돕기 위한 요약으로, 정확한 내용은 관련 규정을 확인해 주세요.</p>
            <div className="header-links">
              <button onClick={() => router.push('/info-GR/')} className="home-link">
                홈
              </button>
              {step === 2 && (
                <button onClick={handleReset} className="home-link">
                  처음으로
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            {step === 1 ? (
              // Step 1: Income Input
              <div className="step-card fade-in" style={{ maxWidth: '400px' }}>
                <h2 className="step-title">연소득을 입력해주세요</h2>
                <div className="income-form">
                  <div className="form-group">
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className={`text-input ${incomeError ? 'input-error' : ''}`}
                        value={income ? formatNumber(income) : ''}
                        onChange={handleIncomeChange}
                        placeholder=""
                      />
                      <span className="input-suffix">만원</span>
                    </div>
                    {incomeError && (
                      <span className="error-message">{incomeError}</span>
                    )}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="btn-primary btn-large"
                  >
                    지원금 확인
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Results
              <div className="fade-in">
                {/* Result Card */}
                <div className="result-card">
                  <div className="result-header">
                    <p className="result-title">정착교육비 지원금</p>
                    <p className="result-amount">{formatNumber(Math.floor(result.amount / 10000))}만원</p>
                  </div>

                  {/* Option Selection */}
                  <div className="option-selection-section">
                    <div className="option-selection-row">
                      <label className="section-title">목표 옵션</label>
                      <div className="form-group">
                        <select
                          className="select-input"
                          value={selectedOption}
                          onChange={handleOptionChange}
                        >
                          <option value="">옵션을 선택하세요</option>
                          <option value="option1">Option-1: 12개월 평가기간 적용</option>
                          <option value="option2">Option-2: 18개월 평가기간 적용</option>
                          <option value="option3">Option-3: 24개월 평가기간 적용</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Calculating Animation */}
                  {isCalculating && (
                    <div className="calculating-section fade-in">
                      <div className="calculating-spinner">
                        <div className="spinner"></div>
                      </div>
                      <p className="calculating-text">목표를 계산하고 있습니다...</p>
                    </div>
                  )}

                  {/* Goals Display */}
                  {!isCalculating && result.selectedOption && (
                    <div className="goals-section fade-in">
                      <h3 className="section-title">목표업적</h3>

                      {/* Final Goal */}
                      <div className="goal-block final-goal">
                        <h4 className="goal-block-title">최종 목표</h4>
                        <div className="goal-block-content">
                          {formatNumber(Math.floor(result.finalGoal / 10000))}만원
                          <span className="goal-monthly-calc">
                            {formatNumber(Math.floor(result.finalGoal / result.selectedOption.period / 10000))}만원 x {result.selectedOption.period}개월
                          </span>
                        </div>
                      </div>

                      {/* Intermediate Goals */}
                      {result.intermediateGoals && result.intermediateGoals.length > 0 && (
                        <div className="intermediate-goals">
                          {result.intermediateGoals.map((goal: any, index: number) => {
                            const evaluationPeriods = ['영업7차월', '영업10차월', '영업13차월'];
                            return (
                              <div key={index} className="goal-block intermediate-goal">
                                <h4 className="goal-block-title">{index + 1}차 중간목표</h4>
                                <div className="goal-block-content">
                                  {formatNumber(Math.floor(goal.amount / 10000))}만원
                                  <span className="goal-evaluation">
                                    (평가시기: {evaluationPeriods[index]})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Notice Section */}
                      <div className="notice-section" style={{ marginTop: '2rem' }}>
                        <ul className="notice-list">
                          <li>
                            <span className="notice-icon">⚠️</span>
                            <span>중간목표 달성에 따라 지원금 지급 및 환수가 발생할 수 있습니다.</span>
                          </li>
                          <li className="sub-item">
                            <span>* A-Type : 1차 '중간목표' 달성 시 2회차 지급</span>
                          </li>
                          <li className="sub-item">
                            <span>* B-Type : 1차 '중간목표' 미달성 시 선지급 정착교육비 일부 환수 발생</span>
                          </li>
                          <li>
                            <span className="notice-icon">⚠️</span>
                            <span>목표 달성 후 유지율 평가에 따라 환수가 발생할 수 있습니다</span>
                          </li>
                        </ul>
                      </div>

                      {/* Reset Button */}
                      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                          onClick={handleReset}
                          className="btn-secondary btn-large"
                        >
                          다시하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          background: 'var(--bg-light)',
          padding: '2rem 0',
          textAlign: 'center'
        }}>
          <div className="container"></div>
        </footer>
      </div>

      <BottomNavigation />
    </>
  );
}
