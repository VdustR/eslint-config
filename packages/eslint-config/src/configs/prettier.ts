import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
} from "../types";

import { ensurePackages } from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier";
import { renameRules } from "../utils/renameRules";

const configNamesMapSource = {
  rules: "vdustr/prettier/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<prettier.ConfigNamesMapSource> {}
}

namespace prettier {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options extends ConfigOverrides {}
}

const prettierInternal = async (
  options?: prettier.Options,
): Promise<TypedFlatConfigItem> => {
  await ensurePackages(["eslint-config-prettier"]);
  return {
    /**
     * Inherited.
     */
    ...eslintConfigPrettier,

    /**
     * Default.
     */
    name: configNamesMapSource.rules,

    /**
     * Overridable.
     */
    rules: {
      /**
       * Inherited.
       */
      ...renameRules(eslintConfigPrettier.rules),

      /**
       * Overridable.
       */
      ...options?.rules,
    },
  };
};

const prettier = Object.assign(prettierInternal, {
  configNamesMapSource,
});

export { prettier };
