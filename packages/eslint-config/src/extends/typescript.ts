import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

namespace typescript {
  export interface Options {
    typescript?: ConfigOverrides;
  }
}

const typescript = (composer: VpComposer, options?: typescript.Options) => {
  extendsConfig(composer, "antfu/typescript/rules", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.typescript ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.typescript ?? {}, ["files", "ignores"]),
      {
        name: "vdustr/typescript/rules",
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

export { typescript };
