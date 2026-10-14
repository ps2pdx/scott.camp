import { chromium, type Browser, type Page } from 'playwright';
import { spawn } from 'node:child_process';

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
    await page.addStyleTag({ content: '#og-face > div{position:fixed;top:0;left:0;z-index:1000;width:1200px;height:630px;aspect-ratio:auto;border:0} #og-face .vol{font-size:96px} #og-face [class*=nm]{font-size:72px} #og-face [class*=yr]{font-size:28px} #og-face [class*=recto]{padding:48px}' });
    await shoot(page, '#og-face > div', 1200, 630, 'public/og.png');
    await shoot(page, '#favicon-face > div', 32, 32, 'public/favicon.png');
  } finally {
    await browser.close();
    server.kill();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
