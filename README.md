# `@vp-tw/eslint-config`

ViPro's ESLint configuration.

- Built on top of [antfu/eslint-config](https://github.com/antfu/eslint-config).
- Integrates with:
  - [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)
  - [eslint-plugin-package-json](https://github.com/JoshuaKGoldberg/eslint-plugin-package-json)
  - [@emotion/eslint-plugin](https://www.npmjs.com/package/@emotion/eslint-plugin)
  - [@tanstack/eslint-plugin-query](https://www.npmjs.com/package/@tanstack/eslint-plugin-query)
  - [eslint-mdx](https://github.com/mdx-js/eslint-mdx)
  - [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)
  - [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)
  - [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - disables formatting rules to work with any formatter (Prettier, oxfmt, etc.)
- Fine-tuned to provide an opinionated, optimal DX. Please copy the VSCode settings from [eslint-config.code-workspace](https://github.com/VdustR/eslint-config/blob/main/eslint-config.code-workspace).

Check [here](https://vp-tw.github.io/eslint-config/) to preview the ESLint inspection.

## Installation

```bash
pnpm i -D eslint @antfu/eslint-config @vp-tw/eslint-config
```

## Usage

Similar to [antfu/eslint-config](https://github.com/antfu/eslint-config) but with additional options:

```ts
// eslint.config.ts
import { vdustr } from "@vp-tw/eslint-config";

export default vdustr(
  {
    // By default, we disable `stylistic` and use `prettier` instead.
    // stylistic: false,

    // Options (defaults shown)
    react: false, // Enable React support with eslint-react strict-typescript rules
    svelte: false, // Enable Svelte support
    packageJson: true, // Enable package.json linting
    emotion: false, // Enable Emotion CSS-in-JS linting
    tanstackQuery: false, // Enable TanStack Query linting
    mdx: false, // Enable MDX linting
    storybook: false, // Enable Storybook linting
    prettier: true, // Enable eslint-config-prettier to disable formatting rules

    // Extends options for fine-grained control
    extends: {
      react: {
        typescript: true, // Use strict-typescript rules (default: true)
      },
    },
  },
  {
    ignores: ["**/dist/**", "**/CHANGELOG.md", ".changeset/**"],
  },
);
```

## Features

### React Support

When `react: true`, this config uses `@eslint-react/eslint-plugin` with `strict-typescript` rules by default. You can disable TypeScript-specific rules:

```ts
export default vdustr({
  react: true,
  extends: {
    react: {
      typescript: false, // Use strict rules instead of strict-typescript
    },
  },
});
```

### pnpm Workspace Sorting

Automatically sorts keys in `pnpm-workspace.yaml` alphabetically using `yaml/sort-keys` rule.

## Contributing

### Development

```bash
pnpm install            # Install dependencies
pnpm build              # Build @vp-tw/eslint-config (in packages/eslint-config)
pnpm test               # Run tests for @vp-tw/eslint-config
pnpm run checkTypes     # Type check entire workspace
pnpm lint               # Lint entire workspace
```

### Release

Managed by [changesets](https://github.com/changesets/changesets). CI auto-publishes when merged to main.

```bash
pnpm changeset          # Create changeset interactively
```

### Adding Dynamic Import Wrappers

When adding support for optional ESLint plugins, create a wrapper in `src/lib/`:

```typescript
// src/lib/my-plugin.ts
import type MyPlugin from "eslint-plugin-my";
import { interopDefault } from "@antfu/eslint-config";

// Explicit return type required to avoid TS2742 build errors
const myPlugin = (): Promise<typeof MyPlugin> => interopDefault(import("eslint-plugin-my"));

export { myPlugin };
```

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and patterns.

## License

MIT © ViPro <vdustr@gmail.com> (<https://vdustr.github.io>)
