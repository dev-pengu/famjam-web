import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssGlobalData({
          files: ['src/styles/media-queries.css'],
        }),
        postcssCustomMedia(),
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@famjam/ui', '@famjam/tokens', '@famjam/icons', '@famjam/fonts'],
  },
});
