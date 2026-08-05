import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './src/lib/next-shim.tsx'),
      'next/link': path.resolve(__dirname, './src/lib/next-shim.tsx'),
      '@edukalyan/types': path.resolve(__dirname, '../packages/types/src/index.ts'),
      '@edukalyan/utils': path.resolve(__dirname, '../packages/utils/src/index.ts'),
      '@edukalyan/ui': path.resolve(__dirname, '../packages/ui/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
