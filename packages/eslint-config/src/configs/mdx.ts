import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";

import {
  ensurePackages,
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  interopDefault,
} from "@antfu/eslint-config";
import { omit, pick } from "es-toolkit";
import { renameRules } from "../utils/renameRules";

const configNamesMapSource = {
  setup: "vdustr/mdx/setup",
  processor: "vdustr/mdx/processor",
  rules: "vdustr/mdx/rules",
  codeBlocks: "vdustr/mdx/code-blocks",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<mdx.ConfigNamesMapSource> {}
}

namespace mdx {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options extends ConfigOverrides {
    processorOptions?: import("eslint-plugin-mdx").ProcessorOptions;
    codeBlocks?: boolean | ConfigOverrides;
  }
}

const mdxInternal = async ({
  codeBlocks = true,
  processorOptions,
  ...options
}: mdx.Options = {}): Promise<Array<TypedFlatConfigItem>> => {
  await ensurePackages(["eslint-plugin-mdx"]);
  const mdxPlugin = await interopDefault(await import("eslint-plugin-mdx"));
  const codeBlocksOptions: TypedFlatConfigItem =
    typeof codeBlocks !== "object" ? {} : codeBlocks;
  const configs: Array<TypedFlatConfigItem> = [
    {
      ...pick(mdxPlugin.flat, ["plugins"]),
      name: configNamesMapSource.setup,
    },
    {
      processor: mdxPlugin.createRemarkProcessor({
        lintCodeBlocks: Boolean(codeBlocks),
        ...processorOptions,
        languageMapper: {
          ...processorOptions?.languageMapper,
        },
      }),
      name: configNamesMapSource.processor,
    },
    {
      /**
       * Inherited.
       */
      ...omit(mdxPlugin.flat, ["plugins", "processor"]),

      /**
       * Default.
       */
      name: configNamesMapSource.rules,
      ignores: [
        /**
         * Handled by `@eslint/markdown`.
         */
        GLOB_MARKDOWN,
      ],

      /**
       * Overridable.
       */
      ...options,
      rules: {
        /**
         * Inherited.
         */
        ...renameRules({
          ...mdxPlugin.flat.rules,
        }),

        /**
         * Overridable.
         */
        ...options.rules,
      },
    },
    ...(!codeBlocks
      ? []
      : [
          {
            /**
             * Inherited.
             */
            ...mdxPlugin.flatCodeBlocks,

            /**
             * Default.
             */
            name: configNamesMapSource.codeBlocks,
            ignores: [
              /**
               * Handled by `@eslint/markdown`.
               */
              GLOB_MARKDOWN_CODE,
            ],

            /**
             * Overridable.
             */
            ...codeBlocksOptions,

            rules: {
              /**
               * Inherited.
               */
              ...renameRules({
                ...mdxPlugin.flatCodeBlocks.rules,
              }),

              /**
               * Overridable.
               */
              ...codeBlocksOptions.rules,
            },
          } satisfies TypedFlatConfigItem,
        ]),
  ];
  return configs;
};

const mdx = Object.assign(mdxInternal, {
  configNamesMapSource,
});

export { mdx };
