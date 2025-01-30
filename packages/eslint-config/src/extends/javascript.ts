import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import { omit } from "es-toolkit";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  rules: "vdustr/javascript/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<javascript.ConfigNamesMapSource> {}
}

namespace javascript {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options extends ConfigOverrides {}
}

const javascriptInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: javascript.Options,
) => {
  extendsConfig(composer, "antfu/javascript/rules", (config) => [
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
         * Default.
         */
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

        /**
         * Overridable.
         */
        ...options?.rules,
      },
    } satisfies typeof config,
  ]);
};

const javascript = Object.assign(javascriptInternal, {
  configNamesMapSource,
});

export { javascript };
