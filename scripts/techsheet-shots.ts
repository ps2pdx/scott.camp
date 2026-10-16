import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const PORT = 4183;
async function main() {
  mkdirSync('.parity', { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const b = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  for (const width of [1440, 390]) for (const mode of ['dark', 'light'] as const) {
    const p = await (await b.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, deviceScaleFactor: 2 })).newPage();
    await p.goto(`http://localhost:${PORT}/bell/`, { waitUntil: 'networkidle' });
    const sliders = p.locator('[data-part="tech-slider"]');
    for (const [i, name] of [[0, 'nertia'], [1, 'work']] as const) {
      const sl = sliders.nth(i);
      await sl.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await sl.screenshot({ path: `.parity/techsheets-pass-${name}-${width}-${mode}.png` });
      for (let k = 1; k <= 3; k++) {
        const next = sl.getByRole('button', { name: 'Next' });
        if (await next.isDisabled()) break;
        await next.click();
        await p.waitForTimeout(700);
        await sl.screenshot({ path: `.parity/techsheets-pass-${name}-${width}-${mode}-next${k}.png` });
      }
    }
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > width) console.log(`overflow ${width} ${mode}: ${sw}`);
    await p.context().close();
  }
  await b.close();
  server.kill();
}
main().catch((e) => { console.error(e); process.exit(1); });
