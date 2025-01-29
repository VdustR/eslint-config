import type { ESLint, Linter } from "eslint";
// @ts-expect-error -- Untyped library.
// eslint-disable-next-line import/no-namespace -- `react-compiler` exports the plugin as a namespace.
import * as reactCompiler from "eslint-plugin-react-compiler";

interface ReactCompiler extends ESLint.Plugin {
  rules: NonNullable<ESLint.Plugin["rules"]>;
  configs: {
    recommended: Linter.LegacyConfig;
  };
}

const reactCompilerInternal: ReactCompiler =
  reactCompiler.default ?? reactCompiler;

export { reactCompilerInternal as reactCompiler };
