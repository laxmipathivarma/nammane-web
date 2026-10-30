import { defineConfig } from 'vitest/config'
import path from 'path'

// Mirrors tsconfig.json's "@/*" -> "./src/*" path alias so tests can import
// app code (e.g. '@/lib/navMenu') the same way the app itself does.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
  },
})
