import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import defu from "defu";
import { reactCompiler as importLib } from "../lib/eslint-plugin-react-compiler";

namespace reactCompiler {
  export interface Options {
    setup?: ConfigOverrides;
    reactCompiler?: ConfigOverrides;
  }
}

const reactCompiler = async (options?: reactCompiler.Options) => {
  const reactCompilerSetupConfig = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.setup, {
    name: "vdustr/react/react-compiler/setup",
    plugins: {
      "react-compiler": await importLib(),
    },
  });
  const reactCompilerRulesConfig = defu<
    TypedFlatConfigItem,
    Array<TypedFlatConfigItem>
  >(options?.reactCompiler, {
    name: "vdustr/react/react-compiler/rules",
    rules: {
      "react-compiler/react-compiler": "error",
    },
  });
  return [reactCompilerSetupConfig, reactCompilerRulesConfig];
};

export { reactCompiler };
