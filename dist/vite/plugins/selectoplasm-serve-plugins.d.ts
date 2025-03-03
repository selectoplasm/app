import type { Plugin } from 'vite'

export interface SelectoplasmPlugin extends Plugin {
    name: 'selectoplasm-plugin-server'
}

declare function pluginServeVite(): SelectoplasmPlugin

export default pluginServeVite