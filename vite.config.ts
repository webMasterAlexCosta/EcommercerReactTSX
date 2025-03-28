import { defineConfig } from 'vite';
import { BASE_URL_LOCAL } from './src/utils/system';

export default defineConfig({
  
  base: '/',
  build: {
    outDir: 'dist',

    // Ajustando o limite de tamanho do chunk (de 500 KB para 1000 KB)
    chunkSizeWarningLimit: 1000, // Define o limite de tamanho para 1 MB (1000 KB)

    rollupOptions: {
      output: {
        // Usando manualChunks para dividir o código de forma otimizada
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const pkgName = id.split('node_modules/')[1].split('/')[0];
            if (pkgName) {
              // Evitar dividir pacotes grandes que não são usados
              if (['@popperjs/core', 'react-router-dom', 'turbo-stream'].includes(pkgName)) {
                return 'vendor'; // Agrupe esses pacotes em um único chunk 'vendor'
              }

              // Verifica se o pacote não está vazio e o divide
              return pkgName; // Retorna o nome do pacote para dividir em chunks
            }
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: BASE_URL_LOCAL, // URL do seu backend
        changeOrigin: true, // Pode ser necessário para garantir que as cabeçalhos de CORS funcionem corretamente
        rewrite: (path) => path.replace(/^\/api/, ''), // Reescreve o caminho removendo "/api"
      },
    },
    fs: {
      strict: false, // Evitar erros com arquivos durante o desenvolvimento
    },
  },
});
