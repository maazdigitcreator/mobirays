import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/brand/allBrands': {
        target: 'https://mobirays.voucherndeals.com',
        changeOrigin: true,
        secure: false,
      },
      '/api/posts': {
        target: 'https://mobirays.voucherndeals.com/api/v1/posts',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => '',
      },
      '/api/products': {
        target: 'https://mobirays.voucherndeals.com/api/v1/products/allProducts',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => '',
      },
      '/storage': {
        target: 'https://mobirays.voucherndeals.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
