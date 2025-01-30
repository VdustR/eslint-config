import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import { omit } from "es-toolkit";
import eslintPluginYml from "eslint-plugin-yml";
import { GLOB_PNPM_WORKSPACE_YAML } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { renameRules } from "../utils/renameRules";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  rules: "vdustr/yaml/rules",
  sortKeys: "vdustr/yaml/sortKeys",
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
  extendsConfig(composer, "antfu/yaml/rules", (config) => [
    config,
    {
      /**
       * Inherited.
       */
      ...omit(config, ignoreKeys),

      /**
       * Default.
       */
      name: configNamesMapSource.rules,

      /**
       * Overridable.
       */
      ...options,
      rules: {
        /**
         * Inherited from `eslint-plugin-yml`.
         */
        ...renameRules({
          ...Object.fromEntries([
            ...eslintPluginYml.configs["flat/recommended"].flatMap((config) =>
              Object.entries(config.rules ?? {}),
            ),
            ...eslintPluginYml.configs["flat/prettier"].flatMap((config) =>
              Object.entries(config.rules ?? {}),
            ),
          ]),
        }),

        /**
         * Overridable.
         */
        ...options?.yaml?.rules,
      },
    } satisfies typeof config,
    {
      /**
       * Inherited.
       */
      ...config,

      /**
       * Default.
       */
      name: configNamesMapSource.sortKeys,

      /**
       * Overridable.
       */
      ...options?.sortKeys,
      files: [...GLOB_PNPM_WORKSPACE_YAML, ...(options?.sortKeys?.files ?? [])],
      rules: {
        "yaml/sort-keys": ["error", "asc"],
        ...options?.sortKeys?.rules,
      },
    } satisfies typeof config,
  ]);
};

const yaml = Object.assign(yamlInternal, {
  configNamesMapSource,
});

export { yaml };
