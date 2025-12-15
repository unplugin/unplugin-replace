/**
 * This entry file is for main unplugin.
 * @module
 */

import { withMagicString } from 'rolldown-string'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { resolveOptions, type Options, type ReplaceItem } from './core/options'

export type { Options }

/**
 * The main unplugin instance.
 */
const plugin: UnpluginInstance<Options | undefined, false> = createUnplugin<
  Options | undefined,
  false
>((rawOptions = {}) => {
  const options = resolveOptions(rawOptions)
  const {
    include,
    exclude,
    enforce,
    delimiters,
    objectGuards,
    preventAssignment,
  } = options
  const stringValues = options.values.filter(
    (value): value is ReplaceItem<string> => typeof value.find === 'string',
  )
  const regexpValues = options.values.filter(
    (value): value is ReplaceItem<RegExp> => value.find instanceof RegExp,
  )

  if (objectGuards) expandTypeofReplacements(stringValues)
  const pattern = buildStringPattern()

  const values = [...regexpValues]
  if (pattern) {
    values.unshift({ find: pattern, replacement: null! })
  }

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

    transform: {
      filter: { id: { include, exclude } },
      handler: withMagicString(function (s, id) {
        if (!values.length) return

        const code = s.toString()
        let match: RegExpExecArray | null

        for (const { find, replacement } of values) {
          while ((match = find.exec(code))) {
            const start = match.index
            const end = start + match[0].length

            const finalReplacement =
              find === pattern
                ? stringValues.find(({ find }) => find === match![1])!
                    .replacement
                : replacement
            const result = String(ensureFunction(finalReplacement)(id, match))
            s.overwrite(start, end, result)

            if (!find.global) break
          }
        }
      }),
    },

    vite: {
      configResolved(config) {
        options.sourceMap =
          config.command === 'build' ? !!config.build.sourcemap : true
      },
    },
  }

  function buildStringPattern(): RegExp | undefined {
    const escapedKeys = stringValues
      .map(({ find }) => find)
      .toSorted(longest)
      .map(escape)
    const lookbehind = preventAssignment
      ? String.raw`(?<!\b(?:const|let|var)\s*)`
      : ''
    const lookahead = preventAssignment ? String.raw`(?!\s*=[^=])` : ''
    const pattern = new RegExp(
      `${lookbehind}${delimiters[0]}(${escapedKeys.join('|')})${delimiters[1]}${lookahead}`,
      'g',
    )

    if (escapedKeys.length > 0) {
      return pattern
    }
  }
})
export default plugin

function escape(str: string) {
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  return str.replace(/[$()*+./?[\\\]^{|}-]/g, String.raw`\$&`)
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
  /^([$A-Z_\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*)(\.([$A-Z_\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*))+$/i
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
