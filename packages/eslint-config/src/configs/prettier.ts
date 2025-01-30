import type { ConfigOverrides, TypedFlatConfigItem } from "../types";

import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import defu from "defu";
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
  const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
    options?.prettier,
    {
      ...eslintConfigPrettier,
      rules: renameRules(eslintConfigPrettier.rules),
      name: "vdustr/prettier/rules",
    },
  );
  return rulesConfig;
};

export { prettier };
