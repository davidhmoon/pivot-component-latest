import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build works from any folder. GitHub Pages serves it from /<repository>/.
  base: './',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
