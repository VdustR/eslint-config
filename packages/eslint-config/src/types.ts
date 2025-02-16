import type antfu from "@antfu/eslint-config";
import type {
  ConfigNames as AntfuEslintConfigNames,
  Rules as AntfuEslintRules,
} from "@antfu/eslint-config";
import type { DistributiveOmit, Overwrite } from "@mui/types";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type {
  RuleOptions,
  ConfigNames as VpEslintConfigNames,
} from "./eslint-typegen";

type AnyObject = Record<PropertyKey, any>;

type ObjectReplaceAntfuEslintRulesWithRulesDeeply<T extends AnyObject> =
  // If `T` includes `AntfuEslintRules`, replace it with our `Rules`.
  | (Extract<T, AntfuEslintRules> extends never ? never : Rules)
  | {
      [K in keyof T]: ReplaceAntfuEslintRulesWithVpRulesDeeply<T[K]>;
    };

type ReplaceAntfuEslintRulesWithVpRulesDeeply<T> =
  // If `T` includes `AntfuEslintRules`, replace it with our `Rules`.
  | (Extract<T, AntfuEslintRules> extends never ? never : Rules)
  // If `T` is an object, recursively replace its properties.
  | (
      | ObjectReplaceAntfuEslintRulesWithRulesDeeply<Extract<T, AnyObject>>
      // Otherwise, keep `T` as is.
      | Exclude<T, AnyObject>
    );

type Config = ReplaceAntfuEslintRulesWithVpRulesDeeply<
  NonNullable<Parameters<typeof antfu>[1]>
>;

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

type Files = TypedFlatConfigItem["files"];
type Ignores = TypedFlatConfigItem["ignores"];
type Mutables<T> = T | ((config: T) => T);

interface ConfigOverrides
  extends Overwrite<
    DistributiveOmit<TypedFlatConfigItem, "process">,
    {
      files?: Mutables<Files>;
      ignores?: Mutables<Ignores>;
    }
  > {}

/**
 * Typed composer.
 */
type VpComposer = FlatConfigComposer<TypedFlatConfigItem, ConfigNames>;

export type {
  AnyObject,
  Config,
  ConfigNames,
  ConfigOverrides,
  ReplaceAntfuEslintRulesWithVpRulesDeeply,
  Rules,
  TypedFlatConfigItem,
  VpComposer,
};
