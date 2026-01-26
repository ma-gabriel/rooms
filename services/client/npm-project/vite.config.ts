import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    strictPort: true
  },
  build: {
    outDir: "/var/www",
    emptyOutDir: true
  },
  plugins: [vue()],
})
