import { type TransformResult, createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import { type Options, resolveOption } from './core/options'

export default createUnplugin<Options | undefined, false>((rawOptions = {}) => {
  let {
    include,
    exclude,
    preventAssignment,
    objectGuards,
    sourceMap,
    delimiters,
    values,
    enforce,
  } = resolveOption(rawOptions)
  const filter = createFilter(include, exclude)

  if (objectGuards) expandTypeofReplacements(values)
  const functionValues = mapToFunctions(values)
  // eslint-disable-next-line unicorn/no-array-callback-reference
  const keys = Object.keys(functionValues).sort(longest).map(escape)
  const lookahead = preventAssignment ? '(?!\\s*(=[^=]|:[^:]))' : ''
  const pattern = new RegExp(
    `${delimiters[0]}(${keys.join('|')})${delimiters[1]}${lookahead}`,
    'g',
  )

  const name = 'unplugin-replace'
  return {
    name,
    enforce,

    buildStart() {
      if (![true, false].includes(preventAssignment)) {
        console.warn({
          message:
            "unplugin-replace: 'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`.",
        })
      }
    },

    transformInclude(id) {
      return filter(id)
    },

    transform(code, id) {
      if (keys.length === 0) return null
      if (!filter(id)) return null
      return executeReplacement(code, id)
    },

    vite: {
      configResolved(config) {
        sourceMap = config.command === 'build' ? !!config.build.sourcemap : true
      },
    },
  }

  function executeReplacement(code: string, id: string) {
    const magicString = new MagicString(code)
    if (!codeHasReplacements(code, id, magicString)) {
      return null
    }

    const result: TransformResult = { code: magicString.toString() }
    if (sourceMap) {
      result.map = magicString.generateMap({ hires: true })
    }
    return result
  }

  function codeHasReplacements(
    code: string,
    id: string,
    magicString: MagicString,
  ) {
    let result = false
    let match

    while ((match = pattern.exec(code))) {
      result = true

      const start = match.index
      const end = start + match[0].length
      const replacement = String(functionValues[match[1]](id))
      magicString.overwrite(start, end, replacement)
    }
    return result
  }
})

function escape(str: string) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return str.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')
}

function ensureFunction(functionOrValue: any): () => any {
  if (typeof functionOrValue === 'function') return functionOrValue
  return () => functionOrValue
}

function longest(a: string, b: string) {
  return b.length - a.length
}

function mapToFunctions(object: Record<string, any>): Record<string, Function> {
  return Object.keys(object).reduce((fns, key) => {
    const functions: Record<string, Function> = Object.assign({}, fns)
    functions[key] = ensureFunction(object[key])
    return functions
  }, {})
}

const objKeyRegEx =
  /^([$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*)(\.([$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*))+$/
function expandTypeofReplacements(replacements: Record<string, any>) {
  Object.keys(replacements).forEach((key) => {
    const objMatch = key.match(objKeyRegEx)
    if (!objMatch) return
    let dotIndex = objMatch[1].length
    let lastIndex = 0
    do {
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)} ===`] =
        '"object" ==='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)} !==`] =
        '"object" !=='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)}===`] =
        '"object"==='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)}!==`] =
        '"object"!=='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)} ==`] =
        '"object" ==='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)} !=`] =
        '"object" !=='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)}==`] = '"object"==='
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(lastIndex, dotIndex)}!=`] = '"object"!=='
      lastIndex = dotIndex + 1
      dotIndex = key.indexOf('.', lastIndex)
    } while (dotIndex !== -1)
  })
}
