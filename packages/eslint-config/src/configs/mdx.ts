import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";
import { defaultPluginRenaming, renameRules } from "@antfu/eslint-config";

// eslint-disable-next-line import/no-namespace -- `mdx` exports the plugin as a namespace.
import * as mdxPlugin from "eslint-plugin-mdx";

namespace mdx {
  export interface Options
    extends DistributiveOmit<TypedFlatConfigItem, "processor"> {
    processorOptions?: mdxPlugin.ProcessorOptions;
    flatCodeBlocks?: boolean | TypedFlatConfigItem;
  }
}

const mdx = ({
  flatCodeBlocks = true,
  processorOptions,
  ...options
}: mdx.Options = {}) => {
  const flatCodeBlocksOptions: TypedFlatConfigItem =
    typeof flatCodeBlocks !== "object" ? {} : flatCodeBlocks;
  const configs: Array<TypedFlatConfigItem> = [
    {
      name: "vdustr/mdx",
      ...mdxPlugin.flat,
      ...options,
      rules: {
        ...renameRules(
          {
            ...mdxPlugin.flat.rules,
          },
          defaultPluginRenaming,
        ),
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
              ...renameRules(
                {
                  ...mdxPlugin.flatCodeBlocks.rules,
                },
                defaultPluginRenaming,
              ),
              ...flatCodeBlocksOptions.rules,
            },
          } satisfies TypedFlatConfigItem,
        ]),
  ];
  return configs;
};

export { mdx };
