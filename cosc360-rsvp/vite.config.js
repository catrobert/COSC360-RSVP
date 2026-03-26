import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  root: "client",
  plugins: [react()],
  
  server: {
    proxy: {
      "/api": apiProxyTarget,
      "/uploads": apiProxyTarget,
    },
  },
})
