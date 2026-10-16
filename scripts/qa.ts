import { chromium, webkit, type Browser } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = '.parity';
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;
const TEXTURES_OFF = '.grain::before{display:none}.rail{background-image:none !important;width:2px !important}.band{background-image:none !important}.cut::after{display:none !important}.cut{border-top-color:var(--line-strong) !important}.chip{background-image:none !important}.hole{filter:none !important}';
const CHAPTERS = ['design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact'];
const PATHS = ['bell', ...CHAPTERS.map((c) => `bell/${c}`), 'specimen'];
const file = (path: string) => path.replace('/', '-');

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
    for (const path of PATHS) for (const width of [1280, 390]) for (const mode of ['dark', 'light'] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: mode });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${path}/`, { waitUntil: 'networkidle' });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) problems.push(`${path} ${mode} overflows at ${width}: ${sw}`);
      if (path.startsWith('bell')) {
        const nav = await page.evaluate(() => ({ targets: [...document.querySelectorAll('nav a')].map((x) => x.getAttribute('href')).join(','), current: document.querySelector('nav a[aria-current="page"]')?.getAttribute('href') }));
        const here = path === 'bell' ? '/bell' : `/${path}`;
        if (nav.targets !== ['/bell', ...CHAPTERS.map((c) => `/bell/${c}`)].join(',')) problems.push(`${path} ${width} ${mode}: nav targets are ${nav.targets}`);
        if (nav.current !== here) problems.push(`${path} ${width} ${mode}: the current nav cell is ${nav.current}`);
      }
      if (path === 'bell') {
        const r = await page.evaluate(() => {
          const nav = document.querySelector('nav')!.getBoundingClientRect().height;
          const cells = [...document.querySelectorAll('nav a')].map((a) => a.getBoundingClientRect());
          const scroller = document.querySelector('[data-part="index-scroll"]') as HTMLElement;
          const rows = [...scroller.querySelectorAll('tr')];
          const stacked = rows.some((tr) => { const tops = [...tr.children].map((td) => Math.round(td.getBoundingClientRect().top)); return tr.children.length !== 4 || new Set(tops).size !== 1 || getComputedStyle(tr.children[0]).display !== 'table-cell'; });
          return { nav, navRows: new Set(cells.map((c) => Math.round(c.top))).size, indexScrolls: scroller.scrollWidth > scroller.clientWidth, stacked };
        });
        if (r.navRows !== 1) problems.push(`${path} ${width} ${mode}: the nav wraps to ${r.navRows} rows`);
        if (r.stacked) problems.push(`${path} ${width} ${mode}: the index table is stacked or relaid out`);
        if (r.indexScrolls) problems.push(`${path} ${width} ${mode}: the index scrolls inside its box`);
        const top = await page.evaluate(() => {
          const cover = document.getElementById('hero')!.getBoundingClientRect();
          const b = document.querySelector('[data-part="band"]') as HTMLElement;
          const nav = document.querySelector('nav')!.getBoundingClientRect();
          const hit = document.elementFromPoint(20, Math.min(200, cover.height - 10));
          return { coverH: cover.height, vh: innerHeight, navTop: nav.top, bandTop: b.getBoundingClientRect().top, bandShown: getComputedStyle(b).display !== 'none', coverOnTop: !!hit && !!hit.closest('#hero') };
        });
        if (top.coverH < top.vh - 2) problems.push(`${path} ${width} ${mode}: the cover does not fill the first viewport (${top.coverH} < ${top.vh})`);
        if (!top.coverOnTop) problems.push(`${path} ${width} ${mode}: the rail or the nav shows over the cover`);
        if (Math.abs(top.navTop - top.coverH - (top.bandShown ? top.bandTop - top.coverH + (await page.evaluate(() => (document.querySelector('[data-part="band"]') as HTMLElement).getBoundingClientRect().height)) : 0)) > 2) problems.push(`${path} ${width} ${mode}: the nav does not start at the cover's bottom edge (${JSON.stringify(top)})`);
        if (top.bandShown && Math.abs(top.bandTop - top.coverH) > 2) problems.push(`${path} ${width} ${mode}: the spine band does not start after the cover (${JSON.stringify(top)})`);
        await page.screenshot({ path: `${OUT}/cover-${width}-${mode}-0.png` });
        await page.evaluate(() => window.scrollTo(0, 200));
        await page.waitForTimeout(200);
        await page.screenshot({ path: `${OUT}/cover-${width}-${mode}-200.png` });
        await page.evaluate((h) => window.scrollTo(0, h + 400), top.coverH);
        await page.waitForTimeout(200);
        const stuck = await page.evaluate(() => {
          const nav = document.querySelector('nav')!.getBoundingClientRect();
          const hit = document.elementFromPoint(10, nav.bottom + 60);
          return { navTop: Math.round(nav.top), rail: !!hit && hit.getAttribute('data-part') === 'rail' };
        });
        if (stuck.navTop !== 0) problems.push(`${path} ${width} ${mode}: the nav does not stick to the top after the cover (${stuck.navTop})`);
        if (width >= 1024 && !stuck.rail) problems.push(`${path} ${width} ${mode}: the rail does not show at the left once past the cover`);
        await page.evaluate(() => window.scrollTo(0, 0));
        const order = await page.evaluate(() => [...document.querySelectorAll('section')].map((x) => x.id).join(','));
        const want = ['hero', 'endpapers', ...CHAPTERS.map((c) => `snippet-${c}`)].join(',');
        if (order !== want) problems.push(`${path} ${width} ${mode}: section order is ${order}`);
        const cut = await page.evaluate(() => { const el = document.getElementById('snippet-vantage')!; return { border: getComputedStyle(el).borderTopColor, strip: getComputedStyle(el, '::after').backgroundImage }; });
        if (cut.border !== 'rgba(0, 0, 0, 0)' || !cut.strip.includes('spine-band')) problems.push(`${path} ${width} ${mode}: the divider is not a 2 px cut carrying the spine (${JSON.stringify(cut)})`);
        await page.evaluate(() => window.scrollTo(0, 0));
        console.log(`${path} ${width} ${mode}: nav ${Math.round(r.nav)}px`);
      }
      for (let y = 0; y < 30; y++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(30); }
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/${file(path)}-${width}-${mode}.png`, fullPage: true });
      const parts: Record<string, [string, string][]> = {
        bell: [['#hero', 'hero'], ['#endpapers', 'endpapers'], ['#endpapers [data-part="index"]', 'index']],
        'bell/terpscout': [['#terpscout', 'terpscout']],
        'bell/vantage': [['#vantage ul.transcript', 'transcript']],
        'bell/work': [['#work article', 'specsheet']],
        'bell/nertia': [['#nertia svg[role="img"]', 'techsheet']],
      };
      for (const [sel, name] of parts[path] ?? []) await page.locator(sel).first().screenshot({ path: `${OUT}/${name}-${width}-${mode}.png` });
      if (path === 'bell') {
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
      const plain = await page.evaluate(() => { const el = document.getElementById('snippet-vantage')!; return { border: getComputedStyle(el).borderTopColor, strip: getComputedStyle(el, '::after').display }; });
      if (plain.border === 'rgba(0, 0, 0, 0)' || plain.strip !== 'none') problems.push(`reduced-data ${width}: the divider is not a plain rule (${JSON.stringify(plain)})`);
      await page.screenshot({ path: `${OUT}/bell-${width}-textures-off.png`, fullPage: true });
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, forcedColors: 'active' });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/bell/`, { waitUntil: 'networkidle' });
      const fc = await page.evaluate(() => getComputedStyle(document.getElementById('snippet-vantage')!, '::after').display);
      if (fc !== 'none') problems.push(`forced-colors: the spine strip on the cut still paints (${fc})`);
      await ctx.close();
    }
    const GATED = /terpscout-spin|rosin-press|martian-fruit|per-image-pricing/;
    const engines: [string, Browser | null][] = [['chromium', browser], ['webkit', await webkit.launch().catch(() => null)]];
    for (const [name, b] of engines) {
      if (!b) { console.log(`${name}: not installed, disclosure check skipped`); continue; }
      for (const width of [1280, 390]) {
        const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark' });
        const page = await ctx.newPage();
        const hits: string[] = [];
        page.on('request', (r) => { if (GATED.test(r.url())) hits.push(r.url()); });
        await page.goto(`${BASE}/bell/terpscout/`, { waitUntil: 'networkidle' });
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
      await page.goto(`${BASE}/bell/terpscout/`, { waitUntil: 'networkidle' });
      await page.locator('#terpscout summary').click();
      await page.waitForTimeout(200);
      const r = await page.locator('#terpscout details').evaluate((d) => ({ open: (d as HTMLDetailsElement).open, video: !!d.querySelector('video'), stills: d.querySelectorAll('img').length }));
      if (!r.open || r.video || r.stills !== 4) problems.push(`forced-colors, reduced-data: the disclosure does not open to stills only (${JSON.stringify(r)})`);
      await ctx.close();
    }
  } finally { await browser.close(); server.kill(); }
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
}
main().catch((e) => { console.error(e); process.exit(1); });
