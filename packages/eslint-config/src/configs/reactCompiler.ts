import type {
  BaseConfigNamesMapSource,
  ConfigOverrides,
  ResolveConfigNamesMap,
  TypedFlatConfigItem,
} from "../types";
import defu from "defu";
import { reactCompiler as importLib } from "../lib/eslint-plugin-react-compiler";

const configNamesMapSource = {
  setup: "vdustr/react/react-compiler/setup",
  rules: "vdustr/react/react-compiler/rules",
} as const satisfies BaseConfigNamesMapSource;

declare module "../types" {
  interface ConfigNamesMap
    extends ResolveConfigNamesMap<reactCompiler.ConfigNamesMapSource> {}
}

namespace reactCompiler {
  export type ConfigNamesMapSource = typeof configNamesMapSource;
  export interface Options {
    setup?: ConfigOverrides;
    reactCompiler?: ConfigOverrides;
  }
}

const reactCompilerInternal = async (options?: reactCompiler.Options) => {
  const reactCompilerSetupConfig = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.setup, {
    name: configNamesMapSource.setup,
    plugins: {
      "react-compiler": await importLib(),
    },
  });
  const reactCompilerRulesConfig = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.reactCompiler, {
    name: configNamesMapSource.rules,
    rules: {
      "react-compiler/react-compiler": "error",
    },
  });
  return [reactCompilerSetupConfig, reactCompilerRulesConfig];
};

const reactCompiler = Object.assign(reactCompilerInternal, {
  configNamesMapSource,
});

export { reactCompiler };
