import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import { omit } from "es-toolkit";
import { mergeConfig } from "../utils/mergeConfig";
import { renameRules } from "../utils/renameRules";

namespace packageJson {
  export interface Options {
    setup?: ConfigOverrides;
    packageJson?: ConfigOverrides;
  }
}

const packageJson = async (options?: packageJson.Options) => {
  await ensurePackages(["eslint-plugin-package-json"]);
  const packageJson = await interopDefault(
    import("eslint-plugin-package-json/configs/recommended"),
  );
  const packageJsonSetupConfig: TypedFlatConfigItem = {
    plugins: packageJson.plugins,
    name: "vdustr/package-json/setup",
  };
  const packageJsonRulesConfig = mergeConfig(options?.packageJson, {
    ...omit(packageJson, ["name", "plugins"]),
    rules: renameRules(packageJson.rules),
    name: "vdustr/package-json/rules",
  });
  return [packageJsonSetupConfig, packageJsonRulesConfig];
};

export { packageJson };
