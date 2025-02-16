import type { ConfigOverrides, VpComposer } from "../types";
import { omit, pick } from "es-toolkit";
import eslintPluginYml from "eslint-plugin-yml";
import { GLOB_PNPM_WORKSPACE_YAML } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { renameRules } from "../utils/renameRules";
import { ignoreKeys } from "./_utils";

namespace yaml {
  export interface Options {
    yaml?: ConfigOverrides;
    sortKeys?: ConfigOverrides;
  }
}

const yaml = (composer: VpComposer, options?: yaml.Options) => {
  extendsConfig(composer, "antfu/yaml/rules", (config) => {
    const modifiedConfig = mergeConfig(
      pick(options?.yaml ?? {}, ["files", "ignores"]),
      config,
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = mergeConfig(
      omit(options?.yaml ?? {}, ["files", "ignores"]),
      {
        name: "vdustr/yaml/rules",
        rules: renameRules({
          ...Object.fromEntries([
            ...eslintPluginYml.configs["flat/recommended"].flatMap((config) =>
              Object.entries(config.rules ?? {}),
            ),
            ...eslintPluginYml.configs["flat/prettier"].flatMap((config) =>
              Object.entries(config.rules ?? {}),
            ),
          ]),
        }),
      },
      omittedConfig,
    );
    const sortKeysConfig = mergeConfig(options?.sortKeys, {
      ...omit(omittedConfig, ["files", "ignores"]),
      name: "vdustr/yaml/sort-keys/rules",
      files: [GLOB_PNPM_WORKSPACE_YAML],
      rules: {
        "yaml/sort-keys": [
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
    return [modifiedConfig, rulesConfig, sortKeysConfig];
  });
};

export { yaml };
