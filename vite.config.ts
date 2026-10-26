import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seo from './vite-plugin-seo';
import fonts from './vite-plugin-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seo(), fonts()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
