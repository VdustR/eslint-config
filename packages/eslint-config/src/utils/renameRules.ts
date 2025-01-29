import { defaultPluginRenaming, renameRules } from "@antfu/eslint-config";

function renameRulesInternal(rules: Parameters<typeof renameRules>[0]) {
  return renameRules(rules, defaultPluginRenaming);
}

export { renameRulesInternal as renameRules };
