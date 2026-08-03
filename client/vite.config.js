import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",

      "/header": "http://localhost:3000",
      "/footer": "http://localhost:3000",
      "/includeHeader.js": "http://localhost:3000",

      "/style.css": "http://localhost:3000",
      "/discover.css": "http://localhost:3000",
      "/game.css": "http://localhost:3000",
      "/leaderboards.css": "http://localhost:3000",
      "/cinema_info.css": "http://localhost:3000",
      "/about_us.css": "http://localhost:3000",
      "/terms_of_service.css": "http://localhost:3000",
      "/privacy_policy.css": "http://localhost:3000",

      "/game": "http://localhost:3000",
      "/leaderboards": "http://localhost:3000",
      "/about-us": "http://localhost:3000",
      "/privacy-policy": "http://localhost:3000",
      "/terms": "http://localhost:3000",
      "/cinema-info": "http://localhost:3000",
      "/game.js": "http://localhost:3000",
      "/leaderboards.js": "http://localhost:3000",
      "/cinema_info.js": "http://localhost:3000",

      "/pair": "http://localhost:3000",
      "/vote": "http://localhost:3000",
      "/details": "http://localhost:3000",
      "/rating": "http://localhost:3000",
      "/leaderboard": "http://localhost:3000",
    },
  },
})
