import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import {
  GLOB_ASTRO_TS,
  GLOB_JS,
  GLOB_JSX,
  GLOB_MARKDOWN_CODE,
  GLOB_TS,
  GLOB_TSX,
} from "@antfu/eslint-config";
import { omit } from "es-toolkit";
import { GLOB_CONFIG_JS } from "../globs";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  imports: "vdustr/imports/rules",
  noDefaultExport: "vdustr/no-default-export/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<imports.ConfigNamesMapSource> {}
}

namespace imports {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    imports?: ConfigOverrides;
    noDefaultExport: ConfigOverrides;
  }
}

const importsInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: imports.Options,
) => {
  extendsConfig(composer, "antfu/imports/rules", (config) => [
    config,
    {
      /**
       * Inherited.
       */
      ...omit(config, ignoreKeys),

      /**
       * Default.
       */
      name: configNamesMapSource.imports,

      /**
       * Overridable.
       */
      ...options?.imports,
      rules: {
        /**
         * Default.
         */

        /**
         * Forbid `import {} from "module"`.
         */
        "import/no-empty-named-blocks": "error",

        /**
         * Wildcard imports can prevent tree shaking and cause name conflicts.
         * Consider using named imports instead.
         */
        "import/no-namespace": "error",

        /**
         * Overridable.
         */
        ...options?.imports?.rules,
      },
    } satisfies typeof config,
    {
      name: configNamesMapSource.noDefaultExport,

      /**
       * Overridable.
       */
      ...options?.noDefaultExport,
      rules: {
        /**
         * Enforcing named exports improves consistency, enhances auto-completion and refactoring, and avoids issues
         * with default export renaming. Additionally, default exports might lead to different behavior when transformed
         * to CJS.
         */
        "import/no-default-export": "error",
        ...options?.noDefaultExport?.rules,
      },
      files: [
        GLOB_JS,
        GLOB_JSX,
        GLOB_TS,
        GLOB_TSX,
        ...(options?.noDefaultExport?.files || []),
      ],
      ignores: [
        // Configuration files
        GLOB_CONFIG_JS,
        GLOB_MARKDOWN_CODE,
        GLOB_ASTRO_TS,
        ...(options?.noDefaultExport?.ignores || []),
      ],
    } satisfies typeof config,
  ]);
};

const imports = Object.assign(importsInternal, {
  configNamesMapSource,
});

export { imports };
