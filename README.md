# unplugin-replace

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSR][jsr-src]][jsr-href]
[![Unit Test][unit-test-src]][unit-test-href]

🍣 A universal bundler plugin which replaces targeted strings in files, based on [@rollup/plugin-replace](https://www.npmjs.com/package/@rollup/plugin-replace).

## Installation

```bash
# npm
npm i -D unplugin-replace

# jsr
npx jsr add -D @unplugin/replace
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Replace from 'unplugin-replace/vite'

export default defineConfig({
  plugins: [Replace()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Replace from 'unplugin-replace/rollup'

export default {
  plugins: [Replace()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-replace/esbuild')()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-replace/webpack')()],
}
```

<br></details>

## Usage

### Options

For all options please refer to [docs](https://github.com/rollup/plugins/tree/master/packages/replace#options).

This plugin accepts all [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace#options) options, and some extra options that are specific to this plugin.

### `options.values`

- Type: `{ [find: string]: Replacement } | ReplaceItem[]`
- Default: `[]`

```ts
type ReplaceItem = {
  /** Supply a string or RegExp to find what you are looking for. */
  find: string | RegExp

  /**
   * Can be a string or a function.
   * - If it's a string, it will replace the substring matched by pattern. A number of special replacement patterns are supported
   * - If it's a function, it will be invoked for every match and its return value is used as the replacement text.
   */
  replacement: Replacement
}
type Replacement = string | ((id: string, match: RegExpExecArray) => string)
```

Comparing with `@rollup/plugin-replace`, `find` option supports regex pattern.

**Example:**

```ts
Replace({
  values: [
    {
      find: /apples/gi,
      replacement: 'oranges',
    },
    {
      find: 'process.env.NODE_ENV',
      replacement: '"production"',
    },
  ],
})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2024-PRESENT [Kevin Deng](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unplugin-replace.svg
[npm-version-href]: https://npmjs.com/package/unplugin-replace
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-replace
[npm-downloads-href]: https://www.npmcharts.com/compare/unplugin-replace?interval=30
[jsr-src]: https://jsr.io/badges/@unplugin/replace
[jsr-href]: https://jsr.io/@unplugin/replace
[unit-test-src]: https://github.com/unplugin/unplugin-replace/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/unplugin/unplugin-replace/actions/workflows/unit-test.yml
