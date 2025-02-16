import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { omit } from "es-toolkit";

/**
 * The values of these keys are objects that need to be merged.
 */
const objectMergeKeys = ["rules", "plugins"] as const satisfies Array<
  keyof TypedFlatConfigItem
>;

/**
 * The values of these keys allow being overridden by functions.
 */
const mutableMergeKeys = ["files", "ignores"] as const satisfies Array<
  keyof TypedFlatConfigItem
>;

function mergeConfig(
  source?: ConfigOverrides,
  ...[def, ...defs]: [TypedFlatConfigItem, ...Array<TypedFlatConfigItem>]
): TypedFlatConfigItem {
  const reversedDefs = [def, ...defs].toReversed();
  const mergedDef: TypedFlatConfigItem = {
    ...Object.fromEntries(reversedDefs.flatMap((def) => Object.entries(def))),
    ...Object.fromEntries(
      objectMergeKeys.flatMap((key) => {
        if (reversedDefs.every((def) => !(key in def))) return [];
        const values = Object.fromEntries(
          reversedDefs.flatMap((def) => Object.entries(def[key] ?? {})),
        );
        return [[key, values]];
      }),
    ),
  };
  if (!source) return mergedDef;

  const merged: TypedFlatConfigItem = {
    ...omit(mergedDef, [...objectMergeKeys, ...mutableMergeKeys]),
    ...omit(source, [...objectMergeKeys, ...mutableMergeKeys]),
    ...Object.fromEntries(
      objectMergeKeys.flatMap((key) => {
        if (!(key in source) && !(key in mergedDef)) return [];
        return [
          [
            key,
            {
              ...mergedDef[key],
              ...source[key],
            },
          ],
        ];
      }),
    ),
    ...Object.fromEntries(
      mutableMergeKeys.flatMap((key) => {
        if (!(key in source) && !(key in mergedDef)) return [];
        if (!(key in source)) return [[key, mergedDef[key]]];
        const sourceValue = source[key];
        if (sourceValue === undefined) return [];
        if (typeof sourceValue === "function") {
          const value = sourceValue(
            // @ts-expect-error -- typeof files and ignores are different.
            mergedDef[key],
          );
          if (value === undefined) return [];
          return [[key, value]];
        }
        return [[key, sourceValue]];
      }),
    ),
  };
  return merged;
}

export { mergeConfig };
