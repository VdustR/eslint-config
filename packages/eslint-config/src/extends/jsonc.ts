import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { GLOB_CODE_WORKSPACE, GLOB_PACKAGE_JSON } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

namespace jsonc {
  export interface Options {
    jsonc?: ConfigOverrides;
  }
}

const jsonc = async (composer: VpComposer, options?: jsonc.Options) => {
  extendsConfig(composer, "antfu/jsonc/rules", (config) => {
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
           * No overrides for now.
           */
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

export { jsonc };
