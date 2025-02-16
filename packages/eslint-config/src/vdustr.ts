import type {
  AnyObject,
  Config,
  ReplaceAntfuEslintRulesWithVpRulesDeeply,
  VpComposer,
} from "./types";
import antfu from "@antfu/eslint-config";

import { mdx } from "./configs/mdx";
import { packageJson } from "./configs/packageJson";
import { prettier } from "./configs/prettier";
import { storybook } from "./configs/storybook";
import { imports } from "./extends/imports";
import { javascript } from "./extends/javascript";
import { jsonc } from "./extends/jsonc";
import { react } from "./extends/react";
import {
  sortJsonArrayValues,
  sortJsonKeys,
  sortPackageJson,
  sortTsconfigJson,
} from "./extends/sort";
import { typescript } from "./extends/typescript";
import { yaml } from "./extends/yaml";

type Options = ReplaceAntfuEslintRulesWithVpRulesDeeply<
  NonNullable<Parameters<typeof antfu>[0]>
> & {
  javascriptExtends?: javascript.Options;
  importsExtends?: imports.Options;
  typescriptExtends?: typescript.Options;
  jsoncExtends?: jsonc.Options;
  sortPackageJsonExtends?: sortPackageJson.Options;
  sortTsConfigJsonExtends?: sortTsconfigJson.Options;
  sortJsonKeysExtends?: sortJsonKeys.Options;
  sortJsonArrayValuesExtends?: sortJsonArrayValues.Options;
  yamlExtends?: yaml.Options;
  packageJson?: boolean | packageJson.Options;
  reactExtends?: react.Options;
  mdx?: boolean | mdx.Options;
  storybook?: boolean | storybook.Options;
  prettier?: boolean | prettier.Options;
};

const vdustr = (
  options?: Options,
  ...userConfigs: Array<Config>
): VpComposer => {
  const packageJsonEnabled: boolean = Boolean(options?.packageJson ?? true);
  const storybookEnabled: boolean = Boolean(options?.storybook ?? false);
  const mdxEnabled: boolean = Boolean(options?.mdx ?? false);
  const prettierEnabled: boolean = Boolean(options?.prettier ?? true);

  let config: VpComposer = antfu({
    ...(options as any),
    ...(!prettierEnabled
      ? null
      : {
          // Forcibly disable style rules if prettier is enabled.
          stylistic: false,
        }),
  });

  javascript(config, options?.javascriptExtends);
  imports(config, options?.importsExtends);
  typescript(config, options?.typescriptExtends);
  jsonc(config, options?.jsoncExtends);
  if (packageJsonEnabled)
    sortPackageJson(config, options?.sortPackageJsonExtends);
  sortTsconfigJson(config, options?.sortTsConfigJsonExtends);
  sortJsonKeys(config, options?.sortJsonKeysExtends);
  sortJsonArrayValues(config, options?.sortJsonArrayValuesExtends);
  yaml(config, options?.yamlExtends);
  react(config, options?.reactExtends);

  if (packageJsonEnabled) {
    const packageJsonOptions: undefined | packageJson.Options =
      typeof options?.packageJson !== "object"
        ? undefined
        : options.packageJson;
    config = config.append(
      packageJson(...(!packageJsonOptions ? [] : [packageJsonOptions])),
    );
  }

  if (storybookEnabled) {
    const storybookOptions: undefined | storybook.Options =
      typeof options?.storybook !== "object" ? undefined : options.storybook;
    config = config.append(
      storybook(...(!storybookOptions ? [] : [storybookOptions])),
    );
  }

  if (mdxEnabled) {
    const mdxOptions: Extract<Options["mdx"], AnyObject> = {
      ...(typeof options?.mdx !== "object" ? null : options.mdx),
    };
    const mdxFlatCodeBlocksEnabled: boolean = Boolean(
      mdxOptions?.codeBlocks ?? true,
    );
    const mdxFlatCodeBlocksOptions: Extract<
      (typeof mdxOptions)["codeBlocks"],
      AnyObject
    > = {
      ...(typeof mdxOptions?.codeBlocks !== "object"
        ? null
        : mdxOptions.codeBlocks),
    };

    config = config.append(
      mdx({
        ...mdxOptions,
        codeBlocks: !mdxFlatCodeBlocksEnabled
          ? false
          : mdxFlatCodeBlocksOptions,
      }),
    );
  }

  if (prettierEnabled) {
    const prettierOptions: undefined | prettier.Options =
      typeof options?.prettier !== "object" ? undefined : options.prettier;
    config = config.append(
      prettier(...(!prettierOptions ? [] : [prettierOptions])),
    );
  }

  config.append(...(userConfigs as any));

  return config;
};

export { vdustr };
