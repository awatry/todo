// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    // If a library explicitly checks the 'process' global object, 
    // you can also stub out the empty object:
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'TodoLists',
      fileName: (format) => `todo-lists.${format}.js`
    }
  },
  server: {
    port: 3000
  }
});
