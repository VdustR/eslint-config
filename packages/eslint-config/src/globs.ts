const GLOB_CODE_WORKSPACE: Array<string> = ["**/*.code-workspace"];
const GLOB_PACKAGE_JSON: Array<string> = ["**/package.json"];
const GLOB_PNPM_WORKSPACE_YAML: Array<string> = ["**/pnpm-workspace.y?(a)ml"];
const GLOB_CSPELL_JSON: Array<string> = ["**/cspell.json"];

export {
  GLOB_CODE_WORKSPACE,
  GLOB_CSPELL_JSON,
  GLOB_PACKAGE_JSON,
  GLOB_PNPM_WORKSPACE_YAML,
};
