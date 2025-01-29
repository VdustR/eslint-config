import type { TypedFlatConfigItem } from "@antfu/eslint-config";

import eslintConfigPrettier from "eslint-config-prettier";
import { renameRules } from "../utils/renameRules";

const prettier = {
  name: "vdustr/prettier",
  ...eslintConfigPrettier,
  rules: renameRules(eslintConfigPrettier.rules),
} satisfies TypedFlatConfigItem;

export { prettier };
