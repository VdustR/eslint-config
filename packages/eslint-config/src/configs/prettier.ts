import type { Config } from "../types";
import { defaultPluginRenaming, renameRules } from "@antfu/eslint-config";

import eslintConfigPrettier from "eslint-config-prettier";

const prettier: Config = {
  name: "vdustr/prettier",
  ...eslintConfigPrettier,
  rules: renameRules(eslintConfigPrettier.rules, defaultPluginRenaming),
};

export { prettier };
