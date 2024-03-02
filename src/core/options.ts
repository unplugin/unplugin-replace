import type { FilterPattern } from '@rollup/pluginutils'

type Replacement = string | ((id: string) => string)

interface BaseOptions {
  /**
   * A picomatch pattern, or array of patterns, of files that should be
   * processed by this plugin (if omitted, all files are included by default)
   */
  include?: FilterPattern
  /**
   * Files that should be excluded, if `include` is otherwise too permissive.
   */
  exclude?: FilterPattern
  /**
   * If false, skips source map generation. This will improve performance.
   * @default true
   */
  sourceMap?: boolean
  /**
   * To replace every occurrence of `<@foo@>` instead of every occurrence
   * of `foo`, supply delimiters
   */
  delimiters?: [string, string]
  /**
   * Prevents replacing strings where they are followed by a single equals
   * sign.
   */
  preventAssignment?: boolean
  objectGuards?: boolean
  /**
   * You can separate values to replace from other options.
   */
  values?: { [str: string]: Replacement }

  enforce?: 'pre' | 'post' | undefined
}

export interface Options extends BaseOptions {
  /**
   * All other options are treated as `string: replacement` replacers,
   * or `string: (id) => replacement` functions.
   */
  [str: string]:
    | Replacement
    | BaseOptions['include']
    | BaseOptions['values']
    | BaseOptions['preventAssignment']
}
type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type OptionsResolved = Overwrite<
  Required<BaseOptions>,
  {
    enforce: BaseOptions['enforce']
  }
>

export function resolveOption(options: Options): OptionsResolved {
  return {
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    sourceMap: options.sourceMap ?? true,
    delimiters: options.delimiters || ['\\b', '\\b(?!\\.)'],
    preventAssignment: options.preventAssignment ?? false,
    objectGuards: options.objectGuards ?? false,
    values: getReplacements(),
    enforce: 'enforce' in options ? options.enforce : 'pre',
  }

  function getReplacements() {
    if (options.values) {
      return Object.assign({}, options.values)
    }
    const values = Object.assign({}, options)
    delete values.delimiters
    delete values.include
    delete values.exclude
    delete values.sourcemap
    delete values.sourceMap
    delete values.objectGuards
    return values as OptionsResolved['values']
  }
}
