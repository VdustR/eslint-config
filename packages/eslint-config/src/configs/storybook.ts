import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { renameRules } from "../utils/renameRules";

const storybook = async (): Promise<Array<TypedFlatConfigItem>> => {
  await ensurePackages(["eslint-plugin-storybook"]);
  const storybookPlugin = await interopDefault(
    import("eslint-plugin-storybook"),
  );
  return storybookPlugin.configs["flat/csf-strict"].map((config) => {
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
};

export { storybook };
