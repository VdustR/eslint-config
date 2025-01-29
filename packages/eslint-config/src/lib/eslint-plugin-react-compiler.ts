import type { ESLint, Linter } from "eslint";
import { ensurePackages, interopDefault } from "@antfu/eslint-config";

interface ReactCompiler extends ESLint.Plugin {
  rules: NonNullable<ESLint.Plugin["rules"]>;
  configs: {
    recommended: Linter.LegacyConfig;
  };
}

const reactCompiler = async (): Promise<ReactCompiler> => {
  await ensurePackages(["eslint-plugin-react-compiler"]);
  const reactCompiler = await interopDefault(
    import(
      // @ts-expect-error -- Untyped library.
      "eslint-plugin-react-compiler"
    ),
  );
  return reactCompiler;
};

export { reactCompiler };
