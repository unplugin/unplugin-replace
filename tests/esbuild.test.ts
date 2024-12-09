import path from 'node:path'
import { build } from 'esbuild'
import { expect, test } from 'vitest'
import UnpluginReplace from '../src/esbuild'

test('esbuild', async () => {
  const { outputFiles } = await build({
    entryPoints: [path.resolve(__dirname, 'fixtures/main.js')],
    format: 'esm',
    write: false,
    bundle: true,
    platform: 'node',
    plugins: [
      UnpluginReplace({
        'process.platform': '"darwin"',
      }),
    ],
  })
  expect(outputFiles[0].text).toMatchSnapshot()
  expect(outputFiles[0].text).not.contains('process.platform')
  expect(outputFiles[0].text).contains('"darwin"')
})
