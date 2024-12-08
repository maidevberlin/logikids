import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80,
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/vite.config.ts']
    },
    proxy: {  
      '/api': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            console.log('Target URL:', proxyReq.path);
            console.log('Headers:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            console.log('Response headers:', proxyRes.headers);
          });
        }
      }
    }
  },
  preview: {
    host: true,
    port: 80
  }
}) 