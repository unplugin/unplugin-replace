/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import Replace from 'unplugin-replace/farm'
 *
 * export default {
 *   plugins: [Replace()],
 * }
 * ```
 */
const farm = unplugin.farm as typeof unplugin.farm
export default farm
