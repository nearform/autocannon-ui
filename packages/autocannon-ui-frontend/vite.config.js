import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
