import { chromium, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4184;
const URL = `http://localhost:${PORT}/bell/nertia/`;

async function launch(): Promise<Browser> {
  try { return await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light', deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const js: string[] = [];
      page.on('request', (r) => { if (r.url().endsWith('.js')) js.push(r.url().split('/').pop()!); });
      await page.goto(URL, { waitUntil: 'networkidle' });
      console.log(width, 'ring chunk at load:', js.some((f) => f.startsWith('ButterflyRing')));
      const ev = page.locator('[data-part="zero-point-evolution"]');
      await ev.scrollIntoViewIfNeeded();
      await page.locator('[data-part="specimen-butterfly"]').scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      console.log(width, 'ring chunk near the plate:', js.some((f) => f.startsWith('ButterflyRing')), js.some((f) => f.startsWith('butterfly-ring-vertices')));
      const top = await ev.evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      const bottom = await page.locator('[data-part="specimen-butterfly"]').evaluate((e) => e.getBoundingClientRect().bottom + window.scrollY);
      await page.evaluate((y) => window.scrollTo(0, y), top - 160);
      await page.waitForTimeout(300);
      const brand = await page.locator('[data-part="brand-generator"]').evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      await page.screenshot({ path: `${OUT}/evolution-${width}.png`, fullPage: true, clip: { x: 0, y: top - 160, width, height: brand - top + 200 } });
      if (width === 1440) {
        const stage = page.locator('[data-part="specimen-butterfly"] [role="img"]');
        await stage.scrollIntoViewIfNeeded();
        const box = (await stage.boundingBox())!;
        const y0 = await page.evaluate(() => window.scrollY);
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(0, 200); await page.waitForTimeout(300);
        const y1 = await page.evaluate(() => window.scrollY);
        await stage.scrollIntoViewIfNeeded();
        const b2 = (await stage.boundingBox())!;
        await page.mouse.click(b2.x + 20, b2.y + 20);
        const y2 = await page.evaluate(() => window.scrollY);
        await page.mouse.wheel(0, 200); await page.waitForTimeout(300);
        const y3 = await page.evaluate(() => window.scrollY);
        console.log('wheel before click scrolls the page:', y1 > y0, '; after click it zooms instead:', y3 === y2);
        await page.mouse.move(5, 5);
        await page.waitForTimeout(1200);
        for (const scheme of ['dark', 'light'] as const) {
          await page.evaluate((s) => document.documentElement.setAttribute('data-theme', s), scheme);
          await page.waitForTimeout(800);
          await page.locator('[data-part="specimen-butterfly"]').screenshot({ path: `${OUT}/specimens-butterfly-three-${width}${scheme === 'dark' ? '' : '-light'}.png` });
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}
main();
