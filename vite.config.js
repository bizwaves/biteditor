import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({  script: {
    defineModel: true, // 开启defineModel功能
    propsDestructure: true, // 开启props结构响应式
  } })],
})
