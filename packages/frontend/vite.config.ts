import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync, readdirSync } from 'fs'
import { createHash } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Calculate hash of translation files
const calculateTranslationsHash = () => {
  const localesDir = resolve(__dirname, 'public/locales')
  let content = ''
  
  // Read all translation files and concatenate their content
  const processDir = (dir: string) => {
    readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        processDir(fullPath)
      } else if (dirent.isFile() && dirent.name.endsWith('.json')) {
        content += readFileSync(fullPath, 'utf-8')
      }
    })
  }

  processDir(localesDir)
  
  // Create hash from concatenated content
  return createHash('md5').update(content).digest('hex').substring(0, 8)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_TRANSLATIONS_HASH': JSON.stringify(calculateTranslationsHash())
  },
  resolve: {
    alias: {
    }
  },
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