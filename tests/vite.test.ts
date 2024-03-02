import path from 'node:path'
import { expect, test } from 'vitest'
import { build } from 'vite'
import UnpluginReplace from '../src/vite'
import type { RollupOutput } from 'rollup'

test('vite', async () => {
  const root = path.resolve(__dirname, 'fixtures')
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
  })) as RollupOutput
  expect(output[0].code).toMatchSnapshot()
})
