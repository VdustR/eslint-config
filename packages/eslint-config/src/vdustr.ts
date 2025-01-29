// eslint-disable-next-line import/no-empty-named-blocks -- Type only import.
import type {} from "./eslint-typegen";
import type { Config } from "./types";
import antfu from "@antfu/eslint-config";

import packageJson from "eslint-plugin-package-json/configs/recommended";

import { isPackageExists } from "local-pkg";
import { mdx } from "./configs/mdx";
import { prettier } from "./configs/prettier";
import { storybook } from "./configs/storybook";
import { reactCompiler } from "./lib/eslint-plugin-react-compiler";

type Options = NonNullable<Parameters<typeof antfu>[0]> & {
  mdx?: boolean | mdx.Options;
  storybook?: boolean;
};

const vdustr = (options?: Options, ...userConfigs: Array<Config>) => {
  const typescriptEnabled = isPackageExists("typescript");
  const jsoncEnabled: boolean = Boolean(options?.jsonc ?? true);
  const reactEnabled: boolean = Boolean(options?.react ?? false);
  const storybookEnabled: boolean = Boolean(options?.storybook ?? false);
  const mdxOptions = options?.mdx ?? true;
  type Config = NonNullable<Parameters<typeof antfu>[1]>;
  const defaultConfigs: Array<Config> = [
    ...(!jsoncEnabled ? [] : [packageJson]),
    ...(!mdxOptions
      ? []
      : mdx({
          ...(typeof mdxOptions !== "object" ? null : mdxOptions),
        })),
    ...(!storybookEnabled ? [] : storybook),
    prettier,
  ];
  let config = antfu(
    {
      // We use `prettier`.
      stylistic: false,
      ...options,
    },
    ...defaultConfigs,
    ...userConfigs,
  );

  config = config
    .override("antfu/javascript/rules", (config) => ({
      ...config,
      rules: {
        ...config.rules,
        /**
         * Some callbacks are purposefully named to make the code self-documenting.
         */
        "prefer-arrow-callback": "off",

        /**
         * This rule does not integrate well with JSDoc `@link` tags. It's advised
         * to verify its behavior with TypeScript instead.
         */
        "no-unused-vars": "off",
        "unused-imports/no-unused-vars": "off",
        "unused-imports/no-unused-imports-ts": "off",
        "unused-imports/no-unused-vars-ts": "off",
        "unused-imports/no-unused-imports": "off",
      },
    }))
    .override("antfu/imports/rules", (config) => ({
      ...config,
      rules: {
        ...config.rules,
        /**
         * Forbid `import {} from "module"`.
         */
        "import/no-empty-named-blocks": "error",

        /**
         * Wildcard imports can prevent tree shaking and cause name conflicts.
         * Consider using named imports instead.
         */
        "import/no-namespace": "error",

        /**
         * Enforcing named exports improves consistency, enhances auto-completion and refactoring, and avoids issues
         * with default export renaming. Additionally, default exports might lead to different behavior when transformed
         * to CJS.
         */
        "import/no-default-export": "error",
      },
    }))

    /**
     * Allow default exports in certain files.
     */
    .insertAfter("antfu/imports/rules", {
      name: "vdustr/allow-default-export",
      rules: {
        "import/no-default-export": "off",
      },
      files: [
        "**/*.config.*",
        // Single file components
        "**/*.vue",
        "**/*.svelte",
      ],
    });

  if (typescriptEnabled) {
    config = config.override("antfu/typescript/rules", (config) => ({
      ...config,
      rules: {
        ...config.rules,
        "ts/array-type": ["error", { default: "generic" }],

        /**
         * Namespaces are useful for centralizing the management of types. Just avoid
         * overusing them with runtime code.
         *
         * - References:
         *   - <https://x.com/mattpocockuk/status/1805606072167940167>
         */
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",

        /**
         * Check for unused variables in TypeScript.
         */
        "ts/no-unused-vars": "off",
      },
    }));
  }

  if (jsoncEnabled) {
    config = config
      .override("antfu/jsonc/rules", (config) => ({
        ...config,
        rules: {
          ...config.rules,
          "jsonc/sort-keys": "error",
        },
        files: [...(config.files ?? []), "**/*.code-workspace"],
        ignores: [
          ...(config.ignores ?? []),
          /**
           * Lint `package.json` files with `eslint-plugin-package-json` instead.
           */
          "**/package.json",
        ],
      }))
      .remove("antfu/sort/package-json")
      .remove("antfu/sort/tsconfig-json");
  }

  if (reactEnabled) {
    config = config.override("antfu/react/rules", (config) => ({
      ...config,
      plugins: {
        ...config.plugins,
        "react-compiler": reactCompiler,
      },
      rules: {
        ...config.rules,
        "react-compiler/react-compiler": "error",

        /**
         * Not all destructuring assignments are more readable than their alternatives.
         */
        "react/prefer-destructuring-assignment": "off",
      },
    }));
  }

  if (storybookEnabled) {
    config = config.override("storybook:csf:stories-rules", (config) => ({
      ...config,
      rules: {
        ...config.rules,
        "import/no-default-export": "off",
      },
    }));
  }

  return config;
};

export { vdustr };
