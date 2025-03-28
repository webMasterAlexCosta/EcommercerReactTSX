import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { BASE_URL_LOCAL } from './src/utils/system';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Redirecionando todas as requisições para /api para o backend Java Spring Boot na porta 8080
      '/api': {
        target: BASE_URL_LOCAL, // URL do seu backend
        changeOrigin: true, // Pode ser necessário para garantir que as cabeçalhos de CORS funcionem corretamente
        rewrite: (path) => path.replace(/^\/api/, ''), // Se necessário, reescreve o caminho, removendo "/api"
      },
    },
    fs: {
      strict: false, // Evitar erros com arquivos durante o desenvolvimento
    },
  },
});