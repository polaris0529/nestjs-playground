import { defineConfig, devices } from '@playwright/test';

// Blueprint Console 테마 검증용 Playwright 설정.
// 로컬 인스턴스(포트 3100)가 떠 있다고 가정한다.
export default defineConfig({
  testDir: './e2e',
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
