/**
 * 소득 구간에 따른 지원 비율 계산
 */
export const getIncomePercentage = (income: number, incomeRanges: any[]): number => {
  const range = incomeRanges.find(r => {
    if (r.maxIncome === null) {
      return income >= r.minIncome;
    }
    return income >= r.minIncome && income <= r.maxIncome;
  });

  return range ? range.percentage : 0;
};

/**
 * 최종 지원금 계산
 */
export const calculateSupport = (income: number, config: any) => {
  const percentage = getIncomePercentage(income, config.incomeRanges);
  const amount = Math.floor((income * percentage) / 100);

  return {
    amount,
    percentage,
    income
  };
};

/**
 * 숫자를 원화 형식으로 포맷
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

/**
 * 숫자를 천단위 구분 형식으로 포맷
 */
export const formatNumber = (number: number | string): string => {
  return new Intl.NumberFormat('ko-KR').format(Number(number));
};
