import { chromium, type Browser, type Page } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4183;
const BASE = `http://localhost:${PORT}`;
const PAGES = [['landing', '/bell/'], ['practice', '/bell/practice/'], ['vantage', '/bell/vantage/']] as const;

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function settle(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);
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
      for (const [name, path] of PAGES) {
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
        await settle(page);
        await page.screenshot({ path: `${OUT}/pages-${name}-${width}.png`, fullPage: true });
      }
      const hops: string[] = [];
      page.on('framenavigated', (f) => { if (f === page.mainFrame()) hops.push(new URL(f.url()).pathname + new URL(f.url()).hash); });
      await page.goto(`${BASE}/bell/#vantage`).catch(() => {});
      await page.waitForTimeout(1500);
      console.log(width, 'old anchor hops:', hops.slice(0, 2).join(' -> '));
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}
main();
