import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署在 /onchain-notepad/ 子路径下，资源引用必须带这个前缀。
  // 本地 dev 用根路径，否则 localhost:5173 打不开。
  base: process.env.GITHUB_ACTIONS ? '/onchain-notepad/' : '/',
})
