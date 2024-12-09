/**
 * This entry file is for esbuild plugin. Requires esbuild >= 0.15
 *
 * @module
 */

import unplugin from './index'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import Replace from 'unplugin-replace/esbuild'
 * 
 * build({ plugins: [Replace()] })
```
 */
const esbuild = unplugin.esbuild as typeof unplugin.esbuild
export default esbuild
