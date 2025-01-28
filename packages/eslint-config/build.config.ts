import type { BuildConfig } from "unbuild";
import { defineBuildConfig } from "unbuild";

const basicEntry = {
  builder: "mkdist",
  input: "./src/",
  pattern: [
    "**/*.ts",
    "!**/*.test.ts",
    "!**/*.test-d.ts",
    "!**/spec/**",
    "!**/test/**",
    "!**/node_modules/**",
  ],
} satisfies NonNullable<BuildConfig["entries"]>[number];

export default defineBuildConfig({
  entries: [
    {
      ...basicEntry,
      outDir: "./dist",
      format: "cjs",
    },
    {
      ...basicEntry,
      outDir: "./dist/esm",
      format: "esm",
    },
  ],
  declaration: true,
});
