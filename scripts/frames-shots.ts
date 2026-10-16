import { chromium, type Browser, type Page } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4181;
const BASE = `http://localhost:${PORT}`;

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function to(page: Page, sel: string, pad = 120) {
  await page.locator(sel).first().evaluate((n, p) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - p), pad);
  await page.waitForTimeout(500);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    for (const width of [1440, 1024, 390]) for (const mode of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, deviceScaleFactor: width === 390 ? 2 : 1, hasTouch: width === 390, isMobile: width === 390 });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/bell/design-system/`, { waitUntil: 'networkidle' });
      await to(page, '[data-part="ds-book"]', 130);
      await page.screenshot({ path: `${OUT}/frames-${width}-${mode}.png` });
      if (width === 1440) {
        const box = (await page.locator('[data-part="ds-book-main"] img').first().boundingBox())!;
        await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.55);
        await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.6, { steps: 4 });
        await page.waitForTimeout(600);
        await page.screenshot({ path: `${OUT}/frames-${width}-${mode}-hover.png` });
        await page.mouse.move(5, 5);
        await page.locator('[data-part="ds-contact-sheet"] button[data-frame="IMG_2983"]').click();
        await page.waitForTimeout(600);
        await to(page, '[data-part="ds-book"]', 130);
        const b2 = (await page.locator('[data-part="ds-book-main"] img').first().boundingBox())!;
        await page.mouse.move(b2.x + b2.width * 0.5, b2.y + b2.height * 0.3, { steps: 4 });
        await page.waitForTimeout(600);
        await page.screenshot({ path: `${OUT}/frames-${width}-${mode}-hover-portrait.png` });
      }
      await to(page, '[data-part="ds-contact-sheet"]', 200);
      await page.screenshot({ path: `${OUT}/frames-${width}-${mode}-clump.png` });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}
main();
