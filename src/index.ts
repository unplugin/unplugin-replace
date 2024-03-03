import { type TransformResult, createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import { type Options, type ReplaceItem, resolveOptions } from './core/options'

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
  } = resolveOptions(rawOptions)
  const filter = createFilter(include, exclude)

  const stringValues = values.filter(
    (value): value is ReplaceItem<string> => typeof value.find === 'string',
  )
  const regexpValues = values.filter(
    (value): value is ReplaceItem<RegExp> => value.find instanceof RegExp,
  )

  if (objectGuards) expandTypeofReplacements(stringValues)
  const escapedKeys = stringValues
    .map(({ find }) => find)
    .sort(longest)
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .map(escape)
  const lookahead = preventAssignment ? '(?!\\s*(=[^=]|:[^:]))' : ''
  const pattern = new RegExp(
    `${delimiters[0]}(${escapedKeys.join('|')})${delimiters[1]}${lookahead}`,
    'g',
  )

  const name = 'unplugin-replace'
  return {
    name,
    enforce,

    buildStart() {
      if (![true, false].includes(preventAssignment)) {
        console.warn({
          message: `${name}: 'preventAssignment' currently defaults to false. It is recommended to set this option to \`true\`, as the next major version will default this option to \`true\`.`,
        })
      }
    },

    transformInclude(id) {
      if (escapedKeys.length === 0 && regexpValues.length === 0) return false
      return filter(id)
    },

    transform(code, id) {
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
    let has = false
    let match: RegExpExecArray | null

    const values: ReplaceItem<RegExp>[] = [...regexpValues]
    if (escapedKeys.length > 0)
      values.push({ find: pattern, replacement: null! })

    for (const { find, replacement } of values) {
      while ((match = find.exec(code))) {
        has = true

        const start = match.index
        const end = start + match[0].length

        const finalReplacement =
          find === pattern
            ? stringValues.find(({ find }) => find === match![1])!.replacement
            : replacement
        const result = String(ensureFunction(finalReplacement)(id, match))
        magicString.overwrite(start, end, result)

        if (!find.global) break
      }
    }

    return has
  }
})

function escape(str: string) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return str.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')
}

function ensureFunction(
  functionOrValue: any,
): (id: string, match: RegExpExecArray) => any {
  if (typeof functionOrValue === 'function') return functionOrValue
  return () => functionOrValue
}

function longest(a: string, b: string) {
  return b.length - a.length
}

const objKeyRegEx =
  /^([$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*)(\.([$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*))+$/
function expandTypeofReplacements(values: ReplaceItem<string>[]) {
  values.forEach(({ find }) => {
    const objMatch = find.match(objKeyRegEx)
    if (!objMatch) return
    let dotIndex = objMatch[1].length
    let lastIndex = 0
    do {
      values.push(
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)} ===`,
          replacement: '"object" ===',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)} !==`,
          replacement: '"object" !==',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)}===`,
          replacement: '"object"===',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)}!==`,
          replacement: '"object"!==',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)} ==`,
          replacement: '"object" ===',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)} !=`,
          replacement: '"object" !==',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)}==`,
          replacement: '"object"===',
        },
        {
          find: `typeof ${find.slice(lastIndex, dotIndex)}!=`,
          replacement: '"object"!==',
        },
      )
      lastIndex = dotIndex + 1
      dotIndex = find.indexOf('.', lastIndex)
    } while (dotIndex !== -1)
  })
}
