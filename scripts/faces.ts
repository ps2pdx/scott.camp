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

async function main() {
  const banners = process.argv[2] === 'banners';
  const server = spawn('npx', ['vite', '--port', '4177', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1700, height: 900 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4177/specimen/', { waitUntil: 'networkidle' });
    const cover = '#og-face > [data-part="cover"]';
    if (banners) {
      const dir = process.argv[3] ?? `${process.env.HOME}/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/banners`;
      mkdirSync(dir, { recursive: true });
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
