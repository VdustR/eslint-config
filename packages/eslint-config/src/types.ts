import type antfu from "@antfu/eslint-config";
import type { Rules as AntfuEslintRules } from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";
import type { Linter } from "eslint";
import type { RuleOptions } from "./eslint-typegen";

type Config = NonNullable<Parameters<typeof antfu>[1]>;

type Rules = RuleOptions & AntfuEslintRules;

/**
 * Learned from <https://github.com/antfu/eslint-config/blob/e283983/src/types.ts#L11-L23>
 */
type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  "plugins"
> & {
  plugins?: Record<string, any>;
};

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
  extends DistributiveOmit<TypedFlatConfigItem, "process"> {}

export type {
  BaseConfigNamesMapSource,
  Config,
  ConfigNamesMap,
  ConfigOverrides,
  ResolveConfigNamesMap,
  TypedFlatConfigItem,
};
