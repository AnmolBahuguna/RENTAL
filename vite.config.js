import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to silence [vite] HMR browser console messages
const silenceViteLogs = () => ({
  name: 'silence-vite-hmr-logs',
  transform(code, id) {
    if (id.includes('/@vite/client') || id.includes('/vite/dist/client')) {
      // Remove console.log calls that output [vite] messages
      return code
        .replace(/console\.log\('%c\[vite\][^']*'[^)]*\)/g, '(void 0)')
        .replace(/console\.log\("\[vite\][^"]*"\)/g, '(void 0)')
        .replace(/console\.log\(`\[vite\][^`]*`\)/g, '(void 0)')
    }
  }
})

const logger = createLogger()
const loggerWarn = logger.warn
logger.warn = (msg, options) => {
  if (msg.includes('vite') || msg.includes('[Violation]')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  plugins: [
    react(),
    silenceViteLogs(),
  ],
  customLogger: logger,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    hmr: {
      overlay: false,
    }
  },
  build: {
    chunkSizeWarningLimit: 5000,
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
    },
  },
})
