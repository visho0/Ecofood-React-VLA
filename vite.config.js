import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      // Configura un alias para la carpeta 'common'
      '@common': path.resolve(__dirname, './src/components/common'),
      // Puedes añadir más aliases si quieres, por ejemplo para 'src/routes'
      // '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
});