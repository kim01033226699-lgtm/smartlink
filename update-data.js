#!/usr/bin/env node

/**
 * Google Sheets에서 최신 데이터를 가져와서 양쪽 프로젝트에 반영
 *
 * 사용법: node update-data.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SMARTLINK_ROOT = __dirname;
const APPOINT_INFO_ROOT = path.join(__dirname, '..', 'appoint_info');

console.log('🔄 Google Sheets에서 최신 데이터 가져오기 시작...\n');

try {
  // 1. appoint_info에서 데이터 가져오기
  console.log('1️⃣ appoint_info에서 Google Sheets 데이터 가져오는 중...');
  execSync('npm run fetch-data', {
    cwd: APPOINT_INFO_ROOT,
    stdio: 'inherit'
  });
  console.log('   ✅ 데이터 가져오기 완료\n');

  // 2. data.json을 smartlink로 복사
  console.log('2️⃣ smartlink로 data.json 복사 중...');
  const dataJsonSource = path.join(APPOINT_INFO_ROOT, 'public', 'data.json');
  const dataJsonDest = path.join(SMARTLINK_ROOT, 'public', 'data.json');

  if (fs.existsSync(dataJsonSource)) {
    fs.copyFileSync(dataJsonSource, dataJsonDest);

    // 파일 정보 확인
    const stats = fs.statSync(dataJsonDest);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ data.json 복사 완료 (${sizeKB}KB)\n`);
  } else {
    throw new Error('data.json 파일을 찾을 수 없습니다');
  }

  // 3. 통계 출력
  console.log('3️⃣ 업데이트된 데이터 확인 중...');
  const data = JSON.parse(fs.readFileSync(dataJsonDest, 'utf8'));
  console.log(`   - 위촉일정: ${data.schedules.length}개 차수`);
  console.log(`   - 캘린더 이벤트: ${data.calendarEvents.length}개`);
  console.log(`   - 체크리스트: ${data.checklist.length}개 항목`);

  // 최신 차수 확인
  const latestSchedule = data.schedules[data.schedules.length - 1];
  console.log(`   - 최신 차수: ${latestSchedule.round} (${latestSchedule.gpOpenDate})`);

  console.log('\n✨ 모든 작업 완료!\n');
  console.log('📝 다음 단계:');
  console.log('   1. 브라우저에서 페이지 새로고침 (F5)');
  console.log('   2. 변경사항 확인');
  console.log('   3. 커밋 및 푸시:\n');
  console.log('      cd appoint_info');
  console.log('      git add public/data.json');
  console.log('      git commit -m "Update: 최신 위촉일정 데이터"');
  console.log('      git push\n');
  console.log('      cd ../smartlink');
  console.log('      git add public/data.json');
  console.log('      git commit -m "Update: 최신 위촉일정 데이터"');
  console.log('      git push');
  console.log('');

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
