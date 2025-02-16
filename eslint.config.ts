import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import path from "pathe";
import { antfuOptions } from "./eslint.config.antfuOptions";
import { vdustr } from "./packages/eslint-config/src";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prettierignorePath = path.resolve(__dirname, ".prettierignore");

export default vdustr(
  {
    ...antfuOptions,
    storybook: true,
    mdx: true,
  },
  includeIgnoreFile(prettierignorePath),
);
