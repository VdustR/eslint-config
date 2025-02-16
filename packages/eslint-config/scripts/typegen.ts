import antfu, { combine } from "@antfu/eslint-config";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";
import { antfuOptions } from "../../../eslint.config.antfuOptions";
import { mdx } from "../src/configs/mdx";
import { prettier } from "../src/configs/prettier";
import { reactCompiler } from "../src/configs/reactCompiler";
import { storybook } from "../src/configs/storybook";
import { imports } from "../src/extends/imports";
import { javascript } from "../src/extends/javascript";
import { jsonc } from "../src/extends/jsonc";
import { react } from "../src/extends/react";
import {
  sortJsonArrayValues,
  sortJsonKeys,
  sortTsconfigJson,
} from "../src/extends/sort";
import { typescript } from "../src/extends/typescript";
import { yaml } from "../src/extends/yaml";

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

  const extendsConfigs = await (async () => {
    const antfuConfig = antfu(antfuOptions);
    javascript(antfuConfig);
    imports(antfuConfig);
    typescript(antfuConfig);
    jsonc(antfuConfig);
    yaml(antfuConfig);
    react(antfuConfig);
    sortTsconfigJson(antfuConfig);
    sortJsonKeys(antfuConfig);
    sortJsonArrayValues(antfuConfig);
    return antfuConfig;
  })();

  /**
   * Learned from: <https://github.com/antfu/eslint-config/blob/d9b10e1/scripts/typegen.ts>
   */
  const configNames = [...configs, ...extendsConfigs].flatMap((item) =>
    !(item.name && item.name.startsWith("vdustr/")) ? [] : [item.name],
  );
  let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
  });
  dts += `
  // Names of all the configs
  export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
  `;

  await fs.writeFile(targetPath, dts);
})();
