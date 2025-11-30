import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import path from 'path'
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
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    'import.meta.env.VITE_TRANSLATIONS_HASH': JSON.stringify(calculateTranslationsHash())
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    chunkSizeWarningLimit: 850, // Vendor chunks are expected to be larger
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React ecosystem
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI components library
          'vendor-ui': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            'lucide-react',
            'framer-motion',
          ],
          // Charts and visualization
          'vendor-charts': ['recharts'],
          // Mermaid diagrams (large)
          'vendor-mermaid': ['mermaid'],
          // PDF handling (very large)
          'vendor-pdf': ['pdfjs-dist', 'jspdf'],
          // Markdown rendering
          'vendor-markdown': [
            'react-markdown',
            'remark-gfm',
            'remark-math',
            'rehype-katex',
            'rehype-raw',
            'katex',
          ],
          // i18n
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend'],
          // tRPC and data fetching
          'vendor-data': ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'],
        },
      },
    },
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
        target: 'http://backend-dev:3000',
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
    },
    // Handle client-side routing in development
    middlewareMode: false,
    fs: {
      strict: true,
    }
  },
  preview: {
    host: true,
    port: 80
  }
}) 