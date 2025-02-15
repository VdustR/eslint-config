import type {
  ConfigNames,
  ConfigOverrides,
  Rules,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { GLOB_CSPELL_JSON } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

namespace sortJsonKeys {
  export interface Options {
    sortKeys?: ConfigOverrides;
  }
}

const sortJsonKeys = async (
  composer: VpComposer,
  options?: sortJsonKeys.Options,
) => {
  extendsConfig.pushOverations(composer, [
    async (items) => {
      const source: ConfigNames = "vdustr/jsonc/rules";
      const configIndex = items.findIndex((item) => item.name === source);
      const config = items[configIndex];
      if (!config) {
        return items;
      }
      const omittedConfig = omit(config, ignoreKeys);
      const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
        options?.sortKeys,
        {
          name: "vdustr/sort/json-keys",
          rules: {
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
      return [...items, rulesConfig];
    },
  ]);
};

namespace sortPackageJson {
  export interface Options {
    packageJson?: ConfigOverrides;
  }
}

const sortPackageJson = async (
  composer: VpComposer,
  options?: sortPackageJson.Options,
) => {
  extendsConfig(composer, "antfu/sort/package-json", (config) => {
    const rules = config.rules;
    const ruleKeys = Object.keys(rules ?? {}) as Array<keyof Rules>;
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.packageJson ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      options?.packageJson,
      {
        name: "vdustr/sort/package-json",
        /**
         * Disable all rules. Handled by `eslint-config-package-json`.
         */
        rules: Object.fromEntries(
          ruleKeys.map((key) => {
            return [key, "off"];
          }),
        ),
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

namespace sortTsconfigJson {
  export interface Options {
    tsconfigJson?: ConfigOverrides;
  }
}

const sortTsconfigJson = async (
  composer: VpComposer,
  options?: sortTsconfigJson.Options,
) => {
  extendsConfig(composer, "antfu/sort/tsconfig-json", (config) => {
    const rules = config.rules;
    const ruleKeys = Object.keys(rules ?? {}) as Array<keyof Rules>;
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.tsconfigJson ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      options?.tsconfigJson,
      {
        name: "vdustr/sort/tsconfig-json",
        /**
         * Disable all rules.
         */
        rules: Object.fromEntries(
          ruleKeys.map((key) => {
            return [key, "off"];
          }),
        ),
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

namespace sortJsonArrayValues {
  export interface Options {
    sortJsonArrayValues?: ConfigOverrides;
  }
}

const sortJsonArrayValues = async (
  composer: VpComposer,
  options?: sortJsonArrayValues.Options,
) => {
  const sortArrayValuesConfig: TypedFlatConfigItem = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.sortJsonArrayValues, {
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
  composer.append(sortArrayValuesConfig);
};

export { sortJsonArrayValues, sortJsonKeys, sortPackageJson, sortTsconfigJson };
