import type { ConfigOverrides, TypedFlatConfigItem } from "../types";

import {
  ensurePackages,
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  interopDefault,
} from "@antfu/eslint-config";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { renameRules } from "../utils/renameRules";

namespace mdx {
  export interface Options {
    mdx?: ConfigOverrides;
    processorOptions?: Omit<
      import("eslint-plugin-mdx").ProcessorOptions,
      "lintCodeBlocks"
    >;
    codeBlocks?: boolean | ConfigOverrides;
  }
}

const mdx = async ({
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
    name: "vdustr/mdx/setup",
  };
  const processorConfig: TypedFlatConfigItem = {
    processor: mdxPlugin.createRemarkProcessor({
      ...processorOptions,
      lintCodeBlocks: Boolean(codeBlocks),
    }),
    name: "vdustr/mdx/processor",
  };
  const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
    options.mdx,
    {
      ...omit(mdxPlugin.flat, ["plugins", "processor"]),
      name: "vdustr/mdx/rules",
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
      name: "vdustr/mdx/code-blocks",
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

export { mdx };
