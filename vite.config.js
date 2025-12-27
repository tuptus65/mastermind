// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/game.js'),
      name: 'Mastermind',
      fileName: 'mastermind',
      formats: ['es']
    },
    rollupOptions: {
    },
  },
});