import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4186;
const URL = `http://localhost:${PORT}/bell/work/`;

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const width of [1440, 390]) for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: 'networkidle' });
      const foot = page.locator('footer');
      await foot.scrollIntoViewIfNeeded();
      await page.locator('footer ul a').first().focus();
      await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
      await page.waitForTimeout(400);
      const box = (await foot.boundingBox())!;
      await page.screenshot({ path: `${OUT}/footer-inverse-${width}-${scheme}.png`, fullPage: true, clip: { x: 0, y: box.y - 80 + (await page.evaluate(() => window.scrollY)), width, height: box.height + 200 } });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}
main();
