import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { GLOB_CSPELL_JSON } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
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

namespace sortJsonKeys {
  export interface Options {
    sortKeys?: ConfigOverrides;
  }
}

const sortJsonKeys = async (
  composer: VpComposer,
  options?: sortJsonKeys.Options,
) => {
  extendsConfig(composer, "vdustr/jsonc/rules", async (config) => {
    const omittedConfig = omit(config, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      options?.sortKeys,
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

namespace sortPackageJson {
  export interface Options {
    packageJson?: ConfigOverrides;
  }
}

/**
 * Disable rules conflicting with `eslint-config-package-json`.
 */
const sortPackageJson = async (
  composer: VpComposer,
  options?: sortPackageJson.Options,
) => {
  extendsConfig(composer, "antfu/sort/package-json", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.packageJson ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      options?.packageJson,
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
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.tsconfigJson ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      options?.tsconfigJson,
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

namespace sortJsonArrayValues {
  export interface Options {
    sortJsonArrayValues?: ConfigOverrides;
  }
}

const sortJsonArrayValues = async (
  composer: VpComposer,
  options?: sortJsonArrayValues.Options,
) => {
  extendsConfig(composer, "vdustr/sort/json-keys", async (config) => {
    const sortArrayValuesConfig: TypedFlatConfigItem = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(options?.sortJsonArrayValues, {
      name: "vdustr/sort/json-array-values",
      files: [GLOB_CSPELL_JSON],
      rules: {
        "jsonc/sort-array-values": defaultSortJsonArrayValues,
      },
    });
    return [config, sortArrayValuesConfig];
  });
};

export { sortJsonArrayValues, sortJsonKeys, sortPackageJson, sortTsconfigJson };
