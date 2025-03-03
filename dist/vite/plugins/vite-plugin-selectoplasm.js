import { mkdirSync, copyFileSync, readFileSync } from 'fs'
import { join } from 'path'

export function selectoplasm() {
  // Ensure .selectoplasm directory exists
  mkdirSync('.selectoplasm', { recursive: true })
  
  copyFileSync(
    join(process.cwd(), 'node_modules/selectoplasm/dist/selectoplasm.js'),
    '.selectoplasm/selectoplasm.js'
  )

  return {
    name: 'selectoplasm',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/.selectoplasm/')) {
          try {
            const filePath = join(process.cwd(), req.url)
            const content = readFileSync(filePath)
            res.setHeader('Content-Type', 'application/javascript')
            res.end(content)
          } catch (e) {
            next()
          }
        } else {
          next()
        }
      })
    },
    transformIndexHtml() {
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            tag: 'div',
            attrs: { id: 'selectoplasm' },
            injectTo: 'body'
          },
          {
            tag: 'script',
            attrs: { src: '/.selectoplasm/selectoplasm.js' },
            injectTo: 'body'
          }
        ]
      }
      return []
    }
  }
}