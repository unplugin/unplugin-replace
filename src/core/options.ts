import type { FilterPattern } from 'unplugin-utils'

export type Replacement =
  | string
  | ((id: string, match: RegExpExecArray) => string)
export type ReplaceItem<F = string | RegExp> = {
  find: F
  replacement: Replacement
}
export type ReplaceMap = {
  [str: string]: Replacement
}

export interface BaseOptions {
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
   *
   * For Vite, this option will be enabled on build mode
   * and respect `build.sourcemap`.
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
  values?: ReplaceMap | ReplaceItem[]
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
    include: BaseOptions['include']
    exclude: BaseOptions['exclude']
    enforce: BaseOptions['enforce']
    values: ReplaceItem[]
  }
>

export function resolveOptions(options: Options): OptionsResolved {
  return {
    include: options.include,
    exclude: options.exclude,
    sourceMap: options.sourceMap ?? true,
    delimiters: options.delimiters || [String.raw`\b`, String.raw`\b(?!\.)`],
    preventAssignment: options.preventAssignment ?? false,
    objectGuards: options.objectGuards ?? false,
    values: getReplacements(),
    enforce: 'enforce' in options ? options.enforce : 'pre',
  }

  function getReplacements() {
    if (options.values) {
      if (Array.isArray(options.values)) {
        return options.values
      }
      return normalizeObjectValues(options.values)
    }

    const values = Object.assign({}, options)
    delete values.delimiters
    delete values.include
    delete values.exclude
    delete values.sourcemap
    delete values.sourceMap
    delete values.objectGuards
    return normalizeObjectValues(values as ReplaceMap)
  }
}

function normalizeObjectValues(values: ReplaceMap): ReplaceItem[] {
  return Object.entries(values).map(([find, replacement]) => ({
    find,
    replacement,
  }))
}
