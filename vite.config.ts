import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProd = mode === 'production';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        isProd &&
          compression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'brotli',
            ext: '.br',
            deleteOriginFile: false,
          }),
        isProd &&
          compression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
            deleteOriginFile: false,
          })
      ].filter(Boolean),
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'ES2020',
        minify: 'terser',
        sourcemap: !isProd,
        terserOptions: {
          compress: {
            drop_console: isProd,
            drop_debugger: isProd,
          }
        },
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: [
                'react',
                'react-dom',
              ],
              icons: ['lucide-react'],
              ai: ['@google/genai'],
              animation: ['framer-motion'],
            },
            chunkFileNames: 'js/[name].[hash].js',
            entryFileNames: 'js/[name].[hash].js',
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|gif|svg|webp/.test(ext)) {
                return `images/[name].[hash][extname]`;
              } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
                return `fonts/[name].[hash][extname]`;
              } else if (ext === 'css') {
                return `css/[name].[hash][extname]`;
              }
              return `assets/[name].[hash][extname]`;
            }
          }
        },
        reportCompressedSize: true,
        chunkSizeWarningLimit: 500,
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'lucide-react',
          '@google/genai',
          'framer-motion'
        ],
        exclude: ['web-vitals']
      }
    };
});
