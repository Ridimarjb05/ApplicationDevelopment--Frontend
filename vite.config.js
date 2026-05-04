import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vite config - this tells vite to use the react plugin
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
