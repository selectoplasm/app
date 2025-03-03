import fs from 'fs'
import path from 'path'

export default function pluginServeVite() {
  return {
    name: 'selectoplasm-plugin-server',
    apply: 'serve',
    
    configureServer(server) {
      server.middlewares.use('/api/selectoplasm-plugins', (req, res) => {
        const pluginsDir = path.resolve(process.cwd(), '.selectoplasm/plugins')
        const plugins = {}

        if (!fs.existsSync(pluginsDir)) {
          res.end(JSON.stringify({ plugins: {} }))
          return
        }

        const pluginFolders = fs.readdirSync(pluginsDir)
        
        for (const pluginName of pluginFolders) {
          const pluginPath = path.join(pluginsDir, pluginName)
          const readmePath = path.join(pluginPath, 'README.md')

          if (!fs.existsSync(readmePath)) {
            continue
          }

          const plugin = {
            name: pluginName
          }

          // Read shared scripts first
          const sharedScriptsPath = path.join(pluginsDir, 'sharedScripts.js')
          const sharedScripts = fs.existsSync(sharedScriptsPath) ? fs.readFileSync(sharedScriptsPath, 'utf-8') : ''

          const readFileIfExists = (filePath) => {
            return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : undefined
          }

          const files = {
            config: readFileIfExists(path.join(pluginPath, 'config.html')),
            previewHtml: readFileIfExists(path.join(pluginPath, 'preview.html')),
            previewCss: readFileIfExists(path.join(pluginPath, 'preview.css')),
            patternsHtml: readFileIfExists(path.join(pluginPath, 'patterns.html')),
            patternsCss: readFileIfExists(path.join(pluginPath, 'patterns.css')),
            worker: readFileIfExists(path.join(pluginPath, 'worker.js'))
          }

          if (files.worker) {
            files.worker = files.worker.replace('importScripts("/plugins/sharedScripts.js")', '')
            files.worker = `${sharedScripts}\n${files.worker}`
          }

          Object.entries(files).forEach(([key, value]) => {
            if (value !== undefined) {
              plugin[key] = value
            }
          })

          plugins[pluginName] = plugin
        }

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ plugins }))
      })
    }
  }
}