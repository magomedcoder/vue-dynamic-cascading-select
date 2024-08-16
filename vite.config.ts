import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueAddressSelector',
      fileName: (format) => `vue-address-selector.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        exports: 'named'
      }
    }
  }
})
