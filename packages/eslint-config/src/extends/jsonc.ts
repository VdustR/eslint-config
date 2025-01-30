import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import {
  GLOB_CODE_WORKSPACE,
  GLOB_CSPELL_JSON,
  GLOB_PACKAGE_JSON,
} from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

namespace jsonc {
  export interface Options {
    jsonc?: ConfigOverrides;
    sortArrayValues?: ConfigOverrides;
    packageJson?: ConfigOverrides;
  }
}

const jsonc = async (composer: VpComposer, options?: jsonc.Options) => {
  await ensurePackages(["eslint-plugin-package-json"]);
  const packageJson = await interopDefault(
    import("eslint-plugin-package-json/configs/recommended"),
  );
  extendsConfig(
    composer,
    "antfu/jsonc/rules",
    (config) => {
      const modifiedConfig = defu<
        TypedFlatConfigItem,
        Array<TypedFlatConfigItem>
      >(pick(options?.jsonc ?? {}, ["files", "ignores"]), config, {
        files: [GLOB_CODE_WORKSPACE],
        ignores: [GLOB_PACKAGE_JSON],
      });
      const omittedConfig = omit(modifiedConfig, ignoreKeys);
      const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
        omit(options?.jsonc ?? {}, ["files", "ignores"]),
        {
          name: "vdustr/jsonc/rules",
          rules: {
            /**
             * Default.
             */
            "jsonc/sort-keys": [
              "error",
              {
                pathPattern: ".*",
                order: {
                  type: "asc",
                  caseSensitive: false,
                  natural: true,
                },
              },
            ],
          },
        },
        omittedConfig,
      );
      const sortArrayValuesConfig = defu<
        TypedFlatConfigItem,
        Array<TypedFlatConfigItem>
      >(options?.sortArrayValues, {
        name: "vdustr/jsonc/sort-array-values/rules",
        files: [GLOB_CSPELL_JSON],
        rules: {
          "jsonc/sort-array-values": [
            "error",
            {
              pathPattern: ".*",
              order: {
                type: "asc",
                caseSensitive: false,
                natural: true,
              },
            },
          ],
        },
      });
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
      return [
        modifiedConfig,
        rulesConfig,
        sortArrayValuesConfig,
        packageJsonSetupConfig,
        packageJsonRulesConfig,
      ];
    },
    ["antfu/sort/package-json", "antfu/sort/tsconfig-json"],
  );
};

export { jsonc };
