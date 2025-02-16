import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import { omit, pick } from "es-toolkit";
import { GLOB_CSPELL_JSON } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

const defaultSortJsonKeys: NonNullable<
  NonNullable<TypedFlatConfigItem["rules"]>["jsonc/sort-keys"]
> = [
  "error",
  {
    pathPattern: ".*",
    order: {
      type: "asc",
      caseSensitive: false,
      natural: true,
    },
  },
];

const defaultSortJsonArrayValues: NonNullable<
  NonNullable<TypedFlatConfigItem["rules"]>["jsonc/sort-array-values"]
> = [
  "error",
  {
    pathPattern: ".*",
    order: {
      type: "asc",
      caseSensitive: false,
      natural: true,
    },
  },
];

namespace sort {
  export interface Options {
    jsoncSortKeys?: ConfigOverrides;
    jsoncSortArrayValues?: ConfigOverrides;
    packageJson?: ConfigOverrides;
    tsconfigJson?: ConfigOverrides;
  }
}

const sortJsonKeys = async (
  composer: VpComposer,
  options?: sort.Options["jsoncSortKeys"],
) => {
  extendsConfig(composer, "vdustr/jsonc/rules", async (config) => {
    const omittedConfig = omit(config, ignoreKeys);
    const rulesConfig = mergeConfig(
      options,
      {
        name: "vdustr/sort/json-keys",
        rules: {
          "jsonc/sort-keys": defaultSortJsonKeys,
        },
      },
      omittedConfig,
    );
    return [config, rulesConfig];
  });
};

/**
 * Disable rules conflicting with `eslint-config-package-json`.
 */
const sortPackageJson = async (
  composer: VpComposer,
  options?: sort.Options["packageJson"],
) => {
  extendsConfig(composer, "antfu/sort/package-json", (config) => {
    const modifiedConfig = mergeConfig(
      pick(options ?? {}, ["files", "ignores"]),
      config,
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = mergeConfig(
      options,
      {
        name: "vdustr/sort/package-json",
        rules: {
          "jsonc/sort-array-values": "off",
          "jsonc/sort-keys": "off",
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

const sortTsconfigJson = async (
  composer: VpComposer,
  options?: sort.Options["tsconfigJson"],
) => {
  extendsConfig(composer, "antfu/sort/tsconfig-json", (config) => {
    const modifiedConfig = mergeConfig(
      pick(options ?? {}, ["files", "ignores"]),
      config,
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = mergeConfig(
      options,
      {
        name: "vdustr/sort/tsconfig-json",
        rules: {
          "jsonc/sort-keys": defaultSortJsonKeys,
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

const sortJsonArrayValues = async (
  composer: VpComposer,
  options?: sort.Options["jsoncSortArrayValues"],
) => {
  extendsConfig(composer, "vdustr/sort/json-keys", async (config) => {
    const sortArrayValuesConfig: TypedFlatConfigItem = mergeConfig(options, {
      name: "vdustr/sort/json-array-values",
      files: [GLOB_CSPELL_JSON],
      rules: {
        "jsonc/sort-array-values": defaultSortJsonArrayValues,
      },
    });
    return [config, sortArrayValuesConfig];
  });
};

export type { sort };
export { sortJsonArrayValues, sortJsonKeys, sortPackageJson, sortTsconfigJson };
