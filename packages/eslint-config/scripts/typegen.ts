import type { ESLint } from "eslint";
import { rules } from "eslint-plugin-mdx/lib/rules";
import reactCompiler from "eslint-plugin-react-compiler";
import { pluginsToRulesDTS } from "eslint-typegen/core";
import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";

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
    ...definePlugins({ "react-compiler": reactCompiler }),
    ...definePlugins({
      mdx: {
        rules,
      },
    }),
  };

  await fs.writeFile(targetPath, await pluginsToRulesDTS(plugins));
})();
