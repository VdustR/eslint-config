import type { ConfigOverrides, TypedFlatConfigItem } from "../types";

import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { mergeConfig } from "../utils/mergeConfig";
import { renameRules } from "../utils/renameRules";

namespace prettier {
  export interface Options {
    prettier?: ConfigOverrides;
  }
}

const prettier = async (
  options?: prettier.Options,
): Promise<TypedFlatConfigItem> => {
  await ensurePackages(["eslint-config-prettier"]);
  const eslintConfigPrettier = await interopDefault(
    import("eslint-config-prettier"),
  );
  const rulesConfig = mergeConfig(options?.prettier, {
    ...eslintConfigPrettier,
    rules: renameRules(eslintConfigPrettier.rules),
    name: "vdustr/prettier/rules",
  });
  return rulesConfig;
};

export { prettier };
