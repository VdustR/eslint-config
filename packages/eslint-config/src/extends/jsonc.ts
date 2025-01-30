import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import { omit } from "es-toolkit";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import {
  GLOB_CODE_WORKSPACE,
  GLOB_CSPELL_JSON,
  GLOB_PACKAGE_JSON,
} from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  rules: "vdustr/jsonc/rules",
  sortArrayValues: "vdustr/jsonc/sortArrayValues",
  packageJsonSetup: "vdustr/package-json/setup",
  packageJsonRules: "vdustr/package-json/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<jsonc.ConfigNamesMapSource> {}
}

namespace jsonc {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    jsonc?: ConfigOverrides;
    packageJson?: ConfigOverrides;
    sortArrayValues: ConfigOverrides;
  }
}

const jsoncInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: jsonc.Options,
) => {
  extendsConfig(
    composer,
    "antfu/jsonc/rules",
    (config) => {
      config = {
        ...config,
        files: [
          /**
           * Inherited.
           */
          ...(config.files ?? []),

          /**
           * Default.
           */
          GLOB_CODE_WORKSPACE,

          /**
           * Overridable.
           */
          ...(options?.jsonc?.files ?? []),
        ],
        ignores: [
          /**
           * Inherited.
           */
          ...(config.ignores ?? []),

          /**
           * Default.
           */
          GLOB_PACKAGE_JSON,

          /**
           * Overridable.
           */
          ...(options?.jsonc?.ignores ?? []),
        ],
      };
      return [
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

          files: [...(config.files ?? [])],
          ignores: [...(config.ignores ?? [])],

          /**
           * Overridable.
           */
          ...omit(options?.jsonc ?? {}, ["files", "ignores"]),
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

            /**
             * Overridable.
             */
            ...options?.jsonc?.rules,
          },
        } satisfies typeof config,
        {
          plugins: packageJson.plugins,
          name: configNamesMapSource.packageJsonSetup,
        },
        {
          /**
           * Inherited.
           */
          ...omit(packageJson, ["plugins"]),

          /**
           * Default.
           */
          name: configNamesMapSource.packageJsonRules,

          /**
           * Overridable.
           */
          ...options?.packageJson,

          plugins: {
            /**
             * Inherited.
             */
            ...packageJson.plugins,

            /**
             * Overridable.
             */
            ...options?.packageJson?.plugins,
          },

          rules: {
            /**
             * Inherited.
             */
            ...packageJson.rules,

            /**
             * Overridable.
             */
            ...options?.packageJson?.rules,
          },
        } satisfies typeof config,
        {
          /**
           * Default.
           */
          name: configNamesMapSource.sortArrayValues,

          /**
           * Overridable.
           */
          ...options?.sortArrayValues,

          files: [GLOB_CSPELL_JSON, ...(options?.sortArrayValues?.files ?? [])],
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
            ...options?.sortArrayValues?.rules,
          },
        } satisfies typeof config,
      ];
    },
    ["antfu/sort/package-json", "antfu/sort/tsconfig-json"],
  );
};

const jsonc = Object.assign(jsoncInternal, {
  configNamesMapSource,
});

export { jsonc };
