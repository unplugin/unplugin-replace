import path from 'node:path'
import { expect, test } from 'vitest'
import { rollupBuild } from '@vue-macros/test-utils'
import UnpluginReplace from '../src/rollup'

test('rollup', async () => {
  const result = await rollupBuild(
    path.resolve(__dirname, 'fixtures/main.js'),
    [
      UnpluginReplace({
        'process.platform': '"darwin"',
      }),
    ],
  )
  expect(result).toMatchSnapshot()
})
