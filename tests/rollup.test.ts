import path from 'node:path'
import { rollupBuild } from '@vue-macros/test-utils'
import { describe, expect, test } from 'vitest'
import UnpluginReplace from '../src/rollup'

describe('rollup', () => {
  test('find string', async () => {
    const result = await rollupBuild(
      path.resolve(__dirname, 'fixtures/main.js'),
      [
        UnpluginReplace({
          'process.platform': '"darwin"',
        }),
      ],
    )
    expect(result).toMatchSnapshot()
    expect(result).not.contains('process.platform')
    expect(result).contains('"darwin"')
  })

  test('find regexp', async () => {
    const result = await rollupBuild(
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
    expect(result).toMatchSnapshot()
    expect(result).contains('console.info(dEV)')
    expect(result).contains(`console.info('hello null', platform)`)
  })
})
