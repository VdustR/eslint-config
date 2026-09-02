import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import {
  renameRules as antfuRenameRules,
  defaultPluginRenaming,
  ensurePackages,
  interopDefault,
} from "@antfu/eslint-config";
import { pick } from "es-toolkit";
import { mergeConfig } from "../utils/mergeConfig";
import { renameRules } from "../utils/renameRules";

// `eslint-plugin-storybook` disables `react-hooks/rules-of-hooks` on stories
// (so `render()` can use hooks via `storybook/preview-api`). Route that to
// `@eslint-react`'s `react/rules-of-hooks`, which is where hook rules live here.
// This shim is required for any `eslint-plugin-storybook` version that still
// emits `react-hooks/*` rules (including the current `^10.5.10`).
const storybookPluginRenaming = {
  ...defaultPluginRenaming,
  "react-hooks": "react",
};

const renameStorybookRules = (rules: TypedFlatConfigItem["rules"]) =>
  antfuRenameRules(rules ?? {}, storybookPluginRenaming);

namespace storybook {
  export interface Options {
    stories?: ConfigOverrides;
    main?: ConfigOverrides;
  }
}

const storybook = async (options?: storybook.Options): Promise<Array<TypedFlatConfigItem>> => {
  await ensurePackages(["eslint-plugin-storybook", "storybook"]);
  const storybookPlugin = await interopDefault(import("eslint-plugin-storybook"));
  const inheritingConfigs = storybookPlugin.configs["flat/csf-strict"];
  const originalSetupConfig = inheritingConfigs[0] as TypedFlatConfigItem;
  const originalStoryRulesConfig = inheritingConfigs[1] as TypedFlatConfigItem;
  const originalMainRulesConfig = inheritingConfigs[2] as TypedFlatConfigItem;
  const originalCsfStrictConfig = inheritingConfigs[3] as TypedFlatConfigItem;
  if (!originalSetupConfig) throw new Error("Missing setup config");
  if (!originalStoryRulesConfig) throw new Error("Missing story rules config");
  if (!originalMainRulesConfig) throw new Error("Missing main rules config");
  if (!originalCsfStrictConfig) throw new Error("Missing csf strict config");
  const setupConfig: TypedFlatConfigItem = {
    ...pick(originalSetupConfig, ["plugins"]),
    name: "vdustr/stroybook/setup",
  };
  const storyRulesConfig = mergeConfig(
    options?.stories,
    {
      name: "vdustr/storybook/stories/rules",
      rules: {
        /**
         * `eslint-plugin-import-x` has been removed from `antfu/eslint-config`.
         *
         * See: [fix: remove eslint-plugin-import-x](https://github.com/antfu/eslint-config/commit/db5a31d)
         */
        // "import/no-default-export": "off",
      },
    },
    {
      ...originalStoryRulesConfig,
      ...originalCsfStrictConfig,
      rules: renameStorybookRules({
        ...originalStoryRulesConfig.rules,
        ...originalCsfStrictConfig.rules,
      }),
    },
  );
  const mainRulesConfig = mergeConfig(
    options?.main,
    {
      name: "vdustr/storybook/main/rules",
    },
    {
      ...originalMainRulesConfig,
      rules: renameRules(originalMainRulesConfig.rules ?? {}),
    },
  );
  return [setupConfig, storyRulesConfig, mainRulesConfig] satisfies Array<TypedFlatConfigItem>;
};

export { storybook };
