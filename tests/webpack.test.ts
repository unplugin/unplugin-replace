import path from 'node:path'
import os from 'node:os'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { expect, onTestFinished, test } from 'vitest'
import webpack from 'webpack'
import UnpluginReplace from '../src/webpack'

test('webpack', async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'unplugin-replace-'))
  onTestFinished(() => rm(tmp, { recursive: true, force: true }))

  await new Promise<webpack.Stats>((resolve, reject) => {
    const compiler = webpack({
      entry: path.resolve(__dirname, 'fixtures/main.js'),
      output: {
        path: tmp,
      },
      plugins: [
        UnpluginReplace({
          'process.platform': '"darwin"',
        }),
      ],
      mode: 'production',
      target: 'node',
      optimization: {
        minimize: false,
      },
    })
    compiler.run((error, stats) => {
      if (error) return reject(error)
      resolve(stats!)
    })
  })

  const result = await readFile(path.resolve(tmp, 'main.js'), 'utf-8')
  expect(result).toMatchSnapshot()
})
