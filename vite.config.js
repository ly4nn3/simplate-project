import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    root: 'src',
    build: {
        outDir: '../dist'
    },
    envDir: '../',
    define: {
      'import.meta.env.VITE_SPOONACULAR': JSON.stringify(env.VITE_SPOONACULAR)
    }
  }
})