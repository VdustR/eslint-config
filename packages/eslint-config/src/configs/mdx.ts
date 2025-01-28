import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";
import type { Config } from "../types";

import * as mdxPlugin from "eslint-plugin-mdx";

namespace mdx {
  export interface Options
    extends DistributiveOmit<TypedFlatConfigItem, "processor"> {
    processorOptions?: mdxPlugin.ProcessorOptions;
    flatCodeBlocks?: boolean | Config;
  }
}

const mdx = ({
  flatCodeBlocks = true,
  processorOptions,
  ...options
}: mdx.Options = {}) =>
  [
    {
      name: "vdustr/mdx",
      ...mdxPlugin.flat,
      ...options,
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
            ...(typeof flatCodeBlocks !== "object" ? null : flatCodeBlocks),
          } satisfies Config,
        ]),
  ] satisfies Array<Config>;

export { mdx };
