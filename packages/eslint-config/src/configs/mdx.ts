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
import defu from "defu";
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
  export interface Options {
    mdx?: ConfigOverrides;
    processorOptions?: Omit<
      import("eslint-plugin-mdx").ProcessorOptions,
      "lintCodeBlocks"
    >;
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
  const setupConfig: TypedFlatConfigItem = {
    ...pick(mdxPlugin.flat, ["plugins"]),
    name: configNamesMapSource.setup,
  };
  const processorConfig: TypedFlatConfigItem = {
    processor: mdxPlugin.createRemarkProcessor({
      ...processorOptions,
      lintCodeBlocks: Boolean(codeBlocks),
    }),
    name: configNamesMapSource.processor,
  };
  const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
    options.mdx,
    {
      ...omit(mdxPlugin.flat, ["plugins", "processor"]),
      name: configNamesMapSource.rules,
      rules: renameRules(mdxPlugin.flat.rules ?? {}),
      /**
       * Handled by `@eslint/markdown`.
       */
      ignores: [...(mdxPlugin.flat.ignores ?? []), GLOB_MARKDOWN],
    },
  );

  const configs = [setupConfig, processorConfig, rulesConfig];

  if (codeBlocks) {
    const codeBlocksConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(codeBlocksOptions, {
      ...mdxPlugin.flatCodeBlocks,
      name: configNamesMapSource.codeBlocks,
      rules: renameRules(mdxPlugin.flatCodeBlocks.rules ?? {}),
      /**
       * Handled by `@eslint/markdown`.
       */
      ignores: [
        ...(mdxPlugin.flatCodeBlocks.ignores ?? []),
        GLOB_MARKDOWN_CODE,
      ],
    });
    configs.push(codeBlocksConfig);
  }

  return configs;
};

const mdx = Object.assign(mdxInternal, {
  configNamesMapSource,
});

export { mdx };
