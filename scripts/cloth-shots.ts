import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 4183;
async function main() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]] as const) {
    const b = await engine.launch().catch(() => engine === chromium ? chromium.launch({ channel: 'chrome' }).catch(() => null) : null);
    if (!b) { console.log(`${name}: not available`); continue; }
    for (const width of [1280, 1920]) for (const mode of ['light', 'dark'] as const) {
      const p = await (await b.newContext({ viewport: { width, height: 1080 }, colorScheme: mode })).newPage();
      await p.goto(`http://localhost:${PORT}/bell/`, { waitUntil: 'networkidle' });
      await p.screenshot({ path: `.parity/cloth-cover-${name}-${width}-${mode}.png` });
      await p.context().close();
    }
    await b.close();
  }
  server.kill();
}
main().catch((e) => { console.error(e); process.exit(1); });
