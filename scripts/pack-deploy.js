/**
 * 배포용 최소 파일만 .build/deploy/ 폴더에 모음.
 * 실행: npm run build 후 npm run deploy:prepare (또는 npm run deploy)
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, '.build', 'dist');
const deployDir = path.join(root, '.build', 'deploy');

if (!fs.existsSync(distDir)) {
  console.error('.build/dist 없음. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}

fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });

fs.cpSync(distDir, path.join(deployDir, 'dist'), { recursive: true });

// 배포 패킷 안에서는 dist/ 가 최상위이므로 start:prod 경로를 패킷 기준으로 재작성한다.
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
);
pkg.scripts['start:prod'] = 'node dist/main';
fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(pkg, null, 2) + '\n',
);
if (fs.existsSync(path.join(root, 'package-lock.json'))) {
  fs.copyFileSync(
    path.join(root, 'package-lock.json'),
    path.join(deployDir, 'package-lock.json'),
  );
}

const frontendDist = path.join(root, 'frontend', 'dist');
if (!fs.existsSync(frontendDist)) {
  console.error('frontend/dist 없음. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}
fs.cpSync(frontendDist, path.join(deployDir, 'frontend', 'dist'), {
  recursive: true,
});

console.log(
  '배포 패킷 준비됨: .build/deploy/  (dist + frontend/dist + package.json)',
);
console.log('');
console.log('배포 서버에서:');
console.log('  1. .build/deploy/ 를 서버에 복사');
console.log('  2. npm install --production');
console.log('  3. node dist/main (또는 PORT=3000 node dist/main)');
