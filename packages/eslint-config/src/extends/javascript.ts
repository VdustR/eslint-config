import type {
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
} from "../types";
import defu from "defu";
import { omit, pick } from "es-toolkit";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

namespace javascript {
  export interface Options {
    javascript?: ConfigOverrides;
  }
}

const javascript = (composer: VpComposer, options?: javascript.Options) => {
  extendsConfig(composer, "antfu/javascript/rules", (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.javascript ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.javascript ?? {}, ["files", "ignores"]),
      {
        name: "vdustr/javascript/rules",
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
          "unused-imports/no-unused-imports": "off",
        },
      },
      omittedConfig,
    );
    return [modifiedConfig, rulesConfig];
  });
};

export { javascript };
