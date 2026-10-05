import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    //setupFiles: ['./src/vitest-setup.ts'], // Optional: for global setup
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,tsx}'],
  },
});
