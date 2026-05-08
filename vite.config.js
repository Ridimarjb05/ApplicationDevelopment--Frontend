import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite config file - tells vite how to build and run our react app
export default defineConfig({
  plugins: [react()],
})
