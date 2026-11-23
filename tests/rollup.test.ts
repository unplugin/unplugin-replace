import path from 'node:path'
import { rollupBuild } from '@sxzz/test-utils'
import { describe, expect, test } from 'vitest'
import UnpluginReplace from '../src/rollup.ts'

describe('rollup', () => {
  test('find string', async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(import.meta.dirname, 'fixtures/main.js'),
      [
        UnpluginReplace({
          'process.platform': '"darwin"',
          COMMENT_FLAG: 'null',
        }),
      ],
    )
    expect(snapshot).toMatchSnapshot()
    expect(snapshot).contains('COMMENT_FLAG')
    expect(snapshot).not.contains('process.platform')
    expect(snapshot).contains('"darwin"')
  })

  test('find regexp', async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(import.meta.dirname, 'fixtures/main.js'),
      [
        UnpluginReplace({
          values: [
            { find: /process\.\w+/g, replacement: 'null' },
            {
              find: /[A-Z]/,
              replacement: (id, match) => match[0].toLowerCase(),
            },
            {
              find: /console\.\w+/g,
              replacement: () => `console.info`,
            },
          ],
        }),
      ],
    )
    expect(snapshot).toMatchSnapshot()
    expect(snapshot).contains('console.info(dEV)')
    expect(snapshot).contains(`console.info('hello null', platform)`)
  })

  test('find regexp with special replacement patterns', async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(import.meta.dirname, 'fixtures/main.js'),
      [
        UnpluginReplace({
          values: [
            {
              find: /process\.(\w+)/g,
              replacement: 'globalThis.$1.$&.$$',
            },
            { find: /(?<flag>DEV)/, replacement: '__$<flag>__' },
          ],
        }),
      ],
    )
    expect(snapshot).contains('globalThis.platform.process.platform.$')
    expect(snapshot).not.contains('$1')
    expect(snapshot).contains('__DEV__')
  })

  test("find regexp with $' keeps comments", async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(import.meta.dirname, 'fixtures/main.js'),
      [UnpluginReplace({ values: [{ find: /\bDEV\b/, replacement: "`$'`" }] })],
    )
    expect(snapshot).contains('`)\n\n/** COMMENT_FLAG */')
  })
})
