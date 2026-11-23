import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seo from './vite-plugin-seo';
import fonts from './vite-plugin-fonts';
import postMeta from './vite-plugin-post-meta';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), postMeta(), seo(), fonts()],
  build: {
    // Font subsets must stay in their own files: most visitors never need the small ones
    assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
