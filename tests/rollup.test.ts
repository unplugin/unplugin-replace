import path from 'node:path'
import { rollupBuild } from '@sxzz/test-utils'
import { describe, expect, test } from 'vitest'
import UnpluginReplace from '../src/rollup'

describe('rollup', () => {
  test('find string', async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(__dirname, 'fixtures/main.js'),
      [
        UnpluginReplace({
          'process.platform': '"darwin"',
        }),
      ],
    )
    expect(snapshot).toMatchSnapshot()
    expect(snapshot).not.contains('process.platform')
    expect(snapshot).contains('"darwin"')
  })

  test('find regexp', async () => {
    const { snapshot } = await rollupBuild(
      path.resolve(__dirname, 'fixtures/main.js'),
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
})
