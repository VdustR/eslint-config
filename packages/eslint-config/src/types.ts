import type { TypedFlatConfigItem } from "@antfu/eslint-config";
import type antfu from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";

type Config = NonNullable<Parameters<typeof antfu>[1]>;

/**
 * A map of config names.
 *
 * @example
 *
 * ```ts
 *
 * ```
 */
interface ConfigNamesMap {}

type BaseConfigNamesMapSource = Record<string, string>;

/**
 * Transfroms a config names map source to a config names map.
 *
 * @example
 *
 * ```ts
 * BaseConfigNamesMapSource<{
 *   setup: "my-config/setup",
 *   rules: "my-config/rules",
 * }> => {
 *   "my-config/setup": true,
 *   "my-config/rules": true,
 * }
 * ```
 */
type ResolveConfigNamesMap<TSource extends BaseConfigNamesMapSource> = {
  [K in TSource[keyof TSource]]: true;
};

interface ConfigOverrides
  extends DistributiveOmit<TypedFlatConfigItem, "plugins" | "process"> {}

export type {
  BaseConfigNamesMapSource,
  Config,
  ConfigNamesMap,
  ConfigOverrides,
  ResolveConfigNamesMap,
};
