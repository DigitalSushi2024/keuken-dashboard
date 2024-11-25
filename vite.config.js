import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7110',
        changeOrigin: true,
        secure: false, // Voor zelfondertekende certificaten
      },
    },
  },
});
