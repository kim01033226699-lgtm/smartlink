#!/usr/bin/env node

/**
 * smartlink의 info-appoint를 appoint_info로 동기화하는 스크립트
 *
 * 사용법: node sync-to-appoint.js
 */

const fs = require('fs');
const path = require('path');

const SMARTLINK_ROOT = __dirname;
const APPOINT_INFO_ROOT = path.join(__dirname, '..', 'appoint_info');

console.log('🔄 smartlink → appoint_info 동기화 시작...\n');

// 1. data.json 복사
console.log('1️⃣ data.json 복사 중...');
const dataJsonSource = path.join(SMARTLINK_ROOT, 'public', 'data.json');
const dataJsonDest = path.join(APPOINT_INFO_ROOT, 'public', 'data.json');

if (fs.existsSync(dataJsonSource)) {
  fs.copyFileSync(dataJsonSource, dataJsonDest);
  console.log('   ✅ data.json 복사 완료');
} else {
  console.log('   ⚠️  data.json을 찾을 수 없습니다');
}

// 2. 컴포넌트 동기화
console.log('\n2️⃣ 컴포넌트 동기화 중...');

// ResultPage.tsx 복사 및 경로 수정
const resultPageSource = path.join(SMARTLINK_ROOT, 'app', 'info-appoint', 'components', 'ResultPage.tsx');
const resultPageDest = path.join(APPOINT_INFO_ROOT, 'components', 'result-page.tsx');

if (fs.existsSync(resultPageSource)) {
  let content = fs.readFileSync(resultPageSource, 'utf8');

  // import 경로 수정
  content = content
    .replace(/from "@\/app\/components\//g, 'from "@/components/')
    .replace(/from "@\/app\/info-appoint\/types"/g, 'from "@/lib/types"')
    .replace(/router\.push\("\/info-appoint"\)/g, 'router.push("/")');

  fs.writeFileSync(resultPageDest, content);
  console.log('   ✅ result-page.tsx 동기화 완료');
} else {
  console.log('   ⚠️  ResultPage.tsx를 찾을 수 없습니다');
}

// 메인 페이지 동기화
const mainPageSource = path.join(SMARTLINK_ROOT, 'app', 'info-appoint', 'page.tsx');
const mainPageDest = path.join(APPOINT_INFO_ROOT, 'components', 'main-page.tsx');

if (fs.existsSync(mainPageSource)) {
  let content = fs.readFileSync(mainPageSource, 'utf8');

  // import 경로 수정
  content = content
    .replace(/from "@\/app\/components\//g, 'from "@/components/')
    .replace(/from "@\/lib\/types"/g, 'from "@/lib/types"')
    .replace(/router\.push\("\/info-appoint\/application-flow"\)/g, 'router.push("/application-flow")')
    .replace(/router\.push\("\/info-appoint\/result/g, 'router.push("/result')
    // 함수명 변경
    .replace(/export default function InfoAppointPage\(\)/g, 'export default function MainPage()');

  fs.writeFileSync(mainPageDest, content);
  console.log('   ✅ main-page.tsx 동기화 완료');
} else {
  console.log('   ⚠️  page.tsx를 찾을 수 없습니다');
}

// 3. types 동기화
console.log('\n3️⃣ types 동기화 중...');
const typesSource = path.join(SMARTLINK_ROOT, 'app', 'info-appoint', 'types.ts');
const typesDest = path.join(APPOINT_INFO_ROOT, 'lib', 'types.ts');

if (fs.existsSync(typesSource)) {
  fs.copyFileSync(typesSource, typesDest);
  console.log('   ✅ types.ts 동기화 완료');
} else {
  console.log('   ⚠️  types.ts를 찾을 수 없습니다');
}

console.log('\n✨ 동기화 완료!\n');
console.log('📝 다음 단계:');
console.log('   1. appoint_info 프로젝트에서 변경사항 확인');
console.log('   2. 각 프로젝트를 개별적으로 커밋/푸시');
console.log('');
