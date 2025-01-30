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
  typescript: "vdustr/typescript/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<typescript.ConfigNamesMapSource> {}
}

namespace typescript {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    typescript?: ConfigOverrides;
  }
}

const typescriptInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: typescript.Options,
) => {
  extendsConfig(composer, "antfu/typescript/rules", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.typescript ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.typescript ?? {}, ["files", "ignores"]),
      {
        name: configNamesMapSource.typescript,
        rules: {
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
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

const typescript = Object.assign(typescriptInternal, {
  configNamesMapSource,
});

export { typescript };
