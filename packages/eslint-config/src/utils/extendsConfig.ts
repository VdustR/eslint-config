import type { Linter } from "eslint";
import type {
  Arrayable,
  Awaitable,
  DefaultConfigNamesMap,
  FlatConfigComposer,
  StringLiteralUnion,
} from "eslint-flat-config-utils";

/**
 * <https://github.com/antfu/eslint-flat-config-utils/blob/ac3a9b4/src/composer.ts#L492-L512>
 */
function getConfigIndex(
  configs: Array<Linter.Config>,
  nameOrIndex: string | number,
): number {
  if (typeof nameOrIndex === "number") {
    if (nameOrIndex < 0 || nameOrIndex >= configs.length)
      throw new Error(
        `ESLintFlatConfigUtils: Failed to locate config at index ${nameOrIndex}\n(${configs.length} configs in total)`,
      );
    return nameOrIndex;
  } else {
    const index = configs.findIndex((config) => config.name === nameOrIndex);
    if (index === -1) {
      const named = configs.map((config) => config.name).filter(Boolean);
      const countUnnamed = configs.length - named.length;
      const messages = [
        `Failed to locate config with name "${nameOrIndex}"`,
        `Available names are: ${named.join(", ")}`,
        countUnnamed ? `(${countUnnamed} unnamed configs)` : "",
      ]
        .filter(Boolean)
        .join("\n");
      throw new Error(`ESLintFlatConfigUtils: ${messages}`);
    }
    return index;
  }
}

const tryGetConfigIndex: typeof getConfigIndex = (
  configs: Array<Linter.Config>,
  nameOrIndex: string | number,
) => {
  try {
    return getConfigIndex(configs, nameOrIndex);
  } catch {
    return -1;
  }
};

/**
 * <https://github.com/antfu/eslint-flat-config-utils/blob/ac3a9b4/src/composer.ts#L91>
 */
type Operation<T extends object = Linter.Config> = (
  items: Array<T>,
) => Promise<Array<T>>;

function extendsConfig<
  T extends object = Linter.Config,
  ConfigNames extends string = keyof DefaultConfigNamesMap,
>(
  composer: FlatConfigComposer<T, ConfigNames>,
  sourceOrIndex: StringLiteralUnion<ConfigNames, string | number>,
  config: Awaitable<Arrayable<T>> | ((config: T) => Awaitable<Arrayable<T>>),
  remove?: Arrayable<StringLiteralUnion<ConfigNames, string | number>>,
) {
  const operations: Array<Operation<T>> =
    // @ts-expect-error -- Hijacking the composer's operations.
    composer._operations;
  operations.push(async (items) => {
    const removingTargets = (() => {
      if (!remove) return [];
      const removeSources = Array.isArray(remove) ? remove : [remove];
      return removeSources.flatMap((removeSource) => {
        const index = tryGetConfigIndex(items, removeSource);
        return index === -1 ? [] : [index];
      });
    })();
    /**
     * Remove the configs at the specified indexes.
     */
    items =
      removingTargets.length === 0
        ? items
        : items.filter((_, index) => !removingTargets.includes(index));
    const index = tryGetConfigIndex(items, sourceOrIndex);
    const source = items[index];
    // Do nothing if the config is not found.
    if (!source) return items;
    const newConfigs = await (async () => {
      const awaited =
        typeof config === "function" ? await config(source) : await config;
      return Array.isArray(awaited) ? awaited : [awaited];
    })();
    return [...items.slice(0, index), ...newConfigs, ...items.slice(index + 1)];
  });
}

export { extendsConfig };
