/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Replace from 'unplugin-replace/vite'
 *
 * export default defineConfig({
 *   plugins: [Replace()],
 * })
 * ```
 */
export default unplugin.vite
