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

const pushOverations = <
  T extends object = Linter.Config,
  ConfigNames extends string = keyof DefaultConfigNamesMap,
>(
  composer: FlatConfigComposer<T, ConfigNames>,
  operations: Array<Operation<T>>,
) => {
  // @ts-expect-error -- Hijacking the composer's operations.
  composer._operations.push(...operations);
};

function extendsConfigInternal<
  T extends object = Linter.Config,
  ConfigNames extends string = keyof DefaultConfigNamesMap,
>(
  composer: FlatConfigComposer<T, ConfigNames>,
  sourceOrIndex: StringLiteralUnion<ConfigNames, string | number>,
  config: Awaitable<Arrayable<T>> | ((config: T) => Awaitable<Arrayable<T>>),
) {
  pushOverations(composer, [
    async (items) => {
      const index = tryGetConfigIndex(items, sourceOrIndex);
      const source = items[index];
      // Do nothing if the config is not found.
      if (!source) return items;
      const newConfigs = await (async () => {
        const awaited =
          typeof config === "function" ? await config(source) : await config;
        return Array.isArray(awaited) ? awaited : [awaited];
      })();
      return items.toSpliced(index, 1, ...newConfigs);
    },
  ]);
}

const extendsConfig = Object.assign(extendsConfigInternal, {
  getConfigIndex,
  tryGetConfigIndex,
  pushOverations,
});

export { extendsConfig };
