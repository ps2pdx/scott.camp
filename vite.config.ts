import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

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
        specimen: resolve(__dirname, 'specimen/index.html'),
      },
    },
  },
});
