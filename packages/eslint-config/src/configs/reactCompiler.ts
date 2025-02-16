import type { ConfigOverrides } from "../types";
import { reactCompiler as importLib } from "../lib/eslint-plugin-react-compiler";
import { mergeConfig } from "../utils/mergeConfig";

namespace reactCompiler {
  export interface Options {
    setup?: ConfigOverrides;
    reactCompiler?: ConfigOverrides;
  }
}

const reactCompiler = async (options?: reactCompiler.Options) => {
  const reactCompilerSetupConfig = mergeConfig(options?.setup, {
    name: "vdustr/react/react-compiler/setup",
    plugins: {
      "react-compiler": await importLib(),
    },
  });
  const reactCompilerRulesConfig = mergeConfig(options?.reactCompiler, {
    name: "vdustr/react/react-compiler/rules",
    rules: {
      "react-compiler/react-compiler": "error",
    },
  });
  return [reactCompilerSetupConfig, reactCompilerRulesConfig];
};

export { reactCompiler };
