import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import path from "pathe";
import { vdustr } from "./packages/eslint-config/src";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prettierignorePath = path.resolve(__dirname, ".prettierignore");

export default vdustr(
  {
    react: true,
    storybook: true,
    mdx: true,
    svelte: true,
  },
  includeIgnoreFile(prettierignorePath),
);
