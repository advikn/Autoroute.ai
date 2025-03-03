import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-markdown'
    ],
    exclude: ['lucide-react'] // Keep excluding lucide-react as it's ESM only
  },
  
  // Enable build cache
  build: {
    target: 'esnext',
    cssCodeSplit: false, // Combine CSS into a single file
    reportCompressedSize: false // Skip compression reporting
  },
  
  // Optimize server startup
  server: {
    hmr: {
      overlay: false // Disable HMR overlay for faster updates
    }
  }
});
