/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import Replace from 'unplugin-replace/rolldown'
 *
 * export default {
 *   plugins: [Replace()],
 * }
 * ```
 */
const rolldown = unplugin.rolldown as typeof unplugin.rolldown
export default rolldown
