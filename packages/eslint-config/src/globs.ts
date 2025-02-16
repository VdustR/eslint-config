const GLOB_CODE_WORKSPACE: string = "**/*.code-workspace";
const GLOB_PACKAGE_JSON: string = "**/package.json";
const GLOB_PNPM_WORKSPACE_YAML: string = "**/pnpm-workspace.y?(a)ml";
const GLOB_CSPELL_JSON: string = "**/cspell.json";
const GLOB_CONFIG_JS: string = "**/*.config.?([cm])[jt]s";
const GLOB_VITEST_WORKSPACE: string = "**/vitest.workspace.?([cm])[jt]s";

export {
  GLOB_CODE_WORKSPACE,
  GLOB_CONFIG_JS,
  GLOB_CSPELL_JSON,
  GLOB_PACKAGE_JSON,
  GLOB_PNPM_WORKSPACE_YAML,
  GLOB_VITEST_WORKSPACE,
};
