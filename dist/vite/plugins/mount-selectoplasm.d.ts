import type { Plugin } from 'vite';

/**
 * Creates a Vite plugin that injects Selectoplasm into your application.
 * In development mode, it:
 * - Creates a .selectoplasm directory
 * - Copies the selectoplasm.js file from node_modules
 * - Injects necessary HTML elements and scripts
 * - Serves the selectoplasm files via middleware
 */
export function selectoplasm(): Plugin; 