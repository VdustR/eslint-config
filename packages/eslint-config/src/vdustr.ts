import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";

import type { Config, ConfigNamesMap } from "./types";
import antfu, {
  GLOB_ASTRO_TS,
  GLOB_JS,
  GLOB_JSX,
  GLOB_MARKDOWN_CODE,
  GLOB_TS,
  GLOB_TSX,
} from "@antfu/eslint-config";
import packageJson from "eslint-plugin-package-json/configs/recommended";

import { isPackageExists } from "local-pkg";
import { mdx } from "./configs/mdx";
import { prettier } from "./configs/prettier";
import { storybook } from "./configs/storybook";
import { reactCompiler } from "./lib/eslint-plugin-react-compiler";
import "./eslint-typegen";

type Options = Omit<NonNullable<Parameters<typeof antfu>[0]>, "stylistic"> & {
  mdx?: boolean | mdx.Options;
  storybook?: boolean | storybook.Options;
  prettier?: boolean | prettier.Options;
};

const vdustr = (options?: Options, ...userConfigs: Array<Config>) => {
  const typescriptEnabled = isPackageExists("typescript");
  const jsoncEnabled: boolean = Boolean(options?.jsonc ?? true);
  const reactEnabled: boolean = Boolean(options?.react ?? false);
  let config: FlatConfigComposer<
    TypedFlatConfigItem,
    ConfigNames | keyof ConfigNamesMap
  > = antfu(
    {
      // We use `prettier`.
      stylistic: false,
      ...options,
    },
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
      },
    }))

    /**
     * Allow default exports in certain files.
     */
    .insertAfter("antfu/imports/rules", {
      name: "vdustr/no-default-export",
      rules: {
        /**
         * Enforcing named exports improves consistency, enhances auto-completion and refactoring, and avoids issues
         * with default export renaming. Additionally, default exports might lead to different behavior when transformed
         * to CJS.
         */
        "import/no-default-export": "error",
      },
      files: [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX],
      ignores: [
        // Configuration files
        "**/*.config.*",
        GLOB_MARKDOWN_CODE,
        GLOB_ASTRO_TS,
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
      .insertAfter("antfu/jsonc/rules", packageJson)
      .remove("antfu/sort/package-json")
      .remove("antfu/sort/tsconfig-json");
  }

  if (reactEnabled) {
    config = config.override("antfu/react/rules", async (config) => {
      return {
        ...config,
        plugins: {
          ...config.plugins,
          "react-compiler": await reactCompiler(),
        },
        rules: {
          ...config.rules,
          "react-compiler/react-compiler": "error",

          /**
           * Not all destructuring assignments are more readable than their alternatives.
           */
          "react/prefer-destructuring-assignment": "off",
        },
      };
    });
  }

  const storybookEnabled: boolean = Boolean(options?.storybook ?? false);

  if (storybookEnabled) {
    const storybookOptions: undefined | storybook.Options =
      typeof options?.storybook !== "object" ? undefined : options.storybook;
    config = config.append(
      storybook(...(!storybookOptions ? [] : [storybookOptions])),
    );
  }

  const mdxEnabled: boolean = Boolean(options?.mdx ?? false);

  if (mdxEnabled) {
    const mdxOptions: Extract<Options["mdx"], Record<PropertyKey, any>> = {
      ...(typeof options?.mdx !== "object" ? null : options.mdx),
    };
    const mdxFlatCodeBlocksEnabled: boolean = Boolean(
      mdxOptions?.codeBlocks ?? true,
    );
    const mdxFlatCodeBlocksOptions: Extract<
      (typeof mdxOptions)["codeBlocks"],
      Record<PropertyKey, any>
    > = {
      ...(typeof mdxOptions?.codeBlocks !== "object"
        ? null
        : mdxOptions.codeBlocks),
    };

    config = config.append(
      mdx({
        ...mdxOptions,
        codeBlocks: !mdxFlatCodeBlocksEnabled
          ? false
          : {
              ...mdxFlatCodeBlocksOptions,
              rules: {
                "import/no-default-export": "off",
                ...mdxFlatCodeBlocksOptions?.rules,
              },
            },
      }),
    );
  }

  const prettierEnabled: boolean = Boolean(options?.prettier ?? true);
  if (prettierEnabled) {
    const prettierOptions: undefined | prettier.Options =
      typeof options?.prettier !== "object" ? undefined : options.prettier;
    config = config.append(
      prettier(...(!prettierOptions ? [] : [prettierOptions])),
    );
  }

  return config;
};

export { vdustr };
