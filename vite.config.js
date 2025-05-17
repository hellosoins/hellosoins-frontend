/** @format */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    allowedHosts: [
      '6da2-129-222-108-22.ngrok-free.app',
      'hellosoins.com',
      'preprod.hellosoins.com',
      'http://192.168.1.171:5000',
    ],
  },
  host: '0.0.0.0',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/medicalReact',
});
