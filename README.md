# Smart Link

굿리치 통합 정보 시스템 - Start Good, Grow Rich!

## 프로젝트 구조

- **지원금 (info-GR)**: 정착교육비, 활동수수료 등 안내
- **금융캠퍼스 (info-gfe)**: 무경력 신입 지원 프로그램
- **스마트위촉 (info-appoint)**: 원스톱위촉안내

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## Google Analytics 설정

방문자 추적을 위해 Google Analytics 4 (GA4)가 통합되어 있습니다.

### 설정 방법

1. **Google Analytics 계정 생성**
   - [Google Analytics](https://analytics.google.com/)에서 계정 생성
   - 새 속성(Property) 생성 (GA4)
   - Measurement ID 확인 (형식: `G-XXXXXXXXXX`)

2. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   cp .env.local.example .env.local

   # .env.local 파일에 Measurement ID 입력
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

### 프로덕션 배포

GitHub Pages에서도 Analytics가 작동하려면:
- GitHub 저장소 Settings > Secrets and variables > Actions
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` 추가

또는 빌드 시 환경 변수 직접 설정:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

### 확인 방법

1. 개발 서버 실행 후 페이지 방문
2. 브라우저 개발자 도구 > Network 탭에서 `google-analytics` 요청 확인
3. Google Analytics 대시보드에서 실시간 방문자 확인

## appoint_info 동기화

스마트위촉(info-appoint)의 변경사항을 appoint_info 프로젝트에 자동으로 동기화할 수 있습니다.

### 자동 동기화 (Git Hook)

info-appoint 관련 파일을 수정하고 커밋하면, **자동으로 동기화 여부를 물어봅니다**.

1. info-appoint 파일 수정
2. GitHub Desktop에서 커밋
3. → "appoint_info에 동기화할까요?" 프롬프트
4. `y` 입력 시 자동 동기화
5. appoint_info 폴더에서 변경사항 확인 후 별도 커밋/푸시

### 수동 동기화

```bash
# 수동으로 동기화하려면
npm run sync
```

### 동기화되는 항목

- `app/info-appoint/` → `appoint_info/components/`
- `public/data.json` → `appoint_info/public/data.json`
- 경로 및 함수명 자동 변환

## 배포

이 프로젝트는 GitHub Pages를 통해 자동 배포됩니다.

### 배포 설정

1. GitHub 저장소의 **Settings** > **Pages**로 이동
2. **Source**를 **GitHub Actions**로 선택
3. `main` 브랜치에 푸시하면 자동으로 배포됩니다

### 배포 URL

배포 후 다음 URL에서 접근 가능합니다:
- `https://[username].github.io/smartlink/`

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS (사용 시)

## 데이터 로딩 방식

이 프로젝트는 **클라이언트에서 직접 Google Sheets를 가져오는 방식**을 사용합니다.

### 작동 원리

1. **Google Sheets에 일정 등록**: 관리자가 Google Sheets에 일정을 직접 등록합니다.
2. **자동 데이터 로딩**: 사용자가 페이지를 열면 브라우저에서 Google Sheets의 CSV 데이터를 직접 가져옵니다.
3. **실시간 반영**: Google Sheets를 업데이트하면 페이지를 새로고침하면 즉시 반영됩니다.

### 장점

- ✅ **별도의 서버나 API 불필요**: GitHub Pages 같은 정적 호스팅에서도 작동합니다.
- ✅ **자동 동기화**: Google Sheets를 업데이트하면 자동으로 반영됩니다.
- ✅ **간단한 워크플로우**: 중간에 별도의 업데이트 작업이 필요 없습니다.

### Google Sheets 설정

Google Sheets가 **공개로 설정**되어 있어야 합니다:
- 파일 > 공유 > "링크가 있는 모든 사용자" 선택
- CSV 형식으로 내보내기 가능해야 함

### 데이터 구조

Google Sheets는 다음 시트를 포함해야 합니다:
- **입력**: 위촉 일정 데이터
- **위촉문자**: 보험사별 위촉 정보
- **설정**: 체크리스트 및 안내 문구

