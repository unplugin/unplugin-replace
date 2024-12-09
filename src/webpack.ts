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
 * ```js
 * // webpack.config.js
 * import Replace from 'unplugin-replace/webpack'
 *
 * default export {
 *  plugins: [Replace()],
 * }
 * ```
 */
const webpack = unplugin.webpack as typeof unplugin.webpack
export default webpack
