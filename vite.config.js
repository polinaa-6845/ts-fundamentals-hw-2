import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ts-fundamentals-hw-2/',

  define: {
    global: {},
  },

  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
