import path from 'node:path'
import { rolldown } from 'rolldown'
import { expect, test } from 'vitest'
import UnpluginReplace from '../src/rolldown.ts'

test('rolldown', async () => {
  const build = await rolldown({
    input: path.resolve(import.meta.dirname, 'fixtures/main.js'),
    external: ['node:process'],
    plugins: [
      UnpluginReplace({
        'process.platform': '"darwin"',
        COMMENT_FLAG: 'null',
      }),
    ],
  })
  const { output } = await build.generate({ format: 'es' })
  const code = output[0].code
  expect(code).toMatchSnapshot()
  expect(code).contains('COMMENT_FLAG')
  expect(code).not.contains('process.platform')
  expect(code).contains('"darwin"')
})
