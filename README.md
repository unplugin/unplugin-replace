# unplugin-replace [![npm](https://img.shields.io/npm/v/unplugin-replace.svg)](https://npmjs.com/package/unplugin-replace) [![jsr](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fjsr-api.sxzz.moe%2Fversion%2F%40unplugin%2Freplace&query=version&prefix=v&label=jsr&color=%23f7df1e)](https://jsr.io/@unplugin/replace)

[![Unit Test](https://github.com/unplugin/unplugin-replace/actions/workflows/unit-test.yml/badge.svg)](https://github.com/unplugin/unplugin-replace/actions/workflows/unit-test.yml)

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

Refer to [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace#options).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2024-PRESENT [三咲智子](https://github.com/sxzz)
