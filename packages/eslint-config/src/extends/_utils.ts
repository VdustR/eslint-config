import type { TypedFlatConfigItem } from "@antfu/eslint-config";

const ignoreKeys = ["plugins", "rules"] satisfies Array<
  keyof TypedFlatConfigItem
>;

export { ignoreKeys };
