# @vp-tw/eslint-config

## 3.0.0

### Major Changes

- f0c85a3: BREAKING CHANGE: Upgrade the ESLint ecosystem and supporting tooling to their latest compatible releases.
  
  - Upgrade `@antfu/eslint-config` from 8 to 9 and `@eslint-react/eslint-plugin` from 4 to 5.
  - Upgrade Storybook to 10.5 and use its consolidated `storybook/preview-api` export.
  - Upgrade the remaining catalog dependencies, including Changesets 3, Commitlint 21, config inspector 3, package-json plugin 1, cspell 10, lint-staged 17, oxfmt 0.66, Vitest 4.1, and Vite 8.
  - Require Node.js `^22.22.2 || >=24.15.0` to match the package-json plugin runtime requirement.
  - Keep TypeScript on 6.0 because TypeScript 7 does not provide the compiler API required by typescript-eslint and unbuild. The separate native preview package continues to provide `tsgo`.
  - Update generated config-name coverage for Antfu 9 and ensure package assets are copied before direct builds.
  - Resolve all currently reported pnpm audit findings, including the vulnerable PostCSS selector parser resolutions from GHSA-w9m9-85wc-3x92.
  
  Consumers should review new or changed rules from the Antfu 9 and ESLint React 5 upgrades before adopting this release.

## 2.0.0

### Major Changes

- a73e803: BREAKING CHANGE: Upgrade core tooling and ESLint ecosystem to their latest majors.

  - `eslint`: `^9.39.2` → `^10.2.1` (removes eslintrc support; flat config required; requires Node `^20.19.0 || ^22.13.0 || >=24`)
  - `@antfu/eslint-config`: `^7.2.0` → `^8.2.0`
  - `@eslint-react/eslint-plugin`: `^2.7.4` → `^4.2.3` (all sub-plugins merged into a single `@eslint-react` plugin; rule names are now flat, e.g. `@eslint-react/dom-no-unsafe-target-blank` instead of `@eslint-react/dom/no-unsafe-target-blank`)
  - `@eslint/config-inspector`: `^1.4.2` → `^2.0.0`
  - `eslint-plugin-react-refresh`: `^0.4.26` → `^0.5.2`
  - `eslint-plugin-package-json`: `^0.88.2` → `^0.91.1` (new required rules: `require-repository`, `require-sideEffects`)
  - `typescript`: `^5.9.3` → `^6.0.3` (new defaults: `strict: true`, `target: es2025`, `module: esnext`, `rootDir: "."`, `types: []`, `noUncheckedSideEffectImports: true`)
  - `@typescript/native-preview` (tsgo): `^7.0.0-dev.20251219.1` → `^7.0.0-dev.20260421.2`
  - `@vp-tw/tsconfig`: `^3.2.1` → `^5.0.0`
  - Node.js: `.nvmrc` bumped to `v25.9.0`

  Internal changes to keep the config usable after the upstream shifts:

  - Add an override for `antfu/react/setup` that strips removed sub-plugin keys (`react-dom`, `react-naming-convention`, `react-rsc`, `react-web-api`) and keeps only the unified `react` and `react-refresh` entries. ESLint tolerates antfu's hardcoded `react-dom/*: "off"` rules because their level is `off`.
  - Extend the storybook config's plugin rename map with `react-hooks` → `react` so `eslint-plugin-storybook`'s built-in `react-hooks/rules-of-hooks: "off"` override for `*.stories.*` files continues to work against `@eslint-react`'s `react/rules-of-hooks`. This can be removed when `eslint-plugin-storybook` targets `@eslint-react` directly.
  - Add `pnpm.overrides` for `undici-types` to satisfy `trustPolicy: no-downgrade`.
  - Add `@types/node` to satisfy TypeScript 6's new empty-`types` default for files that use Node APIs.
  - Update rule-disable directives in internal fixtures from v3 sub-plugin names (`react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`, `react-dom/no-unsafe-target-blank`) to v4 flat names under the unified `react` plugin.
  - Update typegen script to reflect antfu v8's renamed/added config names (`antfu/markdown/disables/code`, `antfu/angular/*`, `antfu/react/typescript`, etc.).
  - Replace the project-level `ReplaceAntfuEslintRulesWithVpRulesDeeply` deep type transform (which now exceeds TypeScript 6's instantiation depth on antfu v8's `OptionsConfig`) with a declaration-merge that extends `@antfu/eslint-config`'s `RuleOptions` interface with the project's generated rule names. Every `overrides?: Rules` field in antfu's option tree (including deeply nested ones like `react.overrides`, `typescript.overrides`, etc.) continues to autocomplete the rule names this config contributes (`react/dom-*`, `@emotion/*`, `@tanstack/query/*`, `mdx/*`, `storybook/*`, `react-compiler/*`). The project-owned option shape is extracted into a shared `VpOptions` interface so `Options` and `keyof` derivations stay in sync.
  - Add `repository` and `sideEffects` fields to `package.json` for the new `eslint-plugin-package-json` requirements.
  - Migrate `.eslintignore` to a flat-config `ignores` block in `eslint.config.ts` (ESLint 10 no longer supports the file) and drop the now-unused `@eslint/compat`-based `includeIgnoreFile` wiring.
  - Remove the now-unused `eslint-plugin-react-hooks` dependency: `@antfu/eslint-config` v8 no longer registers the plugin and `@eslint-react` v4 owns the hook rules under the `react/` prefix.

  Downstream consumers of `@vp-tw/eslint-config` should:

  1. Require Node.js `^20.19.0 || ^22.13.0 || >=24`.
  2. Update any existing `eslint-disable` comments that reference sub-plugin rule names removed in `@eslint-react` v4 — all five sub-plugin namespaces are folded into the unified `react` plugin with flat rule names:
     - `react-dom/<rule>` → `react/dom-<rule>`
     - `react-hooks/<rule>` → `react/<rule>`
     - `react-hooks-extra/<rule>` → `react/hooks-extra-<rule>`
     - `react-naming-convention/<rule>` → `react/naming-convention-<rule>`
     - `react-web-api/<rule>` → `react/web-api-<rule>`
  3. Review any `types: []` TypeScript 6 fallout (e.g. add `@types/node` + `"types": ["node"]` in tsconfig for files that rely on Node globals).
  4. If your pnpm workspace uses `trustPolicy: no-downgrade` and you hit a downgrade error on `undici-types`, add an override for it:
     ```yaml
     # pnpm-workspace.yaml
     overrides:
       undici-types: "^8.1.0"
     ```

## 1.0.5

### Patch Changes

- pnpm release

## 1.0.4

### Patch Changes

- 71e42b2: Add contributing guide and CLAUDE.md

## 1.0.3

### Patch Changes

- 68031c4: Lazy load `@eslint-react/eslint-plugin` to avoid loading when `react: false`

## 1.0.2

### Patch Changes

- 421cfbe: fix: add explicit type annotation to `extendsConfig` to resolve TS2742 build error

## 1.0.1

### Patch Changes

- bc6826c: - Migrate `.prettierignore` to `.eslintignore` for ESLint ignore patterns
  - Add ignore patterns to `.oxfmtrc.json` for oxfmt
  - Update VSCode workspace to recommend oxc extension
  - CI: Only run on push to main branch (PR checks still run on all PRs)

## 1.0.0

### Major Changes

- 1d2fce9: - Replace Prettier with oxfmt (Oxc-based formatter, ~30x faster)
  - Add `pnpm` extends config for `pnpm-workspace.yaml` key sorting
  - Fix `@eslint-react` plugin renaming for sub-namespaces
  - Upgrade `eslint-flat-config-utils` to v3.0.0
  - Add `typescript` option for React extends config

## 0.2.0

### Minor Changes

- 4afc2fe: chore: update deps

## 0.1.6

### Patch Changes

- a8b5090: Update dependencies to the latest versions

## 0.1.5

### Patch Changes

- 95ac0f0: copy first then build

  Fix GitHub Actions failure: [build: bump version (#12) #3 > Release](https://github.com/VdustR/eslint-config/actions/runs/15724249016/job/44310932884)

## 0.1.4

### Patch Changes

- 6ed35d6: update deps
- e7fc1bf: disable import rules

  `eslint-plugin-import-x` has been removed from `antfu/eslint-config`.

  See: [fix: remove eslint-plugin-import-x](https://github.com/antfu/eslint-config/commit/db5a31d)

## 0.1.3

### Patch Changes

- 028f436: upgrade infra

## 0.1.2

### Patch Changes

- 348d968: bump versions
