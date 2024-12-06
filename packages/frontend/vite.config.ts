import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://backend-dev:3000',
        changeOrigin: true
      }
    }
  }
}) 