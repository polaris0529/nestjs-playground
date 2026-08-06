import { test, expect } from '@playwright/test';

// Blueprint Console 테마가 모든 핵심 페이지에 적용됐는지 검증한다.
// 쿠퍼 시그널(#E07B39 = rgb(224, 123, 57)) + 잉크 네이비 + 모노/Inter 폰트.
const COPPER = 'rgb(224, 123, 57)';

test.describe('Blueprint Console theme', () => {
  test('login: Google Fonts 로드 + Inter 본문', async ({ page }) => {
    await page.goto('/login');

    // 웹폰트 스타일시트 link 가 head 에 존재한다.
    const fontLink = page.locator(
      'link[rel="stylesheet"][href*="fonts.googleapis.com/css2"]',
    );
    await expect(fontLink).toHaveCount(1);

    // 본문 폰트가 Inter 로 설정됐다.
    const bodyFont = await page.evaluate(
      () => getComputedStyle(document.body).fontFamily,
    );
    expect(bodyFont).toContain('Inter');

    await page.screenshot({
      path: 'e2e/__screenshots__/login.png',
      fullPage: true,
    });
  });

  test('portfolio: 쿠퍼 시그널 + 모노 브랜드 적용', async ({ page }) => {
    await page.goto('/');

    // --color-primary 토큰이 쿠퍼로 치환됐다 (Bootstrap 블루 잔존 없음).
    const primary = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim(),
    );
    expect(primary.toUpperCase()).toBe('#E07B39');

    // 주 액션 버튼(관리자 로그인)이 쿠퍼 배경이다.
    const cta = page.locator('a.btn-primary').first();
    await expect(cta).toHaveCSS('background-color', COPPER);

    // 포트폴리오 role 텍스트가 쿠퍼색이다.
    const role = page.locator('.portfolio-role').first();
    await expect(role).toHaveCSS('color', COPPER);

    // 브랜드 워드마크가 모노스페이스(IBM Plex Mono)다.
    const brandFont = await page
      .locator('.app-header .brand')
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(brandFont).toContain('IBM Plex Mono');

    await page.screenshot({
      path: 'e2e/__screenshots__/portfolio.png',
      fullPage: true,
    });
  });
});
