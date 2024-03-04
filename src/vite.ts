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
 * import Macros from 'unplugin-replace/vite'
 *
 * export default defineConfig({
 *   plugins: [Macros()],
 * })
 * ```
 */
export default unplugin.vite
