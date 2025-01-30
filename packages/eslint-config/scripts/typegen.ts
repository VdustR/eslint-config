import { combine } from "@antfu/eslint-config";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";
import { mdx } from "../src/configs/mdx";
import { prettier } from "../src/configs/prettier";
import { reactCompiler } from "../src/configs/reactCompiler";
import { storybook } from "../src/configs/storybook";

(async () => {
  const pkgDir = await packageDirectory();
  if (!pkgDir) {
    throw new Error("Could not find package directory");
  }
  const distDir = path.join(pkgDir, "src");
  const targetPath = path.join(distDir, "eslint-typegen.d.ts");
  await fs.ensureDir(path.dirname(targetPath));

  const configs = await combine(
    mdx(),
    prettier(),
    reactCompiler(),
    storybook(),
  );

  /**
   * Learned from: <https://github.com/antfu/eslint-config/blob/d9b10e1/scripts/typegen.ts>
   */
  const configNames = configs
    .map((i) => i.name)
    .filter(Boolean) as Array<string>;
  let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
  });
  dts += `
  // Names of all the configs
  export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
  `;

  await fs.writeFile(targetPath, dts);
})();
