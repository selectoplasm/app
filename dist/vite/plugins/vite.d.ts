import type { Plugin } from 'vite'

declare module 'selectoplasm/vite' {
  export function servePlugins(): Plugin
  export function selectoplasm(): Plugin
}