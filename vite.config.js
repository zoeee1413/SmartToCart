import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // Mahalaga ito sa multi-page build para tama ang pag-resolve ng CSS/JS assets sa production
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'market-home.html'),
        signin: resolve(__dirname, 'signin.html'),
        signup: resolve(__dirname, 'signup.html'),
        cart: resolve(__dirname, 'cart.html'),
        profile: resolve(__dirname, 'profile.html')
      }
    }
  }
})