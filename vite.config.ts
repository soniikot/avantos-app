import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
    '@app-types': path.resolve(__dirname, './src/types'),
    '@services': path.resolve(__dirname, './src/service'),
    '@styles': path.resolve(__dirname, './src/styles'),
  }
}
})
