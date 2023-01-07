import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin(), vanillaExtractPlugin()],
  build: {
    target: 'esnext',
  },
});
