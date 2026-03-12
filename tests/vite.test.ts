import path from 'node:path'
import { build } from 'vite'
import { expect, test } from 'vitest'
import UnpluginReplace from '../src/vite.ts'
import type { RolldownOutput } from 'rolldown'

test('vite', async () => {
  const root = path.resolve(import.meta.dirname, 'fixtures')
  const { output } = (await build({
    root,
    build: {
      minify: false,
      rollupOptions: {
        input: [path.resolve(root, 'main.js')],
        external: (id) => id === 'node:process',
        logLevel: 'silent',
      },
      write: false,
    },
    logLevel: 'silent',
    plugins: [
      UnpluginReplace({
        'process.platform': '"darwin"',
      }),
    ],
  })) as RolldownOutput
  expect(output[0].code).toMatchSnapshot()
  expect(output[0].code).not.contains('process.platform')
  expect(output[0].code).contains('"darwin"')
})
