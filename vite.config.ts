import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      name: 'DynamicCascadingSelect',
      entry: './src/index.ts',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
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
