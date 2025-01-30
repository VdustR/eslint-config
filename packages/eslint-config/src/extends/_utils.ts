import type { TypedFlatConfigItem } from "@antfu/eslint-config";

const ignoreKeys = ["name", "plugins", "processor", "rules"] satisfies Array<
  keyof TypedFlatConfigItem
>;

export { ignoreKeys };
