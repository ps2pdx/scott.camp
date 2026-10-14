import { chromium, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;
const TEXTURES_OFF = '.grain::before{display:none}.rail{background-image:none !important;width:2px !important}.band{background-image:none !important}.chip{background-image:none !important}.hole{filter:none !important}';

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  const problems: string[] = [];
  try {
    for (const path of ['bell', 'specimen']) for (const width of [1280, 390]) for (const mode of ['dark', 'light'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: mode });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${path}/`, { waitUntil: 'networkidle' });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) problems.push(`${path} ${mode} overflows at ${width}: ${sw}`);
      if (path === 'bell') {
        const r = await page.evaluate(() => {
          const nav = document.querySelector('nav')!.getBoundingClientRect().height;
          const cells = [...document.querySelectorAll('nav a')].map((a) => a.getBoundingClientRect().height);
          const scroller = document.querySelector('[data-part="index-scroll"]') as HTMLElement;
          return { nav, tallestCell: Math.max(...cells), indexScrolls: scroller.scrollWidth > scroller.clientWidth };
        });
        if (r.tallestCell > 48) problems.push(`${path} ${width} ${mode}: a nav cell wraps (${r.tallestCell}px)`);
        if (r.indexScrolls) problems.push(`${path} ${width} ${mode}: the index scrolls inside its box`);
        if (width < 1024) {
          const band = await page.evaluate(() => {
            const b = document.querySelector('[data-part="band"]') as HTMLElement | null;
            const nav = document.querySelector('nav')!;
            return { top: b ? b.getBoundingClientRect().top : -1, height: b ? b.getBoundingClientRect().height : 0, beforeNav: !!b && !!(b.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING), inFooter: !!document.querySelector('footer [data-part="band"]') };
          });
          if (band.top !== 0 || band.height < 80 || !band.beforeNav || band.inFooter) problems.push(`${path} ${width} ${mode}: the spine band is not the top band above the nav (${JSON.stringify(band)})`);
        }
        for (const id of ['vantage', 'work', 'contact']) {
          await page.click(`nav a[href="#${id}"]`);
          await page.waitForTimeout(400);
          const top = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id);
          if (top < r.nav - 1) problems.push(`${path} ${width} ${mode}: #${id} lands under the nav (${top} < ${r.nav})`);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        console.log(`${path} ${width} ${mode}: nav ${Math.round(r.nav)}px`);
      }
      await page.screenshot({ path: `${OUT}/${path}-${width}-${mode}.png`, fullPage: true });
      await ctx.close();
    }
    for (const width of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: 'light' });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-data', value: 'reduce' }] });
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: TEXTURES_OFF });
      await page.screenshot({ path: `${OUT}/bell-${width}-textures-off.png`, fullPage: true });
      await ctx.close();
    }
  } finally { await browser.close(); server.kill(); }
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
}
main().catch((e) => { console.error(e); process.exit(1); });
