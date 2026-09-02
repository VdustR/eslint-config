import type antfu from "@antfu/eslint-config";
import type { ConfigNames as AntfuConfigNames } from "@antfu/eslint-config";
import { combine } from "@antfu/eslint-config";
import { composer } from "eslint-flat-config-utils";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";
import { emotion } from "../src/configs/emotion";
import { mdx } from "../src/configs/mdx";
import { prettier } from "../src/configs/prettier";
import { reactCompiler } from "../src/configs/reactCompiler";
import { storybook } from "../src/configs/storybook";
import { tanstackQuery } from "../src/configs/tanstackQuery";
import { imports } from "../src/extends/imports";
import { javascript } from "../src/extends/javascript";
import { jsonc } from "../src/extends/jsonc";
import { pnpm } from "../src/extends/pnpm";
import { react } from "../src/extends/react";
import { sortJsonArrayValues, sortJsonKeys, sortTsconfigJson } from "../src/extends/sort";
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
    emotion(),
    tanstackQuery(),
    mdx(),
    prettier(),
    reactCompiler(),
    storybook(),
  );

  const extendsConfigs = await (async () => {
    const allAntfuConfigNames = [
      "antfu/gitignore",
      "antfu/ignores",
      "antfu/javascript/setup",
      "antfu/javascript/rules",
      "antfu/eslint-comments/rules",
      "antfu/command/rules",
      "antfu/perfectionist/setup",
      "antfu/node/setup",
      "antfu/node/rules",
      "antfu/jsdoc/setup",
      "antfu/jsdoc/rules",
      "antfu/imports/rules",
      "antfu/e18e/rules",
      "antfu/unicorn/setup",
      "antfu/unicorn/rules",
      "antfu/jsx/setup",
      "antfu/typescript/setup",
      "antfu/typescript/parser",
      "antfu/typescript/type-aware-parser",
      "antfu/typescript/rules",
      "antfu/typescript/rules-type-aware",
      "antfu/typescript/erasable-syntax-only",
      "antfu/stylistic/rules",
      "antfu/regexp/rules",
      "antfu/test/setup",
      "antfu/test/rules",
      "antfu/vue/setup",
      "antfu/vue/rules",
      "antfu/react/setup",
      "antfu/react/rules",
      "antfu/react/typescript",
      "antfu/react/type-aware-rules",
      "antfu/nextjs/setup",
      "antfu/nextjs/rules",
      "antfu/solid/setup",
      "antfu/solid/rules",
      "antfu/svelte/setup",
      "antfu/svelte/rules",
      "antfu/unocss",
      "antfu/astro/setup",
      "antfu/astro/rules",
      "antfu/angular/setup",
      "antfu/angular/rules/ts",
      "antfu/angular/rules/template",
      "antfu/jsonc/setup",
      "antfu/jsonc/rules",
      "antfu/sort/package-json",
      "antfu/sort/tsconfig-json",
      "antfu/pnpm/package-json",
      "antfu/pnpm/pnpm-workspace-yaml",
      "antfu/pnpm/pnpm-workspace-yaml-stylistic",
      "antfu/pnpm/pnpm-workspace-yaml-sort",
      "antfu/yaml/setup",
      "antfu/yaml/rules",
      "antfu/toml/setup",
      "antfu/toml/rules",
      "antfu/markdown/setup",
      "antfu/markdown/processor",
      "antfu/markdown/parser",
      "antfu/markdown/rules",
      "antfu/markdown/disables/code",
      "antfu/formatter/setup",
      "antfu/formatter/css",
      "antfu/formatter/scss",
      "antfu/formatter/less",
      "antfu/formatter/html",
      "antfu/formatter/xml",
      "antfu/formatter/svg",
      "antfu/formatter/markdown",
      "antfu/formatter/astro",
      "antfu/formatter/astro/disables",
      "antfu/formatter/graphql",
      "antfu/disables/scripts",
      "antfu/disables/cli",
      "antfu/disables/bin",
      "antfu/disables/dts",
      "antfu/disables/cjs",
      "antfu/disables/config-files",
    ] satisfies Array<AntfuConfigNames>;
    type RuntimeAntfuConfigNames = (typeof allAntfuConfigNames)[number];
    /**
     * Make sure following type assertions are correct.
     */
    undefined as unknown as RuntimeAntfuConfigNames satisfies AntfuConfigNames;
    undefined as unknown as AntfuConfigNames satisfies RuntimeAntfuConfigNames;
    const stubAntfuConfig: ReturnType<typeof antfu> = ((): typeof stubAntfuConfig => {
      let c = composer();
      allAntfuConfigNames.forEach((name) => {
        c = c.append({ name });
      });
      return c;
    })();
    javascript(stubAntfuConfig);
    imports(stubAntfuConfig);
    typescript(stubAntfuConfig);
    jsonc(stubAntfuConfig);
    yaml(stubAntfuConfig);
    react(stubAntfuConfig);
    sortTsconfigJson(stubAntfuConfig);
    sortJsonKeys(stubAntfuConfig);
    sortJsonArrayValues(stubAntfuConfig);
    pnpm(stubAntfuConfig);
    return stubAntfuConfig;
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
