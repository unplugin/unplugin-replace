/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-replace/webpack')()],
 * }
 * ```
 */
export default unplugin.webpack
