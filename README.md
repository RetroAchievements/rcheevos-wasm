
[![npm](https://img.shields.io/npm/v/rcheevos.svg)](http://npm.im/rcheevos)
[![size](https://badgen.net/bundlephobia/minzip/rcheevos)](https://bundlephobia.com/package/rcheevos)

# rcheevos.js

Selective Javascript bindings for [the rcheevos library](https://github.com/RetroAchievements/rcheevos), compiled to WebAssembly. Currently only supports the `rhash` namespace, for hashing ROM files.

## Quick Start

Quick and easy way to use rcheevos to your project:

```html
<body>
  <script src="https://cdn.jsdelivr.net/npm/rcheevos/dist/umd/index.min.js"></script>
  <input id="file" type="file">
  <script>
    rcheevos.RCheevos.initialize().then((hasher) => {
      const fileInput = document.getElementById('file');
      const hash = hasher.computeHash(rcheevos.Console.GAMEBOY_ADVANCE, await fileInput.files[0].arrayBuffer());
      alert(`gba rom hash: ${hash}`);
    });
  </script>
</body>
```

Or if you want a more efficient way to get started:

```html
<script type="module">
  import { RCheevos, Console } from 'https://cdn.jsdelivr.net/npm/rcheevos/dist/es-slim/index_slim.min.js';

  RCheevos.initialize({ wasm: 'https://cdn.jsdelivr.net/npm/rcheevos/dist/rcheevos.wasm' })
    .then((hasher) => {
      const hash = hasher.computeHash(Console.GAMEBOY_ADVANCE, ArrayBuffer.from(/* ... */));
      alert(`gba rom hash: ${hash}`);
    });
</script>
```

Or if Node.js is targeted or one is bundling this inside a larger application:

```bash
npm i rcheevos
```

## Example

```js
import { RCheevos, Console } from "rcheevos";

const hasher = await RCheevos.initialize();
const hash = hasher.computeHash(Console.GAMEBOY_ADVANCE, ArrayBuffer.from(/* ... */));
```

## Slim Module

By default, the `rcheevos` entrypoint includes Wasm that is base64 inlined. This is the default as most developers will probably not need to care. However some developers will care: those running the library in environments where Wasm is executable but not compilable or those who are ambitious about reducing compute and bandwidth costs for their users.

To cater to these use cases, there is a `rcheevos/slim` package that operates the exactly the same except now it is expected for developers to prime initialization through some other means:

```js
import { RCheevos } from "rcheevos/slim";
import wasm from "rcheevos/rcheevos.wasm";

const hasher = await RCheevos.initialize({ wasm });
const out = hasher.computeHash(Console.GAMEBOY_ADVANCE, ArrayBuffer.from(/* ... */));
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
