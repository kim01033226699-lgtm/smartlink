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

