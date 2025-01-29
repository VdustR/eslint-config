import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import { ensurePackages } from "@antfu/eslint-config";

import eslintConfigPrettier from "eslint-config-prettier";
import { renameRules } from "../utils/renameRules";

const prettier = async (): Promise<TypedFlatConfigItem> => {
  await ensurePackages(["eslint-config-prettier"]);
  return {
    name: "vdustr/prettier",
    ...eslintConfigPrettier,
    rules: renameRules(eslintConfigPrettier.rules),
  };
};

export { prettier };
