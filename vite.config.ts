import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  optimizeDeps: {
    exclude: ['node_modules']
  },
  resolve: {
    alias: [
      {
        find: 'zrender',
        replacement: path.resolve(__dirname, 'zrender')
      }
    ]
  }
})
