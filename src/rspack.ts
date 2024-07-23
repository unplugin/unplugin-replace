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
 * ```ts
 * // rspack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-replace/rspack')()],
 * }
 * ```
 */
export default unplugin.rspack
