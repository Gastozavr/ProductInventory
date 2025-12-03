import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 53062,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:53060/productInventory',
        changeOrigin: true
      },
      '/ws': {
        target: 'http://localhost:53060/productInventory',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  preview: {
    port: 5174
  }
})
