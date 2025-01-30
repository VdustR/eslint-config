import type { ConfigNames, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";
import { omit } from "es-toolkit";
import { reactCompiler } from "../lib/eslint-plugin-react-compiler";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  rules: "vdustr/react/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<react.ConfigNamesMapSource> {}
}

namespace react {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options extends ConfigOverrides {}
}

const reactInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: react.Options,
) => {
  extendsConfig(composer, "antfu/react/rules", async (config) => [
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
      plugins: {
        /**
         * Inherited.
         */
        ...config.plugins,

        /**
         * Default.
         */
        "react-compiler": await reactCompiler(),

        /**
         * Overridable.
         */
        ...options?.plugins,
      },

      /**
       * Overridable.
       */
      ...options,
      rules: {
        /**
         * Default.
         */
        "react-compiler/react-compiler": "error",

        /**
         * Not all destructuring assignments are more readable than their alternatives.
         */
        "react/prefer-destructuring-assignment": "off",

        /**
         * Overridable.
         */
        ...options?.rules,
      },
    } satisfies typeof config,
  ]);
};

const react = Object.assign(reactInternal, {
  configNamesMapSource,
});

export { react };
