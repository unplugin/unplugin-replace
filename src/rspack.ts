/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```js
 * // rspack.config.js
 * import Replace from 'unplugin-replace/rspack'
 *
 * default export {
 *  plugins: [Replace()],
 * }
 * ```
 */
const rspack = unplugin.rspack as typeof unplugin.rspack
export default rspack
