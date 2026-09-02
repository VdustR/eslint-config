---
"@vp-tw/eslint-config": major
---

BREAKING CHANGE: Upgrade the ESLint ecosystem and supporting tooling to their latest compatible releases.

- Upgrade `@antfu/eslint-config` from 8 to 9 and `@eslint-react/eslint-plugin` from 4 to 5.
- Upgrade Storybook to 10.5 and use its consolidated `storybook/preview-api` export.
- Upgrade the remaining catalog dependencies, including Changesets 3, Commitlint 21, config inspector 3, package-json plugin 1, cspell 10, lint-staged 17, oxfmt 0.66, Vitest 4.1, and Vite 8.
- Require Node.js `^22.22.2 || >=24.15.0` to match the package-json plugin runtime requirement.
- Keep TypeScript on 6.0 because TypeScript 7 does not provide the compiler API required by typescript-eslint and unbuild. The separate native preview package continues to provide `tsgo`.
- Update generated config-name coverage for Antfu 9 and ensure package assets are copied before direct builds.
- Resolve all currently reported pnpm audit findings, including the vulnerable PostCSS selector parser resolutions from GHSA-w9m9-85wc-3x92.

Consumers should review new or changed rules from the Antfu 9 and ESLint React 5 upgrades before adopting this release.
