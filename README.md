# Smart Link

굿리치 통합 정보 시스템 - Start Good, Grow Rich!

신규 위촉자와 기존 RP를 위한 통합 정보 제공 플랫폼입니다. 지원금 안내, 금융캠퍼스 프로그램, 스마트위촉 일정 조회 등 다양한 정보를 한 곳에서 제공합니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [페이지별 상세 정보](#페이지별-상세-정보)
- [주요 컴포넌트](#주요-컴포넌트)
- [데이터 파일](#데이터-파일)
- [로컬 개발](#로컬-개발)
- [배포](#배포)
- [기술 스택](#기술-스택)

## 🎯 주요 기능

### 1. 지원금 안내 (info-GR)
- **정착교육비**: 연소득 기반 지원금 계산 및 목표업적 안내
- **활동수수료**: 활동수수료 I, II 제도 안내 및 한도 확인
- **영업관리자 지원금**: 위임 자격 확인 및 지원금 계산

### 2. 금융캠퍼스 (info-gfe)
- 무경력 신입 지원 프로그램 안내
- DB선택형/DB미선택형 옵션별 지원 내용 제공
- 조건, 지원나이, 혜택 상세 안내

### 3. 스마트위촉 (info-appoint)
- 위촉 체크리스트 관리
- 위촉일정 조회 (수요일 기준)
- 전체 일정 캘린더 (PC: 캘린더 뷰, 모바일: Agenda 뷰)
- PDF 저장 기능
- 등록교육 신청 플로우

## 📁 프로젝트 구조

```
smartlink/
├── app/                          # Next.js App Router 페이지 및 컴포넌트
│   ├── components/              # 공통 컴포넌트
│   │   ├── ui/                  # UI 기본 컴포넌트 (ShadCN UI)
│   │   │   ├── button.tsx       # 버튼 컴포넌트
│   │   │   ├── calendar.tsx     # 캘린더 컴포넌트
│   │   │   ├── card.tsx         # 카드 컴포넌트
│   │   │   ├── checkbox.tsx     # 체크박스 컴포넌트
│   │   │   ├── dialog.tsx       # 다이얼로그/모달 컴포넌트
│   │   │   ├── input.tsx        # 입력 필드 컴포넌트
│   │   │   ├── label.tsx        # 라벨 컴포넌트
│   │   │   └── popover.tsx      # 팝오버 컴포넌트
│   │   ├── BottomNavigation.tsx # 하단 네비게이션 바
│   │   ├── BottomNavigation.css
│   │   ├── calendar-modal.tsx   # 전체 일정 캘린더 모달
│   │   ├── NavigationHeader.tsx # 네비게이션 헤더
│   │   ├── result-page.tsx      # 결과 페이지 컴포넌트
│   │   ├── SupportCard.tsx      # 지원 카드 컴포넌트
│   │   ├── SupportCard.css
│   │   └── tutorial-overlay.tsx # 튜토리얼 오버레이
│   │
│   ├── info-GR/                 # 지원금 섹션
│   │   ├── page.tsx             # 지원금 메인 페이지 (메뉴)
│   │   ├── info-GR.css          # 지원금 섹션 스타일
│   │   ├── settlement-education/ # 정착교육비 페이지
│   │   │   ├── page.tsx         # 정착교육비 메인 페이지
│   │   │   └── UserPage.css     # 정착교육비 스타일
│   │   ├── activity-fee/        # 활동수수료 페이지
│   │   │   ├── page.tsx         # 활동수수료 메인 페이지
│   │   │   └── page.css         # 활동수수료 스타일
│   │   └── m-project/           # 영업관리자 지원금 페이지
│   │       ├── page.tsx         # 영업관리자 지원금 메인 페이지
│   │       └── page.css         # 영업관리자 지원금 스타일
│   │
│   ├── info-gfe/                 # 금융캠퍼스 섹션
│   │   ├── page.tsx             # 금융캠퍼스 메인 페이지
│   │   └── info-gfe.css        # 금융캠퍼스 스타일
│   │
│   ├── info-appoint/             # 스마트위촉 섹션
│   │   ├── page.tsx             # 스마트위촉 메인 페이지
│   │   ├── types.ts             # 스마트위촉 타입 정의
│   │   ├── result/              # 결과 페이지
│   │   │   └── page.tsx         # 위촉일정 결과 페이지
│   │   ├── application-flow/    # 등록교육 신청 플로우
│   │   │   └── page.tsx         # 신청 플로우 페이지
│   │   ├── education-flow/      # 등록교육 안내 플로우
│   │   │   └── page.tsx         # 교육 안내 페이지
│   │   └── components/          # 스마트위촉 전용 컴포넌트
│   │       ├── CalendarModal.tsx      # 캘린더 모달
│   │       ├── ResultPage.tsx         # 결과 페이지 컴포넌트
│   │       ├── TutorialOverlay.tsx    # 튜토리얼 오버레이
│   │       ├── application-flow/      # 신청 플로우 컴포넌트
│   │       │   ├── application-preview.tsx
│   │       │   ├── personal-info-form.tsx
│   │       │   ├── question-flow.tsx
│   │       │   └── submission-date-selector.tsx
│   │       └── education-flow/        # 교육 플로우 컴포넌트
│   │           └── education-question-flow.tsx
│   │
│   ├── page.tsx                 # 홈 페이지 (메인)
│   ├── page.css                 # 홈 페이지 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   ├── globals.css              # 전역 스타일
│   └── utils/                   # 유틸리티 함수
│       └── calculator.ts        # 계산 유틸리티
│
├── lib/                         # 공통 라이브러리
│   ├── types.ts                 # TypeScript 타입 정의
│   └── utils.ts                 # 공통 유틸리티 함수
│
├── public/                      # 정적 파일
│   ├── config.json              # 지원금 설정 파일
│   ├── data.json                # 스마트위촉 데이터 파일
│   ├── 404.html                 # 404 에러 페이지
│   └── [각 섹션별 정적 파일]
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages 배포 워크플로우
│
├── next.config.ts               # Next.js 설정
├── tailwind.config.ts           # Tailwind CSS 설정
├── tsconfig.json                # TypeScript 설정
├── package.json                 # 프로젝트 의존성
└── README.md                    # 프로젝트 문서
```

## 📄 페이지별 상세 정보

### 홈 페이지 (`/`)
- **파일 위치**: `app/page.tsx`
- **스타일**: `app/page.css`
- **기능**: 
  - Smart Link 메인 화면
  - 지원금, 금융캠퍼스, 스마트위촉 메뉴 카드 제공
  - 각 섹션으로 이동하는 네비게이션

### 지원금 섹션 (`/info-GR/`)

#### 지원금 메인 페이지 (`/info-GR/`)
- **파일 위치**: `app/info-GR/page.tsx`
- **스타일**: `app/info-GR/info-GR.css`
- **기능**: 정착교육비, 활동수수료, 영업관리자 지원금 메뉴 제공

#### 정착교육비 (`/info-GR/settlement-education`)
- **파일 위치**: `app/info-GR/settlement-education/page.tsx`
- **스타일**: `app/info-GR/settlement-education/UserPage.css`
- **기능**:
  - 연소득 입력 및 지원금 계산
  - 목표 옵션 선택 (12개월/18개월/24개월)
  - 목표업적 및 중간목표 표시
- **데이터**: `public/config.json`의 `settlementEducation` 섹션

**계산 로직** (`app/utils/calculator.ts`):
1. **지원금 계산**:
   - 연소득을 입력받아 `config.json`의 `incomeRanges`에서 해당 구간 찾기
   - 구간별 비율 적용:
     - 2천만원 ~ 3천9백9십9만원: 20%
     - 4천만원 ~ 6천9백9십9만원: 30%
     - 7천만원 이상: 40%
   - 지원금 = 연소득 × 비율
   - 예: 연소득 5천만원 → 5천만원 × 30% = 1,500만원

2. **목표업적 계산** (`calculateIntermediateGoals` 함수):
   - 선택한 옵션에 따라 최종 목표 및 중간목표 계산
   - **Option-1 (12개월, 60%)**:
     - 최종 목표 = 지원금 × 60%
     - 1차 중간목표 (3개월): 최종 목표 × 25%
     - 2차 중간목표 (6개월): 최종 목표 × 50%
   - **Option-2 (18개월, 70%)**:
     - 최종 목표 = 지원금 × 70%
     - 1차 중간목표 (6개월): 최종 목표 × 33%
     - 2차 중간목표 (12개월): 최종 목표 × 67%
   - **Option-3 (24개월, 80%)**:
     - 최종 목표 = 지원금 × 80%
     - 1차 중간목표 (6개월): 최종 목표 × 25%
     - 2차 중간목표 (12개월): 최종 목표 × 50%
     - 3차 중간목표 (18개월): 최종 목표 × 75%

#### 활동수수료 (`/info-GR/activity-fee`)
- **파일 위치**: `app/info-GR/activity-fee/page.tsx`
- **스타일**: `app/info-GR/activity-fee/page.css`
- **기능**:
  - 활동수수료 I (소득무관) / II (소득 2천만원↑) 탭 전환
  - 지원내용 및 예시 안내
  - 필수 안내사항 표시
  - 활동수수료 II의 경우 정착교육비 한도 확인 기능
- **데이터**: `public/config.json`의 `activityFee` 섹션

**계산 로직**:
- **활동수수료 I (50%형)**:
  - 지급률: 정산평가업적의 50%
  - 지급기간: 12개월
  - 총 지원한도: 2,000만원
  - 예: 매월 정산평가업적 100만원 → 50만원 × 12개월 = 600만원 (한도 내)
  
- **활동수수료 II (100%형)**:
  - 지급률: 정산평가업적의 100%
  - 지급기간: 24개월
  - 지원 한도: 정착교육비 지원 한도 내
  - 한도 확인: 모달에서 연소득 입력 시 정착교육비 지원금 계산
  - 예: 매월 정산평가업적 100만원 → 100만원 × 24개월 = 2,400만원 (정착교육비 한도 내에서만 지급)
  
- **한도 계산**: 활동수수료 II의 경우 `calculateSupport` 함수를 사용하여 정착교육비 지원금을 계산하고, 그 금액이 한도가 됩니다.

#### 영업관리자 지원금 (`/info-GR/m-project`)
- **파일 위치**: `app/info-GR/m-project/page.tsx`
- **스타일**: `app/info-GR/m-project/page.css`
- **기능**:
  - 위임 자격 확인 (직급, 동반위촉인원, 본인 소득, 산하조직소득)
  - Grade 기준 확인 모달
  - 지원금 안내 및 연간업적목표 표시
- **데이터**: `public/config.json`의 `mProject` 섹션

**계산 로직** (`checkQualification` 함수):

1. **자격 기준 확인** (`qualificationCriteria`):
   - **본부장**: 본인 소득 8천만원 이상, 동반위촉인원 30명 이상
   - **사업단장**: 본인 소득 6천만원 이상, 동반위촉인원 15명 이상
   - **지점장**: 본인 소득 4천만원 이상, 동반위촉인원 4명 이상

2. **Grade 계산** (`gradeCriteria`):
   - 산하조직소득합계(본인포함)를 기준으로 등급 결정
   - **본부장**:
     - S등급: 15억원 이상
     - A등급: 12억원 이상
     - B등급: 9억6천만원 이상
   - **사업단장**:
     - S등급: 6억원 이상
     - A등급: 4억8천만원 이상
     - B등급: 3억6천만원 이상
   - **지점장**:
     - S등급: 2억5천만원 이상
     - A등급: 2억원 이상
     - B등급: 1억5천만원 이상
     - C등급: 1억2천만원 이상 (미달 처리)

3. **지원금 계산** (`supportCriteria`):
   - Grade에 따라 기본 지원금 결정
   - **본부장**:
     - S등급: 월 800만원 × 12개월 = 총 9,600만원
     - A등급: 월 700만원 × 12개월 = 총 8,400만원
     - B등급: 월 500만원 × 12개월 = 총 6,000만원
   - **사업단장**:
     - S등급: 월 700만원 × 12개월 = 총 8,400만원
     - A등급: 월 500만원 × 12개월 = 총 6,000만원
     - B등급: 월 400만원 × 12개월 = 총 4,800만원
   - **지점장**:
     - S등급: 월 500만원 × 12개월 = 총 6,000만원
     - A등급: 월 400만원 × 12개월 = 총 4,800만원
     - B등급: 월 300만원 × 12개월 = 총 3,600만원
     - C등급: 월 200만원 × 12개월 = 총 2,400만원

4. **추가지급** (S등급, A등급만):
   - 본인 직전 1년 소득의 10% 추가 지급
   - 예: 본인 소득 1억원, S등급 → 기본 지원금 + 1,000만원 (추가지급)
   - 총 지원금 = 기본 지원금 + 추가지급

### 금융캠퍼스 섹션 (`/info-gfe/`)
- **파일 위치**: `app/info-gfe/page.tsx`
- **스타일**: `app/info-gfe/info-gfe.css`
- **기능**:
  - 금융캠퍼스 / 베이직 탭 전환
  - 조건, 지원나이, 혜택 안내
  - DB선택형/DB미선택형 옵션 (금융캠퍼스)
  - 지원금 및 DB 내용 표시

### 스마트위촉 섹션 (`/info-appoint/`)

#### 스마트위촉 메인 페이지 (`/info-appoint/`)
- **파일 위치**: `app/info-appoint/page.tsx`
- **기능**:
  - 위촉 체크리스트 관리
  - 수요일 기준 날짜 선택 (캘린더)
  - 위촉일정 조회 및 결과 표시
  - 전체 일정 캘린더 모달
  - 튜토리얼 오버레이 (최초 방문 시)
- **데이터**: `public/data.json`

#### 위촉일정 결과 페이지 (`/info-appoint/result`)
- **파일 위치**: `app/info-appoint/result/page.tsx`
- **기능**: 선택한 날짜의 위촉일정 상세 표시 및 PDF 저장

#### 등록교육 신청 플로우 (`/info-appoint/application-flow`)
- **파일 위치**: `app/info-appoint/application-flow/page.tsx`
- **기능**: 등록교육 신청을 위한 단계별 플로우

#### 등록교육 안내 플로우 (`/info-appoint/education-flow`)
- **파일 위치**: `app/info-appoint/education-flow/page.tsx`
- **기능**: 등록교육 안내를 위한 단계별 플로우

## 🧩 주요 컴포넌트

### 공통 컴포넌트 (`app/components/`)

#### `BottomNavigation.tsx`
- **위치**: `app/components/BottomNavigation.tsx`
- **기능**: 하단 고정 네비게이션 바
- **사용 페이지**: 모든 페이지 (레이아웃에 포함)

#### `SupportCard.tsx`
- **위치**: `app/components/SupportCard.tsx`
- **기능**: 지원 카드 컴포넌트 (아이콘, 제목, 설명)
- **사용 페이지**: 홈 페이지, 지원금 메인 페이지

#### `calendar-modal.tsx`
- **위치**: `app/components/calendar-modal.tsx`
- **기능**: 전체 일정 캘린더 모달
  - PC: 그리드 캘린더 뷰
  - 모바일: Agenda 리스트 뷰
  - 오늘 날짜로 자동 스크롤
  - 스크롤 시에도 닫기 버튼 고정 (sticky 헤더)

#### `result-page.tsx`
- **위치**: `app/components/result-page.tsx`
- **기능**: 위촉일정 결과 표시 컴포넌트

#### `NavigationHeader.tsx`
- **위치**: `app/components/NavigationHeader.tsx`
- **기능**: 네비게이션 헤더 컴포넌트

#### `tutorial-overlay.tsx`
- **위치**: `app/components/tutorial-overlay.tsx`
- **기능**: 튜토리얼 오버레이 (최초 방문 가이드)

### UI 컴포넌트 (`app/components/ui/`)
- ShadCN UI 기반 컴포넌트들
- Radix UI를 사용한 접근성 고려 컴포넌트
- Tailwind CSS로 스타일링

## 📊 데이터 파일

### `public/config.json`
- **용도**: 지원금 관련 설정 데이터
- **구조**:
  - `incomeRanges`: 소득 구간별 지원 비율 (정착교육비, 활동수수료 공통)
    - `minIncome`: 최소 소득 (원 단위)
    - `maxIncome`: 최대 소득 (원 단위, null이면 무제한)
    - `percentage`: 지원 비율 (%)
  - `settlementEducation`: 정착교육비 설정
  - `activityFee`: 활동수수료 설정
  - `mProject`: 영업관리자 지원금 설정
    - `qualificationCriteria`: 직급별 자격 기준 (소득, 인원)
    - `gradeCriteria`: 직급별 Grade 기준 (산하조직소득)
    - `supportCriteria`: 직급별 Grade별 지원금 (월액, 연액, 총액)
- **수정 방법**: 파일 직접 수정 또는 구글 시트 연동 (향후)

### `app/utils/calculator.ts`
- **위치**: `app/utils/calculator.ts`
- **용도**: 지원금 계산 유틸리티 함수
- **주요 함수**:
  - `getIncomePercentage(income, incomeRanges)`: 소득 구간에 따른 지원 비율 반환
    - 소득이 해당하는 구간을 찾아 비율 반환
    - 구간에 없으면 0 반환
  - `calculateSupport(income, config)`: 최종 지원금 계산
    - 소득 × 비율로 지원금 계산
    - 반환값: `{ amount, percentage, income }`
  - `formatCurrency(amount)`: 숫자를 원화 형식으로 포맷 (예: "₩1,000,000")
  - `formatNumber(number)`: 숫자를 천단위 구분 형식으로 포맷 (예: "1,000,000")

### `public/data.json`
- **용도**: 스마트위촉 일정 데이터
- **구조**:
  - `requiredDocuments`: 필수 서류 목록
  - `checklist`: 체크리스트 항목
  - `schedules`: 위촉 일정 데이터
  - `calendarEvents`: 캘린더 이벤트 데이터
- **수정 방법**: 파일 직접 수정 또는 구글 시트 연동 (향후)

## 🚀 로컬 개발

### 필수 요구사항
- Node.js 20 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 파일은 out/ 디렉토리에 생성됩니다
```

### 개발 팁

1. **스타일 수정**: 각 페이지의 CSS 파일을 수정하세요
   - 지원금: `app/info-GR/info-GR.css` 및 각 하위 페이지 CSS
   - 금융캠퍼스: `app/info-gfe/info-gfe.css`
   - 스마트위촉: Tailwind CSS 클래스 사용

2. **데이터 수정**: 
   - 지원금 데이터: `public/config.json`
   - 스마트위촉 데이터: `public/data.json`

3. **새 페이지 추가**: `app/` 디렉토리 하위에 폴더 생성 후 `page.tsx` 파일 추가

## 📦 배포

### GitHub Pages 자동 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다.

#### 배포 설정

1. GitHub 저장소의 **Settings** > **Pages**로 이동
2. **Source**를 **GitHub Actions**로 선택
3. `main` 브랜치에 푸시하면 자동으로 배포됩니다

#### 배포 워크플로우

- **파일 위치**: `.github/workflows/deploy.yml`
- **동작**: 
  - `main` 브랜치에 푸시 시 자동 실행
  - Node.js 20 환경에서 빌드
  - `out/` 디렉토리를 GitHub Pages에 배포

#### 배포 URL

배포 후 다음 URL에서 접근 가능합니다:
- `https://kim01033226699-lgtm.github.io/smartlink/`

#### basePath 설정

프로덕션 환경에서는 `next.config.ts`의 `basePath`가 `/smartlink`로 설정되어 있습니다.
로컬 개발 시에는 빈 문자열로 설정되어 있어 `http://localhost:3000`에서 바로 접근 가능합니다.

## 🛠 기술 스택

### 프레임워크 및 라이브러리
- **Next.js 16**: React 프레임워크 (App Router)
- **React 19**: UI 라이브러리
- **TypeScript 5.9**: 타입 안정성
- **Tailwind CSS 3.4**: 유틸리티 기반 CSS
- **date-fns 4.1**: 날짜 처리 라이브러리

### UI 컴포넌트
- **Radix UI**: 접근성 고려 컴포넌트
  - `@radix-ui/react-dialog`: 모달/다이얼로그
  - `@radix-ui/react-popover`: 팝오버
  - `@radix-ui/react-checkbox`: 체크박스
  - `@radix-ui/react-label`: 라벨
- **ShadCN UI**: 컴포넌트 라이브러리 (Radix UI 기반)
- **Lucide React**: 아이콘 라이브러리
- **react-day-picker**: 날짜 선택 컴포넌트

### 유틸리티
- **class-variance-authority**: 컴포넌트 variant 관리
- **clsx**: 조건부 클래스명
- **tailwind-merge**: Tailwind 클래스 병합
- **html2canvas**: HTML to Canvas 변환
- **jspdf**: PDF 생성

### 개발 도구
- **PostCSS**: CSS 처리
- **Autoprefixer**: CSS 벤더 프리픽스 자동 추가

## 📝 파일 수정 가이드

### 스타일 수정 시
1. **페이지별 스타일**: 각 페이지 폴더의 CSS 파일 수정
2. **전역 스타일**: `app/globals.css` 수정
3. **컴포넌트 스타일**: 컴포넌트 파일 내 인라인 스타일 또는 CSS 파일 수정

### 데이터 수정 시
1. **지원금 데이터**: `public/config.json` 수정
2. **스마트위촉 데이터**: `public/data.json` 수정
3. 수정 후 개발 서버 재시작 또는 새로고침

### 새 기능 추가 시
1. `app/` 디렉토리 하위에 새 폴더 생성
2. `page.tsx` 파일 생성
3. 필요시 컴포넌트 및 스타일 파일 추가
4. 라우팅은 폴더 구조에 따라 자동 생성됨

## 🔗 관련 레포지토리

- **스마트위촉 상세**: [appoint_info](https://github.com/kim01033226699-lgtm/appoint_info)
  - 스마트위촉 페이지와 동일한 내용을 별도 레포지토리로 관리

## 📞 문의

프로젝트 관련 문의사항은 담당 부서로 연락주시기 바랍니다.

---

**Smart Link** - Start Good, Grow Rich! 🚀
