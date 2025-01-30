import type antfu from "@antfu/eslint-config";
import type {
  ConfigNames as AntfuEslintConfigNames,
  Rules as AntfuEslintRules,
} from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  RuleOptions,
  ConfigNames as VpEslintConfigNames,
} from "./eslint-typegen";

type Config = NonNullable<Parameters<typeof antfu>[1]>;

type Rules = RuleOptions & AntfuEslintRules;
type ConfigNames = VpEslintConfigNames | AntfuEslintConfigNames;

/**
 * Learned from <https://github.com/antfu/eslint-config/blob/e283983/src/types.ts#L11-L23>
 */
type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  "plugins"
> & {
  plugins?: Record<string, any>;
};

interface ConfigOverrides
  extends DistributiveOmit<TypedFlatConfigItem, "process"> {}

/**
 * Typed composer.
 */
type VpComposer = FlatConfigComposer<TypedFlatConfigItem, ConfigNames>;

export type {
  Config,
  ConfigNames,
  ConfigOverrides,
  TypedFlatConfigItem,
  VpComposer,
};
