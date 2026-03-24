import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const commonAlias = {
  '@type': resolve('src/types')
}
export default defineConfig({
  main: {
    resolve: {
      alias: {
        ...commonAlias,
        '@': resolve('src/main')
      },
      extensions: ['.ts']
    }
  },
  preload: {
    resolve: {
      alias: commonAlias
    }
  },
  renderer: {
    resolve: {
      alias: {
        ...commonAlias,
        '@': resolve('src/renderer/src'),
        assets: resolve('src/renderer/src/assets')
      },
      extensions: ['.ts', '.tsx']
    },
    plugins: [react(), svgr()]
  }
})
