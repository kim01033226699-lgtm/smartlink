'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';
import { calculateSupport, formatCurrency, formatNumber } from '@/app/utils/calculator';
import './page.css';

interface Config {
  incomeRanges: Array<{
    minIncome: number;
    maxIncome: number | null;
    percentage: number;
  }>;
}

export default function ActivityFeePage() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [activeTab, setActiveTab] = useState('type1');
  const isType1 = activeTab === 'type1';

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [result, setResult] = useState<any>(null);
  const [incomeError, setIncomeError] = useState(false);

  // config.json 로드
  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/smartlink' : '';
    fetch(`${basePath}/config.json`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  // 소득 입력 핸들러
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value);
      setDisplayIncome(value ? formatNumber(value) : '');
      if (incomeError) setIncomeError(false);
    }
  };

  // 지원금 확인 핸들러
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || Number(income) < 0) {
      setIncomeError(true);
      return;
    }

    if (!config) {
      alert('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const incomeInWon = Number(income) * 10000;
    const calculationResult = calculateSupport(incomeInWon, config);
    setResult(calculationResult);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setIncome('');
    setDisplayIncome('');
    setResult(null);
    setIncomeError(false);
  };

  // 모달 열기
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!config) {
      alert('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setShowModal(true);
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
      <div className="activity-fee-page">
        {/* Header */}
        <header className="header">
          <button onClick={() => router.back()} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="container">
            <h1 className="title">활동수수료</h1>
            <p className="subtitle">편의를 위한 참고용으로 정확한 내용은 규정을 준수합니다.</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            {/* 탭 메뉴 */}
            <div className="tab-menu">
              <button
                className={`tab-button ${isType1 ? 'active' : ''}`}
                onClick={() => setActiveTab('type1')}
              >
                <span className="tab-title">활동수수료 I</span>
                <span className="tab-subtitle">소득무관</span>
              </button>
              <button
                className={`tab-button ${!isType1 ? 'active active-green' : ''}`}
                onClick={() => setActiveTab('type2')}
              >
                <span className="tab-title">활동수수료 II</span>
                <span className="tab-subtitle">소득 2천만원↑</span>
              </button>
            </div>

            {/* 세부 정보 */}
            <div className={`detail-card ${isType1 ? 'detail-card-type1' : 'detail-card-type2'}`}>
              <div className="detail-header">
                <h2 className="detail-title">지원내용</h2>
              </div>
              <div className="detail-body">
                <div className="detail-info">
                  <p>* 지급기간: <span className="highlight">{isType1 ? '12개월' : '24개월'}</span></p>
                  <p>* 지급률: 정산평가업적 대비 <span className="highlight">{isType1 ? '50%' : '100%'}</span></p>
                  <p>
                    * {isType1 ? '총 지원한도' : '지원 한도'}:{' '}
                    <span className="highlight">
                      {isType1 ? '2,000만원' : '정착교육비 지원 한도 내'}
                    </span>
                    {!isType1 && (
                      <button onClick={handleOpenModal} className="check-limit-button">
                        내 한도 확인하기
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* 활동수수료 예시 - 별도 카드 */}
            <div className={`example-card ${isType1 ? 'example-card-type1' : 'example-card-type2'}`}>
              <div className="example-header">
                <h2 className="example-title">{isType1 ? '활동수수료I(50%형) 예시' : '활동수수료II(100%형) 예시'}</h2>
              </div>
              <div className="example-body">
                {isType1 ? (
                  <>
                    <p>* 정산평가업적 매월 100만원 → 50만원 × 12개월 = 600만원</p>
                    <p>* 누적 지급 한도 2천만 내</p>
                  </>
                ) : (
                  <p>정산평가업적 매월 100만원 → 100만원 × 24개월 = 2,400만원 (단 지급한도 내에서 지급)</p>
                )}
              </div>
            </div>

            {/* 필수 안내 */}
            <div className="notice-section">
              <div className="notice-header">
                <h3 className="notice-title">필수 안내</h3>
              </div>
              <div className="notice-content">
                <p>- 별도의 요청서로 신청 가능</p>
                <p>- 월 정산평가업적 50만원 이상 시 지급</p>
                <p>- 위촉 의무기간: 36개월</p>
                <p className="notice-subtitle notice-subtitle-margin">환수</p>
                <p>- 36개월 이내 해촉 시 지원금 전액 <span className="refund-highlight">환수</span></p>
                <p>- 미유지 계약 발생 시 정산<span className="refund-highlight">환수</span>율에 따라 <span className="refund-highlight">환수</span> 적용</p>
                <p>- {isType1 ? '활동수수료 I' : '활동수수료 II'} 신청 시 : {isType1 ? '활동수수료II' : '활동수수료I'},정착교육비,금융캠퍼스,고능률수수료,장기고능률수수료 미지급</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container"></div>
        </footer>

        {/* 지원금 확인 모달 */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">정착교육비 지원금 확인</h2>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleIncomeSubmit} className="modal-form">
                  <div className="form-group">
                    <label className="form-label">본인 연소득</label>
                    <div className="input-row">
                      <div className="input-wrapper">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9,]*"
                          value={displayIncome}
                          onChange={handleIncomeChange}
                          placeholder="0"
                          className={`modal-input ${incomeError ? 'input-error' : ''}`}
                          autoFocus
                        />
                        <span className="input-suffix">만원</span>
                      </div>
                      <button type="submit" className="modal-btn-primary">확인</button>
                    </div>
                    {incomeError && <span className="error-message">연소득을 입력해주세요</span>}
                  </div>
                </form>

                {result && (
                  <div className="modal-result">
                    <div className="result-amount">{formatCurrency(result.amount)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
}
