import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";

import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import defu from "defu";
import { renameRules } from "../utils/renameRules";

const configNamesMapSource = {
  rules: "vdustr/prettier/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<prettier.ConfigNamesMapSource> {}
}

namespace prettier {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    prettier?: ConfigOverrides;
  }
}

const prettierInternal = async (
  options?: prettier.Options,
): Promise<TypedFlatConfigItem> => {
  await ensurePackages(["eslint-config-prettier"]);
  const eslintConfigPrettier = await interopDefault(
    import("eslint-config-prettier"),
  );
  const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
    options?.prettier,
    {
      ...eslintConfigPrettier,
      rules: renameRules(eslintConfigPrettier.rules),
      name: configNamesMapSource.rules,
    },
  );
  return rulesConfig;
};

const prettier = Object.assign(prettierInternal, {
  configNamesMapSource,
});

export { prettier };
