import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  target: 'es2020',
});