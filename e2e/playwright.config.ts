import { defineConfig, devices } from '@playwright/test';

// Blueprint Console 테마 검증용 Playwright 설정.
// 로컬 인스턴스(포트 3100)가 떠 있다고 가정한다.
export default defineConfig({
  testDir: './',
  // 실행 산출물은 루트가 아닌 .build/ 아래로 모은다.
  outputDir: '../.build/test-results',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3100',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
