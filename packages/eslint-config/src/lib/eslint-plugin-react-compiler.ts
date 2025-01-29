declare module "eslint-plugin-react-compiler" {
  type Plugin = import("eslint").ESLint.Plugin;
  type LegacyConfig = import("eslint").Linter.LegacyConfig;
  interface ReactCompiler extends Plugin {
    rules: NonNullable<Plugin["rules"]>;
    configs: {
      recommended: LegacyConfig;
    };
  }
  const rules: ReactCompiler["rules"];
  const configs: ReactCompiler["configs"];
  export { configs, rules };
}
