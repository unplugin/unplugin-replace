import path from 'node:path'
import { rolldown } from 'rolldown'
import { expect, test } from 'vitest'
import UnpluginReplace from '../src/rolldown'

test('rolldown', async () => {
  const build = await rolldown({
    input: path.resolve(__dirname, 'fixtures/main.js'),
    external: ['node:process'],
    plugins: [
      UnpluginReplace({
        'process.platform': '"darwin"',
      }),
    ],
  })
  const { output } = await build.generate({ format: 'es' })
  const code = output[0].code
  expect(code).toMatchSnapshot()
  expect(code).not.contains('process.platform')
  expect(code).contains('"darwin"')
})
