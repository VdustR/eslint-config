import type { ConfigOverrides, VpComposer } from "../types";
import { omit, pick } from "es-toolkit";
import { reactCompiler } from "../configs/reactCompiler";
import { extendsConfig } from "../utils/extendsConfig";
import { mergeConfig } from "../utils/mergeConfig";
import { ignoreKeys } from "./_utils";

namespace react {
  export interface Options {
    react?: ConfigOverrides;
    reactCompiler?: reactCompiler.Options["reactCompiler"];
    reactCompilerSetup?: reactCompiler.Options["setup"];
  }
}

const react = (composer: VpComposer, options?: react.Options) => {
  extendsConfig(composer, "antfu/react/rules", async (config) => {
    const modifiedConfig = mergeConfig(
      pick(options?.react ?? {}, ["files", "ignores"]),
      config,
    );
    const omittedConfig = omit(modifiedConfig, ignoreKeys);
    const rulesConfig = mergeConfig(
      omit(options?.react ?? {}, ["files", "ignores"]),
      {
        name: "vdustr/react/rules",
        rules: {
          "react/prefer-destructuring-assignment": "off",
        },
      },
      omittedConfig,
    );
    const reactCompilerConfigs = await reactCompiler({
      setup: options?.reactCompilerSetup ?? {},
      reactCompiler: mergeConfig(
        options?.reactCompiler,
        pick(omittedConfig, ["files", "ignores"]),
      ),
    });
    return [modifiedConfig, rulesConfig, ...reactCompilerConfigs];
  });
};

export { react };
