import { chromium, type Browser, type Page } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// Prefers Playwright's bundled Chromium; falls back to the installed Chrome so no download is needed.
async function launch(): Promise<Browser> {
  try { return await chromium.launch(); } catch { return chromium.launch({ channel: 'chrome' }); }
}

// A clip at whole pixels: an element screenshot rounds a fractional box up by one pixel.
async function shoot(page: Page, sel: string, width: number, height: number, path: string) {
  const el = page.locator(sel);
  await el.scrollIntoViewIfNeeded();
  const b = (await el.boundingBox())!;
  await page.screenshot({ path, clip: { x: Math.round(b.x), y: Math.round(b.y), width, height } });
}

// The cloth grain is noise, so a full-colour PNG runs long; 128 colours keep each face small.
function quantize(path: string) {
  spawnSync('python3', ['-c', `from PIL import Image; Image.open(${JSON.stringify(path)}).convert('RGB').quantize(128, dither=Image.Dither.FLOYDSTEINBERG).save(${JSON.stringify(path)}, optimize=True)`], { stdio: 'inherit' });
}

// Social banners from the cover, written outside the site: `npm run faces -- banners [dir]`.
// pad is the side inset that keeps the type inside the platform's safe area; the headline sits in the
// right two thirds, vertically centred, so the profile photo's bottom-left corner stays clear. Facebook
// shows the 2x upload at 820 by 312, so its Meta is scaled up to stay legible at that size.
const BANNERS = [
  { file: 'linkedin-1584x396.png', width: 1584, height: 396, pad: 56, display: 112, meta: 16 },
  { file: 'facebook-1640x624.png', width: 1640, height: 624, pad: 195, display: 128, meta: 19 },
];

// `--headline "scott.camp/bell"` swaps the Display line and writes a second set (`-<suffix>.png`, default
// `url`) with Instagram added and the old headline stamped small in the bottom-right Meta slot (the name
// line moves bottom-left on Instagram; on Facebook and LinkedIn it stays top-right, clear of the photo). The headline is fitted as large as its box allows: one line on the wide
// banners, broken after the last slash on the Instagram posts. Facebook keeps the 1250 px centre and the
// profile photo's 420 by 220 bottom-left corner; a 4:5 post keeps its type inside the 1012 px square the
// 3:4 grid crop leaves, so the vertical inset there is (1350 - 1012) / 2.
type Fit = { file: string; width: number; height: number; padX: number; padY: number; meta: number; left: number; maxH: number; stack: boolean };
const HEADLINE_BANNERS: Fit[] = [
  { file: 'facebook-1640x624', width: 1640, height: 624, padX: 195, padY: 40, meta: 19, left: 195, maxH: 300, stack: false },
  { file: 'linkedin-1584x396', width: 1584, height: 396, padX: 56, padY: 40, meta: 16, left: 528, maxH: 200, stack: false },
  { file: 'instagram-1080x1350', width: 1080, height: 1350, padX: 108, padY: 169, meta: 24, left: 108, maxH: 700, stack: true },
  { file: 'instagram-1080x1080', width: 1080, height: 1080, padX: 108, padY: 108, meta: 24, left: 108, maxH: 560, stack: true },
];

// `npm run faces -- promo [dir]`: the ICONS book cover parody. Words above and below a whimsical nertia
// mark on the volt cloth, NERTIA small at the foot, all centred. The mark keeps the nertia body (stretched,
// tilted -8 degrees) and lets its top-right lobe run on as a tapering wave tail with a flicked ink drop.
// It stamps with the same emboss as the type, and a cloth-patterned copy screens through the ink.
// box is the safe area the lockup is fitted into; foot is the NERTIA baseline. Facebook keeps the 1250 px
// centre and the 420 by 220 bottom-left photo clear; LinkedIn uses the right two thirds; the 4:5 post stays
// inside the 1012 px square of the grid crop.
const NERTIA_STROKE = 'M379.5 59.2C335.7 254.6 304.8 213.8 180 124.8C94.3 70.1 -24.4 276.4 4.4 136.9C53.7 -102.3 125.1 35.2 212 80.3C252.7 98.9 333.8 12.9 368.1 7.5C412 0.5 450 30 500 50C560 74 640 60 760 -30C650 70 570 100 500 92C440 84 410 64 398 50C389 39 380 40 379.5 59.2Z';
const NERTIA_DROPS = [{ cx: 792, cy: -62, rx: 11, ry: 8 }, { cx: 818, cy: -84, rx: 5, ry: 4 }];
// In the row the tail flicks up over the cap height, so /BELL tucks in under it.
const ROW_GAP = [0.2, -0.3];
type Promo = { file: string; width: number; height: number; row: boolean; box: [number, number, number, number]; foot: number; nertia: number };
const PROMOS: Promo[] = [
  { file: 'facebook-1640x624-book.png', width: 1640, height: 624, row: false, box: [420, 44, 800, 482], foot: 584, nertia: 22 },
  { file: 'instagram-1080x1350-book.png', width: 1080, height: 1350, row: false, box: [108, 230, 864, 800], foot: 1150, nertia: 30 },
  { file: 'instagram-1080x1080-book.png', width: 1080, height: 1080, row: false, box: [108, 120, 864, 760], foot: 966, nertia: 28 },
  { file: 'linkedin-1584x396-book.png', width: 1584, height: 396, row: true, box: [560, 40, 940, 270], foot: 356, nertia: 20 },
];

async function promo(page: Page, dir: string) {
  // tsx keeps function names with an `__name` helper the page does not have.
  await page.addScriptTag({ content: 'window.__name = (f) => f' });
  for (const p of PROMOS) {
    await page.evaluate(({ p, stroke, drops, ROW_GAP }) => {
      document.getElementById('promo')?.remove();
      const root = document.createElement('div');
      root.id = 'promo';
      Object.assign(root.style, { position: 'fixed', top: '0', left: '0', zIndex: '2000', width: `${p.width}px`, height: `${p.height}px`, overflow: 'hidden', background: '#28d941 url(/textures/cloth.webp) 0 0 / 189px 204px repeat' });
      document.body.append(root);
      const word = (text: string, cls: string) => {
        const el = document.createElement('div');
        el.className = cls;
        el.textContent = text;
        Object.assign(el.style, { position: 'absolute', left: '0', top: '0', whiteSpace: 'pre', lineHeight: '1', color: 'var(--emboss-ink)', textShadow: 'var(--emboss-text)' });
        root.append(el);
        return el;
      };
      const top = word('SCOTT.CAMP', 'display');
      const bottom = word('/BELL', 'display');
      const foot = word('NERTIA', 'display');
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', String(p.width));
      svg.setAttribute('height', String(p.height));
      Object.assign(svg.style, { position: 'absolute', left: '0', top: '0' });
      svg.innerHTML = `<defs><g id="pm"><g transform="rotate(-8 400 80)"><path d="${stroke}"/>${drops.map((d) => `<ellipse cx="${d.cx}" cy="${d.cy}" rx="${d.rx}" ry="${d.ry}" transform="rotate(-30 ${d.cx} ${d.cy})"/>`).join('')}</g></g></defs>
        <g id="pplace"><use href="#pm" data-k="hi" fill="var(--emboss-hi)"/><use href="#pm" data-k="lo" fill="var(--emboss-lo)"/><use href="#pm" fill="var(--emboss-ink)"/></g>`;
      root.append(svg);
      const weave = document.createElement('div');
      Object.assign(weave.style, { position: 'absolute', inset: '0', background: 'inherit', opacity: '0.06', mixBlendMode: 'screen' });
      root.append(weave);
      const place = svg.querySelector<SVGGElement>('#pplace')!;
      const mb = place.getBBox();

      const em = (el: HTMLElement, size: number) => { el.style.fontSize = `${size}px`; return el.getBoundingClientRect().width; };
      const w1 = em(top, 100) / 100, w2 = em(bottom, 100) / 100;
      const cap = 0.72, ar = mb.height / mb.width;
      const [bx, by, bw, bh] = p.box;
      let s: number, markW: number;
      if (p.row) {
        const markH = 3.4 * cap;
        s = Math.min(bw / (w1 + w2 + markH / ar + ROW_GAP[0] + ROW_GAP[1]), bh / markH);
        markW = (markH / ar) * s;
      } else {
        const mw = 1.06 * w1, gap = 0.2;
        s = Math.min(bw / mw, bh / (2 * cap + mw * ar + 2 * gap));
        markW = mw * s;
      }
      const markH = markW * ar;
      const k = markW / mb.width;
      const hi = Math.max(1, 0.009 * s);
      const putMark = (x: number, y: number) => {
        const t = `translate(${x - mb.x * k} ${y - mb.y * k}) scale(${k})`;
        place.setAttribute('transform', t);
        const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}"><g transform="${t}" fill="#fff">${svg.querySelector('#pm')!.innerHTML}</g></svg>`)}")`;
        Object.assign(weave.style, { maskImage: mask, webkitMaskImage: mask });
        place.querySelector('[data-k="hi"]')!.setAttribute('transform', `translate(${hi / k} ${hi / k})`);
        place.querySelector('[data-k="lo"]')!.setAttribute('transform', `translate(${-1 / k} ${-1 / k})`);
      };
      // A line box of line-height 1 puts the cap top about 0.19em below its top in Helvetica Neue.
      const putWord = (el: HTMLElement, size: number, cx: number, capTop: number) => {
        const w = em(el, size);
        el.style.transform = `translate(${cx - w / 2}px, ${capTop - 0.19 * size}px)`;
      };
      let footX = p.width / 2;
      if (p.row) {
        const [gl, gr] = ROW_GAP.map((g) => g * s);
        const total = (w1 + w2) * s + markW + gl + gr;
        const x0 = bx + (bw - total) / 2, cy = by + bh / 2;
        putWord(top, s, x0 + (w1 * s) / 2, cy - (cap * s) / 2);
        putMark(x0 + w1 * s + gl, cy - markH / 2);
        putWord(bottom, s, x0 + w1 * s + gl + markW + gr + (w2 * s) / 2, cy - (cap * s) / 2);
        footX = x0 + total / 2;
      } else {
        const gap = 0.2 * s;
        const total = 2 * cap * s + markH + 2 * gap;
        const cx = bx + bw / 2, y0 = by + (bh - total) / 2;
        putWord(top, s, cx, y0);
        putMark(cx - markW / 2, y0 + cap * s + gap);
        putWord(bottom, s, cx, y0 + cap * s + 2 * gap + markH);
      }
      foot.style.letterSpacing = '0.06em';
      putWord(foot, p.nertia, footX, p.foot - cap * p.nertia);
    }, { p, stroke: NERTIA_STROKE, drops: NERTIA_DROPS, ROW_GAP });
    const path = `${dir}/${p.file}`;
    await page.screenshot({ path, clip: { x: 0, y: 0, width: p.width, height: p.height } });
    quantize(path);
  }
}

function flag(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const banners = process.argv[2] === 'banners' || process.argv[2] === 'promo';
  const headline = flag('headline');
  const suffix = flag('suffix') ?? 'url';
  const server = spawn('npx', ['vite', '--port', '4177', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1700, height: headline || process.argv[2] === 'promo' ? 1400 : 900 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4177/specimen/', { waitUntil: 'networkidle' });
    const cover = '#og-face > [data-part="cover"]';
    if (banners) {
      const dirArg = process.argv[3];
      const dir = dirArg && !dirArg.startsWith('--') ? dirArg : `${process.env.HOME}/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/banners`;
      mkdirSync(dir, { recursive: true });
      if (process.argv[2] === 'promo') return await promo(page, dir);
      if (headline) {
        for (const b of HEADLINE_BANNERS) {
          const top = b.stack
            ? `${cover} > div:first-child{display:block} ${cover} [data-part="title-line"]{position:absolute;left:${b.padX}px;right:${Math.round(b.width * 0.42)}px;bottom:${b.padY}px;margin:0;text-align:left}`
            : '';
          const css = `${cover}{position:fixed;top:0;left:0;z-index:1000;width:${b.width}px;height:${b.height}px;min-height:0;padding:${b.padY}px ${b.padX}px;border:0} ${cover} > div:last-child{position:absolute;left:${b.left}px;right:${b.padX}px;top:50%;transform:translateY(-50%)} ${cover} .t-display{max-width:none;white-space:pre;line-height:0.95} ${cover} .meta{font-size:${b.meta}px} ${top}`;
          const tag = await page.addStyleTag({ content: css });
          await page.evaluate(({ sel, x, y }) => {
            const stamp = document.createElement('span');
            stamp.className = 'meta';
            stamp.dataset.part = 'stamp';
            stamp.textContent = "Something click'd";
            Object.assign(stamp.style, { position: 'absolute', right: `${x}px`, bottom: `${y}px`, margin: '0' });
            document.querySelector(`${sel} > div:first-child`)!.append(stamp);
          }, { sel: cover, x: b.padX, y: b.padY });
          const text = b.stack ? headline.replace(/\/(?!.*\/)/, '/\n') : headline;
          await page.evaluate(({ sel, text, w, h }) => {
            const el = document.querySelector<HTMLElement>(`${sel} .t-display`)!;
            el.textContent = text;
            el.style.width = 'max-content';
            let size = 100;
            for (let i = 0; i < 4; i++) {
              el.style.fontSize = `${size}px`;
              const r = el.getBoundingClientRect();
              size = Math.floor(size * Math.min(w / r.width, h / r.height));
            }
            el.style.fontSize = `${size}px`;
          }, { sel: cover, text, w: b.width - b.left - b.padX, h: b.maxH });
          const path = `${dir}/${b.file}-${suffix}.png`;
          await shoot(page, cover, b.width, b.height, path);
          quantize(path);
          await tag.evaluate((n) => n.remove());
          await page.evaluate((sel) => document.querySelector(`${sel} [data-part="stamp"]`)!.remove(), cover);
        }
        return;
      }
      for (const b of BANNERS) {
        const css = `${cover}{position:fixed;top:0;left:0;z-index:1000;width:${b.width}px;height:${b.height}px;min-height:0;padding:40px ${b.pad}px;border:0} ${cover} > div:last-child{position:absolute;left:${Math.round(b.width / 3)}px;right:${b.pad}px;top:50%;transform:translateY(-50%)} ${cover} .t-display{font-size:${b.display}px;max-width:none} ${cover} .meta{font-size:${b.meta}px}`;
        const tag = await page.addStyleTag({ content: css });
        const path = `${dir}/${b.file}`;
        await shoot(page, cover, b.width, b.height, path);
        quantize(path);
        await tag.evaluate((n) => n.remove());
      }
      return;
    }
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.addStyleTag({ content: `${cover}{position:fixed;top:0;left:0;z-index:1000;width:1200px;height:630px;min-height:0;padding:64px 72px;border:0}` });
    await shoot(page, cover, 1200, 630, 'public/og.png');
    await shoot(page, '#favicon-face > div', 32, 32, 'public/favicon.png');
    quantize('public/og.png');
  } finally {
    await browser.close();
    server.kill();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
