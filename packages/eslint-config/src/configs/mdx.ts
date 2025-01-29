import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";

import { renameRules } from "../utils/renameRules";

namespace mdx {
  export interface Options
    extends DistributiveOmit<TypedFlatConfigItem, "processor"> {
    processorOptions?: import("eslint-plugin-mdx").ProcessorOptions;
    flatCodeBlocks?: boolean | TypedFlatConfigItem;
  }
}

const mdx = async ({
  flatCodeBlocks = true,
  processorOptions,
  ...options
}: mdx.Options = {}): Promise<Array<TypedFlatConfigItem>> => {
  await ensurePackages(["eslint-plugin-mdx"]);
  const mdxPlugin = await interopDefault(await import("eslint-plugin-mdx"));
  const flatCodeBlocksOptions: TypedFlatConfigItem =
    typeof flatCodeBlocks !== "object" ? {} : flatCodeBlocks;
  const configs: Array<TypedFlatConfigItem> = [
    {
      name: "vdustr/mdx",
      ...mdxPlugin.flat,
      ...options,
      rules: {
        ...renameRules({
          ...mdxPlugin.flat.rules,
        }),
        ...options.rules,
      },
      processor: mdxPlugin.createRemarkProcessor({
        lintCodeBlocks: Boolean(flatCodeBlocks),
        ...processorOptions,
        languageMapper: {
          ...processorOptions?.languageMapper,
        },
      }),
    },
    ...(!flatCodeBlocks
      ? []
      : [
          {
            name: "vdustr/mdx/flat-code-blocks",
            ...mdxPlugin.flatCodeBlocks,
            ...flatCodeBlocksOptions,
            rules: {
              ...renameRules({
                ...mdxPlugin.flatCodeBlocks.rules,
              }),
              ...flatCodeBlocksOptions.rules,
            },
          } satisfies TypedFlatConfigItem,
        ]),
  ];
  return configs;
};

export { mdx };
