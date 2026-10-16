import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const PAGE_SLUGS = ['design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact'];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    outDir: 'out',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        root: resolve(__dirname, 'index.html'),
        bell: resolve(__dirname, 'bell/index.html'),
        ...Object.fromEntries(PAGE_SLUGS.map((p) => [`bell-${p}`, resolve(__dirname, `bell/${p}/index.html`)])),
        specimen: resolve(__dirname, 'specimen/index.html'),
      },
      output: { manualChunks: (id) => (id.includes('node_modules') ? 'react' : id.includes('/src/content/') ? 'copy' : /\/src\/(components\/(Shell|PunchNav|Punches|SpineRail|Footer|ThemeToggle)|lib\/theme)\b/.test(id) ? 'chrome' : undefined) },
    },
  },
});
