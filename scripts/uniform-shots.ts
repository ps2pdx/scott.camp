import { chromium, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const tag = process.argv[2] ?? 'uniform';

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    for (const width of [1440, 390]) for (const mode of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: mode, deviceScaleFactor: width === 390 ? 2 : 1 });
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        (window as any).__cls = 0;
        new PerformanceObserver((l) => { for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      let imgBytes = 0;
      page.on('response', async (r) => { if (r.request().resourceType() === 'image') { const b = await r.body().catch(() => null); if (b) imgBytes += b.length; } });
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
      await page.waitForTimeout(400);
      const cls = await page.evaluate(() => (window as any).__cls);
      console.log(`${tag} ${width} ${mode} cls=${cls.toFixed(4)} imgKB=${Math.round(imgBytes / 1024)}`);
      for (const id of ['vantage', 'nertia', 'terpscout', 'work', 'practice', 'design-system']) {
        const el = page.locator(`#${id}`);
        await el.evaluate((n) => n.scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(250);
        await page.screenshot({ path: `${OUT}/${tag}-${id}-${width}-${mode}.png` });
      }
      const d = page.locator('#terpscout details');
      await d.locator('summary').click();
      await page.waitForTimeout(600);
      const figs = d.locator('figure');
      const n = await figs.count();
      for (let i = 0; i < n; i++) {
        await figs.nth(i).evaluate((f) => f.scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}/${tag}-terpscout-evidence-${i + 1}-${width}-${mode}.png` });
      }
      for (const [name, sel] of [['contact', '#contact [data-part="portrait"]'], ['ds-contact-sheet', '#design-system [data-part="ds-contact-sheet"]'], ['ds-pair', '[data-part="ds-figures"]']]) {
        await page.locator(sel).evaluate((n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - document.querySelector('nav')!.getBoundingClientRect().height - 120));
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}/${name}-${width}${mode === 'light' ? '' : '-dark'}.png` });
      }
      const fig = page.locator('#practice figure').first();
      await fig.evaluate((f) => f.scrollIntoView({ block: 'start' }));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${tag}-practice-evidence-${width}-${mode}.png` });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
