/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    base: env.VITE_BASE_URL || 'https://legerakun.github.io/administration-panel/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  });
};
