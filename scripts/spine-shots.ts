import { webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const tag = process.argv[2] ?? 'after';
const PORT = 4181;
async function main() {
  mkdirSync('.parity', { recursive: true });
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'out'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const b = await webkit.launch();
  try {
    const desk = await (await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' })).newPage();
    await desk.goto(`http://localhost:${PORT}/bell/`, { waitUntil: 'networkidle' });
    await desk.screenshot({ path: `.parity/spine-rail-1280-${tag}.png`, clip: { x: 0, y: 0, width: 240, height: 900 } });
    const phone = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, colorScheme: 'dark' })).newPage();
    await phone.goto(`http://localhost:${PORT}/bell/`, { waitUntil: 'networkidle' });
    await phone.locator('[data-part="band"]').screenshot({ path: `.parity/spine-band-390-dpr3-${tag}.png` });
  } finally { await b.close(); server.kill(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
