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
import { reactCompiler } from "../configs/reactCompiler";
import { extendsConfig } from "../utils/extendsConfig";
import { ignoreKeys } from "./_utils";

const configNamesMapSource = {
  react: "vdustr/react/rules",
  reactCompilerSetup: "vdustr/react/react-compiler/setup",
  reactCompilerRules: "vdustr/react/react-compiler/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<react.ConfigNamesMapSource> {}
}

namespace react {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    react?: ConfigOverrides;
    reactCompiler?: reactCompiler.Options["reactCompiler"];
    reactCompilerSetup?: reactCompiler.Options["setup"];
  }
}

const reactInternal = (
  composer: FlatConfigComposer<TypedFlatConfigItem, ConfigNames>,
  options?: react.Options,
) => {
  extendsConfig(composer, "antfu/react/rules", async (config) => {
    const modifiedConfig = defu<
      TypedFlatConfigItem,
      Array<TypedFlatConfigItem>
    >(pick(options?.react ?? {}, ["files", "ignores"]), config);
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = defu<TypedFlatConfigItem, Array<TypedFlatConfigItem>>(
      omit(options?.react ?? {}, ["files", "ignores"]),
      {
        name: configNamesMapSource.react,
        rules: {
          "react/prefer-destructuring-assignment": "off",
        },
      },
      omittedConfig,
    );
    const reactCompilerConfigs = await reactCompiler({
      setup: options?.reactCompilerSetup ?? {},
      reactCompiler: defu(
        options?.reactCompiler,
        pick(omittedConfig, ["files", "ignores"]),
      ),
    });
    return [modifiedConfig, rulesConfig, ...reactCompilerConfigs];
  });
};

const react = Object.assign(reactInternal, {
  configNamesMapSource,
});

export { react };
