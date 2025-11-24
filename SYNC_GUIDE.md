# smartlink ↔ appoint_info 동기화 가이드

## 개요

- **smartlink/app/info-appoint**: 관리자용 (최신 버전, 수정 작업용)
- **appoint_info**: 사용자 공개용 (자동 동기화)

## 작업 흐름

### 1. smartlink에서 수정 작업

```bash
cd smartlink

# 개발 서버 실행
npm run dev

# app/info-appoint/ 폴더에서 수정 작업
```

### 2. appoint_info로 동기화

```bash
# smartlink 폴더에서 실행
npm run sync
```

**동기화되는 파일:**
- ✅ `public/data.json` → appoint_info/public/data.json
- ✅ `app/info-appoint/page.tsx` → appoint_info/components/main-page.tsx
- ✅ `app/info-appoint/components/ResultPage.tsx` → appoint_info/components/result-page.tsx
- ✅ `app/info-appoint/types.ts` → appoint_info/lib/types.ts

**자동 수정 사항:**
- import 경로 변경 (`@/app/components/` → `@/components/`)
- router.push 경로 수정
- 함수명 변경 (InfoAppointPage → MainPage)

### 3. 각 프로젝트 커밋 & 푸시

```bash
# smartlink 커밋
cd smartlink
git add .
git commit -m "Update: 스마트위촉 수정"
git push

# appoint_info 커밋
cd ../appoint_info
git add .
git commit -m "Sync: smartlink에서 동기화"
git push
```

## 주의사항

⚠️ **appoint_info에서 직접 수정하지 마세요!**
- 항상 smartlink에서 수정 → sync 스크립트로 동기화

⚠️ **data.json 업데이트**
- appoint_info에서 `npm run fetch-data` 실행 후
- smartlink로 복사하거나, smartlink에서 직접 업데이트

## 문제 해결

### 동기화 후 에러 발생 시

1. appoint_info에서 빌드 테스트:
   ```bash
   cd appoint_info
   npm run build
   ```

2. 에러 확인 후 smartlink에서 수정

3. 다시 동기화

### data.json 최신화

```bash
# appoint_info에서
cd appoint_info
npm run fetch-data

# smartlink로 복사
cp public/data.json ../smartlink/public/data.json
```
