import { chromium, type Browser, type Page } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4182;
const BASE = `http://localhost:${PORT}`;

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function to(page: Page, sel: string, pad: number) {
  await page.locator(sel).first().evaluate((n, p) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - p), pad);
  await page.waitForTimeout(500);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  const cal: string[] = [];
  try {
    for (const width of [1440, 390]) for (const mode of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, deviceScaleFactor: width === 390 ? 2 : 1 });
      const page = await ctx.newPage();
      page.on('request', (r) => { if (r.url().includes('cal.com')) cal.push(r.url()); });
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      if (mode === 'light') await page.screenshot({ path: `${OUT}/cover-links-${width}.png` });
      await page.goto(`${BASE}/bell/contact/`, { waitUntil: 'networkidle' });
      await to(page, '#contact [data-part="portrait"]', 130);
      if (mode === 'light') await page.screenshot({ path: `${OUT}/contact-${width}.png` });
      await to(page, '#contact [data-part="booking"]', width === 390 ? 260 : 300);
      await page.screenshot({ path: `${OUT}/contact-book-${width}-${mode}.png` });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log('cal requests before click:', cal.length);
}
main();
