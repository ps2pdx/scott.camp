import { chromium, type Browser } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { COPY } from '../src/content/copy';

// Every volume name, set into every face on the Work page at each width: no word may wrap inside
// itself or overrun the recto. Exits 1 on a miss. `npx tsx scripts/faces-fit-shots.ts`.
const OUT = '.parity';
const PORT = 4184;
const WIDTHS = [1440, 1024, 390, 360];
const NAMES = COPY.work.index.map((r) => r.name);

async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  spawnSync('npm', ['run', 'build'], { stdio: 'ignore' });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  let misses = 0;
  try {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: 'light', deviceScaleFactor: 1 });
      await page.goto(`http://localhost:${PORT}/bell/work/`, { waitUntil: 'networkidle' });
      const res = await page.evaluate((names) => {
        const out: string[] = [];
        let tightest = Infinity;
        for (const el of document.querySelectorAll<HTMLElement>('[data-part="name"]')) {
          const own = el.textContent ?? '';
          const recto = el.parentElement!;
          const cs = getComputedStyle(recto);
          const room = recto.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          for (const name of names) {
            el.textContent = name;
            const text = el.firstChild!;
            for (const m of name.matchAll(/\S+/g)) {
              const r = document.createRange();
              r.setStart(text, m.index!); r.setEnd(text, m.index! + m[0].length);
              const rects = r.getClientRects();
              const w = r.getBoundingClientRect().width;
              tightest = Math.min(tightest, room - w);
              if (rects.length !== 1 || w > room + 0.5) out.push(`${name}: "${m[0]}" ${rects.length} lines, ${w.toFixed(1)} of ${room.toFixed(1)}px`);
            }
          }
          el.textContent = own;
        }
        return { out, tightest, size: getComputedStyle(document.querySelector('[data-part="name"]')!).fontSize };
      }, NAMES);
      console.log(width, `title ${res.size}, tightest slack ${res.tightest.toFixed(1)}px`, res.out.length ? res.out : 'all fit');
      misses += res.out.length;
      if (width <= 390) {
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
        await page.waitForTimeout(300);
        await page.locator('[data-part="work-sheets"]').screenshot({ path: `${OUT}/faces-fit-${width}.png` });
      }
      await page.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  process.exit(misses ? 1 : 0);
}
main();
