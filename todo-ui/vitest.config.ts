import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    globals: true,
    //setupFiles: ['./src/vitest-setup.ts'], // Optional: for global setup
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,tsx}'],
  },
});
