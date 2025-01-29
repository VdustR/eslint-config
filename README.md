# `@vp-tw/eslint-config`

ViPro's ESLint configuration.

- Built on top of [antfu/eslint-config](https://github.com/antfu/eslint-config).
- Integrates with:
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
  - [eslint-mdx](https://github.com/mdx-js/eslint-mdx)
  - [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)
  - [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)
- Fine-tuned to provide an opinionated, optimal DX. Please copy the VSCode settings from [eslint-config.code-workspace](https://github.com/VdustR/eslint-config/blob/main/eslint-config.code-workspace).

Check [here](https://vdustr.dev/eslint-config) to preview the ESLint inspection.

## Installation

```bash
pnpm i -D eslint @antfu/eslint-config @vp-tw/eslint-config
```

## Usage

Simlar to [antfu/eslint-config](https://github.com/antfu/eslint-config) but with additional options:

```ts
// eslint.config.ts
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import { vdustr } from "@vp-tw/eslint-config";
import path from "pathe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prettierignorePath = path.resolve(__dirname, ".prettierignore");

export default vdustr(
  {
    // `stylistic` has been removed in favor of `prettier`.
    // stylistic: true,
    storybook: true,
    mdx: true,
  },
  includeIgnoreFile(prettierignorePath),
);
```

## Known Issues

## `RulesRecord` Type Definition Not Applied

If the rule record type definitions are not applied correctly, the plugin rules
supported by this ESLint config may not appear in properties that rely on these
types, such as `overrides`.

For example, you might not see the rule key `react-compiler/react-compiler` as
expected.

To fix this, you may need to prevent the outdated package `@types/eslint` from
being installed. This can be done by creating a `.pnpmfile.cjs` file:

- [ESLint v9.10.0 released - Types now included](https://eslint.org/blog/2024/09/eslint-v9.10.0-released/#types-now-included)
- [feat: Add types #18854](https://github.com/eslint/eslint/pull/18854)

```js
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies) {
        delete pkg.dependencies["@types/eslint"];
      }
      return pkg;
    },
  },
};
```

## License

MIT © ViPro <vdustr@gmail.com> (<http://vdustr.dev>)
