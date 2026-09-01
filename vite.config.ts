import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { PWA_META } from './src/config/brand'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg'],
    manifest: {
      ...PWA_META,
      theme_color: '#315f57', background_color: '#f7f3eb', display: 'standalone', start_url: '/', lang: 'es-AR',
      icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
    },
    workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,woff2}'] }
  })]
})
