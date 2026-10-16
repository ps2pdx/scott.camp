import { chromium, type Browser, type Page } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';

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

async function main() {
  const server = spawn('npx', ['vite', '--port', '4177', '--strictPort'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4177/specimen/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '#og-face > [data-part="cover"]{position:fixed;top:0;left:0;z-index:1000;width:1200px;height:630px;min-height:0;padding:64px 72px;border:0}' });
    await shoot(page, '#og-face > [data-part="cover"]', 1200, 630, 'public/og.png');
    await shoot(page, '#favicon-face > div', 32, 32, 'public/favicon.png');
    // The cloth grain is noise, so a full-colour PNG runs past 300 KB; 128 colours keep it under.
    spawnSync('python3', ['-c', "from PIL import Image; Image.open('public/og.png').convert('RGB').quantize(128, dither=Image.Dither.FLOYDSTEINBERG).save('public/og.png', optimize=True)"], { stdio: 'inherit' });
  } finally {
    await browser.close();
    server.kill();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
