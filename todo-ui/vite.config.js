// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'TodoLists',
      fileName: (format) => `todo-lists.${format}.js`
    },
    rollupOptions: {
      external: ['vue']
    }
  },
  server: {
    port: 3000
  }
});
