import type { OptionsConfig } from "@antfu/eslint-config";
import type { DistributiveOmit } from "@mui/types";

import type { sort } from "./extends/sort";
import type {
  AnyObject,
  Config,
  ReplaceAntfuEslintRulesWithVpRulesDeeply,
  VpComposer,
} from "./types";
import antfu from "@antfu/eslint-config";
import { omit, pick } from "es-toolkit";
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
  extends?: {
    javascript?: javascript.Options;
    imports?: imports.Options;
    typescript?: typescript.Options;
    jsonc?: jsonc.Options;
    sort?: sort.Options;
    yaml?: yaml.Options;
    react?: react.Options;
  };
  packageJson?: boolean | packageJson.Options;
  mdx?: boolean | mdx.Options;
  storybook?: boolean | storybook.Options;
  prettier?: boolean | prettier.Options;
};

const ownedConfigNames = [
  "extends",
  "packageJson",
  "mdx",
  "storybook",
  "prettier",
] as const satisfies Array<keyof Options>;

const vdustr = (
  options?: Options,
  ...userConfigs: Array<Config>
): VpComposer => {
  type AntfuOptions = DistributiveOmit<OptionsConfig, keyof Options>;
  const antfuOptions: OptionsConfig = omit(
    options ?? {},
    ownedConfigNames,
  ) satisfies AntfuOptions as AntfuOptions;

  const vpOptions = pick(options ?? {}, ownedConfigNames);

  const packageJsonEnabled: boolean = Boolean(vpOptions?.packageJson ?? true);
  const storybookEnabled: boolean = Boolean(vpOptions?.storybook ?? false);
  const mdxEnabled: boolean = Boolean(vpOptions?.mdx ?? false);
  const prettierEnabled: boolean = Boolean(vpOptions?.prettier ?? true);

  let config: VpComposer = antfu({
    ...antfuOptions,
    ...(!prettierEnabled
      ? null
      : {
          // Forcibly disable style rules if prettier is enabled.
          stylistic: false,
        }),
  });

  javascript(config, vpOptions?.extends?.javascript);
  imports(config, vpOptions?.extends?.imports);
  typescript(config, vpOptions?.extends?.typescript);
  jsonc(config, vpOptions?.extends?.jsonc);
  if (packageJsonEnabled)
    sortPackageJson(config, vpOptions?.extends?.sort?.packageJson);
  sortTsconfigJson(config, vpOptions?.extends?.sort?.tsconfigJson);
  sortJsonKeys(config, vpOptions?.extends?.sort?.jsoncSortKeys);
  sortJsonArrayValues(config, vpOptions?.extends?.sort?.jsoncSortArrayValues);
  yaml(config, vpOptions?.extends?.yaml);
  react(config, vpOptions?.extends?.react);

  if (packageJsonEnabled) {
    const packageJsonOptions: undefined | packageJson.Options =
      typeof vpOptions?.packageJson !== "object"
        ? undefined
        : vpOptions.packageJson;
    config = config.append(
      packageJson(...(!packageJsonOptions ? [] : [packageJsonOptions])),
    );
  }

  if (storybookEnabled) {
    const storybookOptions: undefined | storybook.Options =
      typeof vpOptions?.storybook !== "object"
        ? undefined
        : vpOptions.storybook;
    config = config.append(
      storybook(...(!storybookOptions ? [] : [storybookOptions])),
    );
  }

  if (mdxEnabled) {
    const mdxOptions: Extract<Options["mdx"], AnyObject> = {
      ...(typeof vpOptions?.mdx !== "object" ? null : vpOptions.mdx),
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
      typeof vpOptions?.prettier !== "object" ? undefined : vpOptions.prettier;
    config = config.append(
      prettier(...(!prettierOptions ? [] : [prettierOptions])),
    );
  }

  config.append(...(userConfigs as any));

  return config;
};

export { vdustr };
