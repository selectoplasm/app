import servePlugins from "./serve-plugins.js"
import fileSaveEndpoint from "./file-save-endpoint.js"
import mount from "./mount-selectoplasm.js"

export default function combinedPlugins(options = {}) {
  return [
    servePlugins(options.serve),
    fileSaveEndpoint(options.fileSave),
    mount(options.mount)
  ]
}
