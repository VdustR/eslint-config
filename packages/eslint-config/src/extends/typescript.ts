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
  rules: "vdustr/typescript/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<typescript.ConfigNamesMapSource> {}
}

namespace typescript {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options extends ConfigOverrides {}
}

const typescriptInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: typescript.Options,
) => {
  extendsConfig(composer, "antfu/typescript/rules", (config) => [
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
         * Use `Array<T>` instead of `T[]` for better DX.
         *
         * - [Array<T> vs T[]: Which is better?](https://www.totaltypescript.com/array-types-in-typescript)
         * - [Array Types in TypeScript](https://tkdodo.eu/blog/array-types-in-type-script)
         */
        "ts/array-type": ["error", { default: "generic" }],

        /**
         * Namespaces are useful for centralizing the management of types. Just avoid
         * overusing them with runtime code.
         *
         * - References:
         *   - <https://x.com/mattpocockuk/status/1805606072167940167>
         */
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",

        /**
         * Check for unused variables in TypeScript.
         */
        "ts/no-unused-vars": "off",

        /**
         * Overridable.
         */
        ...options?.rules,
      },
    } satisfies typeof config,
  ]);
};

const typescript = Object.assign(typescriptInternal, {
  configNamesMapSource,
});

export { typescript };
