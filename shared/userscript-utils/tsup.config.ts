import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/dom/index.ts', 'src/strings/index.ts', 'src/others/index.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
})
