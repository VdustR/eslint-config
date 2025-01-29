import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import storybookPlugin from "eslint-plugin-storybook";
import { renameRules } from "../utils/renameRules";

const storybook = storybookPlugin.configs["flat/csf-strict"].map((config) => {
  const allConfig = config as TypedFlatConfigItem;
  const { rules, files, plugins, ...rest } = allConfig;
  return {
    ...rest,
    ...(!rules
      ? null
      : {
          rules: renameRules(rules),
        }),
    ...(!files ? null : { files }),
    ...(!plugins ? null : { plugins }),
  } satisfies TypedFlatConfigItem;
});

export { storybook };
