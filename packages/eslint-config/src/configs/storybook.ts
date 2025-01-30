import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { pick } from "es-toolkit";

const configNamesMapSource = {
  setup: "vdustr/stroybook/setup",
  storiesRules: "vdustr/storybook/stories-rules",
  mainRules: "vdustr/storybook/main-rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<storybook.ConfigNamesMapSource> {}
}

namespace storybook {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    storiesConfig?: ConfigOverrides;
    mainConfig?: ConfigOverrides;
  }
}

const storybookInternal = async (
  options?: storybook.Options,
): Promise<Array<TypedFlatConfigItem>> => {
  await ensurePackages(["eslint-plugin-storybook"]);
  const storybookPlugin = await interopDefault(
    import("eslint-plugin-storybook"),
  );
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
    name: configNamesMapSource.setup,
  };
  const storyRulesConfig: TypedFlatConfigItem = {
    /**
     * Inherited.
     */
    ...originalStoryRulesConfig,
    ...originalCsfStrictConfig,

    /**
     * Default.
     */
    name: configNamesMapSource.storiesRules,

    /**
     * Overridable.
     */
    ...options?.storiesConfig,
    rules: {
      /**
       * Inherited.
       */
      ...originalStoryRulesConfig.rules,
      ...originalCsfStrictConfig.rules,

      /**
       * Default.
       */
      "import/no-default-export": "off",

      /**
       * Overridable.
       */
      ...options?.storiesConfig?.rules,
    },
  };

  const mainRulesConfig: TypedFlatConfigItem = {
    /**
     * Inherited.
     */
    ...originalMainRulesConfig,

    /**
     * Default.
     */
    name: configNamesMapSource.mainRules,

    /**
     * Overridable.
     */
    ...options?.mainConfig,
  };
  return [
    setupConfig,
    storyRulesConfig,
    mainRulesConfig,
  ] satisfies Array<TypedFlatConfigItem>;
};

const storybook = Object.assign(storybookInternal, {
  configNamesMapSource,
});

export { storybook };
