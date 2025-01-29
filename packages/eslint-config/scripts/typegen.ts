import type { ESLint } from "eslint";
import { rules as mdxRules } from "eslint-plugin-mdx/lib/rules";

import storybook from "eslint-plugin-storybook";
import { pluginsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";
import { reactCompiler } from "../src/lib/eslint-plugin-react-compiler";

(async () => {
  const pkgDir = await packageDirectory();
  if (!pkgDir) {
    throw new Error("Could not find package directory");
  }
  const distDir = path.join(pkgDir, "src");
  const targetPath = path.join(distDir, "eslint-typegen.d.ts");
  await fs.ensureDir(path.dirname(targetPath));

  type Plugins = Record<string, ESLint.Plugin>;

  function definePlugins<T extends Plugins>(plugins: T): T {
    return plugins;
  }

  const plugins: Plugins = {
    ...definePlugins({ "react-compiler": await reactCompiler() }),
    ...definePlugins({
      mdx: {
        rules: mdxRules,
      },
    }),
    ...definePlugins({
      ...Object.fromEntries(
        storybook.configs["flat/csf-strict"].flatMap((config) =>
          !("plugins" in config) || !config.plugins
            ? []
            : Object.entries(config.plugins),
        ),
      ),
    }),
  };

  await fs.writeFile(targetPath, await pluginsToRulesDTS(plugins));
})();
