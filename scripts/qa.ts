import { chromium, webkit, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;
const TEXTURES_OFF = '.grain::before{display:none}.rail{background-image:none !important;width:2px !important}.band{background-image:none !important}.reveal{display:none !important}.cut{border-top-color:var(--line-strong) !important}.chip{background-image:none !important}.hole{filter:none !important}';

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
          const cells = [...document.querySelectorAll('nav a')].map((a) => a.getBoundingClientRect());
          const scroller = document.querySelector('[data-part="index-scroll"]') as HTMLElement;
          const rows = [...scroller.querySelectorAll('tr')];
          const stacked = rows.some((tr) => { const tops = [...tr.children].map((td) => Math.round(td.getBoundingClientRect().top)); return tr.children.length !== 4 || new Set(tops).size !== 1 || getComputedStyle(tr.children[0]).display !== 'table-cell'; });
          return { nav, tallestCell: Math.max(...cells.map((c) => c.height)), navRows: new Set(cells.map((c) => Math.round(c.top))).size, indexScrolls: scroller.scrollWidth > scroller.clientWidth, stacked };
        });
        if (r.navRows !== 1) problems.push(`${path} ${width} ${mode}: the nav wraps to ${r.navRows} rows`);
        if (r.stacked) problems.push(`${path} ${width} ${mode}: the index table is stacked or relaid out`);
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
        const cut = await page.evaluate(() => ({ border: getComputedStyle(document.getElementById('vantage')!).borderTopColor, reveal: getComputedStyle(document.querySelector('[data-part="reveal"]')!).position }));
        if (cut.border !== 'rgba(0, 0, 0, 0)' || cut.reveal !== 'fixed') problems.push(`${path} ${width} ${mode}: the divider is not a cut over the fixed spine (${JSON.stringify(cut)})`);
        await page.evaluate(() => window.scrollTo(0, 0));
        console.log(`${path} ${width} ${mode}: nav ${Math.round(r.nav)}px`);
      }
      for (let y = 0; y < 30; y++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(30); }
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/${path}-${width}-${mode}.png`, fullPage: true });
      if (path === 'bell') {
        await page.locator('#hero').screenshot({ path: `${OUT}/hero-${width}-${mode}.png` });
        await page.locator('#terpscout').screenshot({ path: `${OUT}/terpscout-${width}-${mode}.png` });
        await page.locator('#vantage ul').screenshot({ path: `${OUT}/transcript-${width}-${mode}.png` });
        await page.locator('[data-part="index"]').screenshot({ path: `${OUT}/index-${width}-${mode}.png` });
        await page.locator('[data-part="section-body"] article').first().screenshot({ path: `${OUT}/specsheet-${width}-${mode}.png` });
        await page.locator('#nertia svg[role="img"]').first().screenshot({ path: `${OUT}/techsheet-${width}-${mode}.png` });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('nav').screenshot({ path: `${OUT}/nav-${width}-${mode}.png` });
      }
      await ctx.close();
    }
    for (const width of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: 'light' });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-data', value: 'reduce' }] });
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: TEXTURES_OFF });
      const plain = await page.evaluate(() => ({ border: getComputedStyle(document.getElementById('vantage')!).borderTopColor, reveal: getComputedStyle(document.querySelector('[data-part="reveal"]')!).display }));
      if (plain.border === 'rgba(0, 0, 0, 0)' || plain.reveal !== 'none') problems.push(`reduced-data ${width}: the divider is not a plain rule (${JSON.stringify(plain)})`);
      await page.screenshot({ path: `${OUT}/bell-${width}-textures-off.png`, fullPage: true });
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, forcedColors: 'active' });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      const fc = await page.evaluate(() => getComputedStyle(document.querySelector('[data-part="reveal"]')!).display);
      if (fc !== 'none') problems.push(`forced-colors: the fixed spine layer still paints (${fc})`);
      await ctx.close();
    }
    const GATED = /terpscout-spin|rosin-press|martian-fruit|trap-fuel|per-image-pricing/;
    const engines: [string, Browser | null][] = [['chromium', browser], ['webkit', await webkit.launch().catch(() => null)]];
    for (const [name, b] of engines) {
      if (!b) { console.log(`${name}: not installed, disclosure check skipped`); continue; }
      for (const width of [1280, 390]) {
        const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark' });
        const page = await ctx.newPage();
        const hits: string[] = [];
        page.on('request', (r) => { if (GATED.test(r.url())) hits.push(r.url()); });
        await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
        const block = page.locator('#terpscout');
        const shoot = async (file: string) => {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);
          const box = (await block.boundingBox())!;
          await page.screenshot({ path: `${OUT}/${file}`, fullPage: true, clip: { x: 0, y: box.y, width, height: box.height } });
        };
        for (let y = 0; y < 40; y++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(40); }
        await block.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        if (hits.length) problems.push(`${name} ${width}: the closed disclosure fetched ${hits.join(', ')}`);
        if (name === 'chromium') await shoot(`terpscout-${width}-closed.png`);
        const summary = page.locator('#terpscout summary');
        await summary.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);
        if (!(await page.locator('#terpscout details').evaluate((d) => (d as HTMLDetailsElement).open))) problems.push(`${name} ${width}: Enter on the summary did not open the disclosure`);
        await page.locator('#terpscout video').first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        const playing = await page.locator('#terpscout video').first().evaluate((v) => !(v as HTMLVideoElement).paused);
        if (!playing) problems.push(`${name} ${width}: the spin does not play once opened and in view`);
        for (const img of await page.locator('#terpscout details img').all()) await img.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        if (!hits.some((h) => h.includes('per-image-pricing'))) problems.push(`${name} ${width}: the opened disclosure did not load its stills`);
        if (name === 'chromium') await shoot(`terpscout-${width}-open.png`);
        await summary.focus();
        await page.keyboard.press('Space');
        await page.waitForTimeout(200);
        const after = await page.locator('#terpscout details').evaluate((d) => ({ open: (d as HTMLDetailsElement).open, paused: (d.querySelector('video') as HTMLVideoElement).paused }));
        if (after.open || !after.paused) problems.push(`${name} ${width}: Space did not close the disclosure and pause the spin (${JSON.stringify(after)})`);
        console.log(`${name} ${width}: disclosure closed fetches 0, opens by keyboard, plays in view, pauses on close`);
        await ctx.close();
      }
      if (b !== browser) await b.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, forcedColors: 'active' });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-data', value: 'reduce' }, { name: 'forced-colors', value: 'active' }] });
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      await page.locator('#terpscout summary').click();
      await page.waitForTimeout(200);
      const r = await page.locator('#terpscout details').evaluate((d) => ({ open: (d as HTMLDetailsElement).open, video: !!d.querySelector('video'), stills: d.querySelectorAll('img').length }));
      if (!r.open || r.video || r.stills !== 6) problems.push(`forced-colors, reduced-data: the disclosure does not open to stills only (${JSON.stringify(r)})`);
      await ctx.close();
    }
  } finally { await browser.close(); server.kill(); }
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
}
main().catch((e) => { console.error(e); process.exit(1); });
