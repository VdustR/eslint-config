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
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  javascript: "vdustr/javascript/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<javascript.ConfigNamesMapSource> {}
}

namespace javascript {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    javascript?: ConfigOverrides;
  }
}

const javascriptInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: javascript.Options,
) => {
  extendsConfig(composer, "antfu/javascript/rules", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.javascript ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.javascript ?? {}, ["files", "ignores"]),
      {
        name: configNamesMapSource.javascript,
        rules: {
          /**
           * Some callbacks are purposefully named to make the code self-documenting.
           */
          "prefer-arrow-callback": "off",

          /**
           * This rule does not integrate well with JSDoc `@link` tags. It's advised
           * to verify its behavior with TypeScript instead.
           */
          "no-unused-vars": "off",
          "unused-imports/no-unused-vars": "off",
          "unused-imports/no-unused-imports-ts": "off",
          "unused-imports/no-unused-vars-ts": "off",
          "unused-imports/no-unused-imports": "off",
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

const javascript = Object.assign(javascriptInternal, {
  configNamesMapSource,
});

export { javascript };
