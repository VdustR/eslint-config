import type { ConfigOverrides, VpComposer } from "../types";
import { omit, pick } from "es-toolkit";
import { GLOB_CODE_WORKSPACE } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

namespace jsonc {
  export interface Options {
    jsonc?: ConfigOverrides;
  }
}

const jsonc = async (composer: VpComposer, options?: jsonc.Options) => {
  extendsConfig(composer, "antfu/jsonc/rules", (config) => {
    const modifiedConfig = mergeConfig(
      pick(options?.jsonc ?? {}, ["files", "ignores"]),
      config,
      {
        files: [GLOB_CODE_WORKSPACE],
      },
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = mergeConfig(
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
