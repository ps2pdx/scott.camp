import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4185;
const URL = `http://localhost:${PORT}/bell/nertia/`;
const NAME = process.argv[2] ?? 'slit-inverse';

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: 'networkidle' });
      const plate = page.locator('[data-part="specimen-slit"]');
      await plate.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      const box = (await plate.locator('[role="img"]').boundingBox())!;
      for (let i = 0; i < 90; i++) {
        const t = i / 90;
        await page.mouse.move(box.x + box.width * (0.35 + 0.3 * Math.sin(t * Math.PI * 2)), box.y + box.height * 0.25);
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(1500);
      await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.3);
      await page.waitForTimeout(200);
      await plate.screenshot({ path: `${OUT}/${NAME}-${scheme}.png` });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}
main();
