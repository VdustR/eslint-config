import type { ConfigNames } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
  TypedFlatConfigItem,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import eslintPluginYml from "eslint-plugin-yml";
import { GLOB_PNPM_WORKSPACE_YAML } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { renameRules } from "../utils/renameRules";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  yaml: "vdustr/yaml/rules",
  sortKeys: "vdustr/yaml/sort-keys/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<yaml.ConfigNamesMapSource> {}
}

namespace yaml {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    yaml?: ConfigOverrides;
    sortKeys?: ConfigOverrides;
  }
}

const yamlInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: yaml.Options,
) => {
  extendsConfig(composer, "antfu/yaml/rules", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.yaml ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.yaml ?? {}, ["files", "ignores"]),
      {
        name: configNamesMapSource.yaml,
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
    const sortKeysConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(options?.sortKeys, {
      ...omit(omittedConfig, ["files", "ignores"]),
      name: configNamesMapSource.sortKeys,
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

const yaml = Object.assign(yamlInternal, {
  configNamesMapSource,
});

export { yaml };
