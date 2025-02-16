import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import {
  GLOB_ASTRO_TS,
  GLOB_JS,
  GLOB_JSX,
  GLOB_MARKDOWN_CODE,
  GLOB_TS,
  GLOB_TSX,
} from "@antfu/eslint-config";
import { omit, pick } from "es-toolkit";
import { GLOB_CONFIG_JS, GLOB_VITEST_WORKSPACE } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

namespace imports {
  export interface Options {
    imports?: ConfigOverrides;
    noDefaultExport?: ConfigOverrides;
  }
}

const imports = (composer: VpComposer, options?: imports.Options) => {
  extendsConfig(composer, "antfu/imports/rules", (config) => {
    const modifiedConfig = mergeConfig(
      pick(options?.imports ?? {}, ["files", "ignores"]),
      config,
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig: TypedFlatConfigItem = mergeConfig(
      omit(options?.imports ?? {}, ["files", "ignores"]),
      {
        name: "vdustr/imports/rules",
        rules: {
          /**
           * Forbid `import {} from "module"`.
           */
          "import/no-empty-named-blocks": "error",

          /**
           * Wildcard imports can prevent tree shaking and cause name conflicts.
           * Consider using named imports instead.
           */
          "import/no-namespace": "error",
        },
      },
      omittedConfig,
    );
    const noDefaultExportConfig = mergeConfig(
      options?.noDefaultExport,
      {
        name: "vdustr/imports/no-default-export/rules",
        rules: {
          /**
           * Enforcing named exports improves consistency, enhances
           * auto-completion and refactoring, and avoids issues with default
           * export renaming. Additionally, default exports might lead to
           * different behavior when transformed to CJS.
           */
          "import/no-default-export": "error",
        },
        files: [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX],
        ignores: [
          // Configuration files
          GLOB_CONFIG_JS,
          GLOB_MARKDOWN_CODE,
          GLOB_ASTRO_TS,
          GLOB_VITEST_WORKSPACE,
        ],
      },
      omit(omittedConfig, ["files", "ignores"]),
    );
    return [modifiedConfig, rulesConfig, noDefaultExportConfig];
  });
};

export { imports };
