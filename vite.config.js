import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // ✅ use default Vite port
    proxy: {
      '/api': 'http://localhost:5001', // ✅ forward API calls to backend
    },
  },
})
