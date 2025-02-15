import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import defu from "defu";
import { omit } from "es-toolkit";

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
  const packageJsonRulesConfig = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.packageJson, {
    ...omit(packageJson, ["name", "plugins"]),
    name: "vdustr/package-json/rules",
  });
  return [packageJsonSetupConfig, packageJsonRulesConfig];
};

export { packageJson };
