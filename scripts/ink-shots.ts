import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const PORT = 4182;
async function main() {
  mkdirSync('.parity', { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]] as const) {
    const b = await engine.launch().catch(() => null);
    if (!b) { console.log(`${name}: not installed`); continue; }
    for (const dpr of [1, 2, 3]) for (const mode of ['dark', 'light'] as const) {
      const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: dpr, colorScheme: mode })).newPage();
      await p.goto(`http://localhost:${PORT}/bell/`, { waitUntil: 'networkidle' });
      await p.locator('nav a').nth(1).screenshot({ path: `.parity/ink-nav-${name}-dpr${dpr}-${mode}.png` });
      await p.locator('#contact [data-variant="primary"]').screenshot({ path: `.parity/ink-button-${name}-dpr${dpr}-${mode}.png` });
      await p.context().close();
    }
    await b.close();
  }
  server.kill();
}
main().catch((e) => { console.error(e); process.exit(1); });
