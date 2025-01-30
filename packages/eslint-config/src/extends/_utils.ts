import type { TypedFlatConfigItem } from "../types";

const ignoreKeys = ["name", "plugins", "processor", "rules"] satisfies Array<
  keyof TypedFlatConfigItem
>;

export { ignoreKeys };
