import type { ConfigOverrides, TypedFlatConfigItem } from "../types";
import { expect, it } from "vitest";
import { mergeConfig } from "./mergeConfig";

it("no source, only defaults", () => {
  const def1: TypedFlatConfigItem = { rules: { rule1: "error" } };
  const def2: TypedFlatConfigItem = { plugins: { plugin1: "warn" } };
  const merged = mergeConfig(undefined, def1, def2);
  expect(merged.rules).toEqual({ rule1: "error" });
  expect(merged.plugins).toEqual({ plugin1: "warn" });
});

it("source overrides defaults", () => {
  const def: TypedFlatConfigItem = {
    languageOptions: { ecmaVersion: 2020 },
    rules: { rule1: "error" },
  };
  const source: ConfigOverrides = {
    languageOptions: { ecmaVersion: 2022 },
    rules: { rule1: "warn" },
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual({
    languageOptions: { ecmaVersion: 2022 },
    rules: { rule1: "warn" },
  });
});

it("object merge keys", () => {
  const def: TypedFlatConfigItem = {
    rules: { rule1: "error" },
    plugins: { plugin1: "warn" },
  };
  const source: ConfigOverrides = {
    rules: { rule2: "warn" },
    plugins: { plugin2: "error" },
  };
  const merged = mergeConfig(source, def);
  expect(merged.rules).toEqual({ rule1: "error", rule2: "warn" });
  expect(merged.plugins).toEqual({ plugin1: "warn", plugin2: "error" });
});

it("mutable merge keys (function)", () => {
  const def: TypedFlatConfigItem = {
    files: ["src/**/*.ts"],
    ignores: ["node_modules"],
  };
  const source: ConfigOverrides = {
    files: (files) => [...(files ?? []), "test/**/*.ts"],
    ignores: (ignores) => [...(ignores ?? []), "dist"],
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual({
    files: ["src/**/*.ts", "test/**/*.ts"],
    ignores: ["node_modules", "dist"],
  });
});

it("mutable merge keys (undefined)", () => {
  const def: TypedFlatConfigItem = {
    files: ["src/**/*.ts"],
    ignores: ["node_modules"],
  };
  const source: ConfigOverrides = {
    files: undefined,
    ignores: undefined,
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual(source);
});

it("mutable merge keys (function returns undefined)", () => {
  const def: TypedFlatConfigItem = {
    files: ["src/**/*.ts"],
    ignores: ["node_modules"],
  };
  const source: ConfigOverrides = {
    files: () => undefined,
    ignores: () => undefined,
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual({});
});

it("mutable merge keys (value)", () => {
  const def: TypedFlatConfigItem = {
    files: ["src/**/*.ts"],
    ignores: ["node_modules"],
  };
  const source: ConfigOverrides = {
    files: ["test/**/*.ts"],
    ignores: ["dist"],
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual(source);
});

it("omitted keys", () => {
  const def: TypedFlatConfigItem = {
    files: ["src/**/*.ts"],
    rules: { rule1: "error" },
  };
  const source: ConfigOverrides = {
    files: ["test/**/*.ts"],
    rules: { rule2: "warn" },
    languageOptions: { ecmaVersion: 2022 },
  };
  const merged = mergeConfig(source, def);
  expect(merged).toEqual({
    files: ["test/**/*.ts"],
    rules: { rule1: "error", rule2: "warn" },
    languageOptions: { ecmaVersion: 2022 },
  });
});

it("empty configurations", () => {
  const def: TypedFlatConfigItem = {};
  const source: ConfigOverrides = {};
  const merged = mergeConfig(source, def);
  expect(merged).toEqual({});
});

it("source undefined", () => {
  const def: TypedFlatConfigItem = { rules: { rule1: "error" } };
  const merged = mergeConfig(undefined, def);
  expect(merged).toEqual(def);
});

it("multiple defaults", () => {
  const def1: TypedFlatConfigItem = {
    rules: { rule1: "error", rule2: "error" },
  };
  const def2: TypedFlatConfigItem = { files: ["src"], ignores: ["lib"] };
  const def3: TypedFlatConfigItem = {
    files: ["lib"],
    languageOptions: { ecmaVersion: 2020 },
  };
  const source: ConfigOverrides = {
    rules: { rule2: "warn" },
    files: (files) => [...(files ?? []), "test"],
  };

  const merged = mergeConfig(source, def1, def2, def3);

  expect(merged).toEqual({
    rules: { rule1: "error", rule2: "warn" },
    files: ["src", "test"],
    ignores: ["lib"],
    languageOptions: { ecmaVersion: 2020 },
  });
});
