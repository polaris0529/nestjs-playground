
/**
 * 배포용 최소 파일만 deploy/ 폴더에 모음.
 * 실행: npm run build 후 npm run deploy:prepare (또는 npm run deploy)
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const deployDir = path.join(root, 'deploy');

if (!fs.existsSync(path.join(root, 'dist'))) {
  console.error('dist 없음. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}

fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });

fs.cpSync(path.join(root, 'dist'), path.join(deployDir, 'dist'), { recursive: true });
fs.copyFileSync(path.join(root, 'package.json'), path.join(deployDir, 'package.json'));
if (fs.existsSync(path.join(root, 'package-lock.json'))) {
  fs.copyFileSync(path.join(root, 'package-lock.json'), path.join(deployDir, 'package-lock.json'));
}

// 런타임에 필요한 정적 자산 / hbs 뷰 템플릿 포함
for (const dir of ['views', 'public']) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(deployDir, dir), { recursive: true });
  }
}

console.log('배포 패킷 준비됨: deploy/  (dist + views + public + package.json)');
console.log('');
console.log('배포 서버에서:');
console.log('  1. deploy/ 를 서버에 복사');
console.log('  2. npm install --production');
console.log('  3. node dist/main (또는 PORT=3000 node dist/main)');
