import type { ConfigOverrides, TypedFlatConfigItem } from "../types";

import {
  ensurePackages,
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODE,
  interopDefault,
} from "@antfu/eslint-config";
import { omit, pick } from "es-toolkit";
import { mergeConfig } from "../utils/mergeConfig";
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
  const codeBlocksOptions: ConfigOverrides =
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
  const rulesConfig = mergeConfig(
    options.mdx,
    {
      ignores: [
        /**
         * Handled by `@eslint/markdown`.
         */
        GLOB_MARKDOWN,
      ],
    },
    {
      ...omit(mdxPlugin.flat, ["plugins", "processor"]),
      name: "vdustr/mdx/rules",
      rules: renameRules(mdxPlugin.flat.rules ?? {}),
      ignores: mdxPlugin.flat.ignores ?? [],
    },
  );

  const configs = [setupConfig, processorConfig, rulesConfig];

  if (codeBlocks) {
    const codeBlocksConfig = mergeConfig(
      codeBlocksOptions,
      {
        rules: {
          "import/no-default-export": "off",
        },
        ignores: [
          /**
           * Handled by `@eslint/markdown`.
           */
          GLOB_MARKDOWN_CODE,
        ],
      },
      {
        ...mdxPlugin.flatCodeBlocks,
        name: "vdustr/mdx/code-blocks",
        rules: renameRules(mdxPlugin.flatCodeBlocks.rules ?? {}),
        ignores: mdxPlugin.flatCodeBlocks.ignores ?? [],
      },
    );
    configs.push(codeBlocksConfig);
  }

  return configs;
};

export { mdx };
