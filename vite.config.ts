import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seo from './vite-plugin-seo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
