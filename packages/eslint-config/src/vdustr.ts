import type {
  AnyObject,
  Config,
  ReplaceAntfuEslintRulesWithVpRulesDeeply,
  VpComposer,
} from "./types";
import antfu from "@antfu/eslint-config";

import { mdx } from "./configs/mdx";
import { prettier } from "./configs/prettier";
import { storybook } from "./configs/storybook";
import { imports } from "./extends/imports";
import { javascript } from "./extends/javascript";
import { jsonc } from "./extends/jsonc";
import { react } from "./extends/react";
import { typescript } from "./extends/typescript";
import { yaml } from "./extends/yaml";

type Options = ReplaceAntfuEslintRulesWithVpRulesDeeply<
  NonNullable<Parameters<typeof antfu>[0]>
> & {
  javascriptExtends?: javascript.Options;
  importsExtends?: imports.Options;
  typescriptExtends?: typescript.Options;
  jsoncExtends?: jsonc.Options;
  yamlExtends?: yaml.Options;
  reactExtends?: react.Options;
  mdx?: boolean | mdx.Options;
  storybook?: boolean | storybook.Options;
  prettier?: boolean | prettier.Options;
};

const vdustr = (
  options?: Options,
  ...userConfigs: Array<Config>
): VpComposer => {
  let config: VpComposer = antfu({
    // Use `prettier` for formatting by default.
    stylistic: false,
    ...(options as any),
  });

  javascript(config, options?.javascriptExtends);
  imports(config, options?.importsExtends);
  typescript(config, options?.typescriptExtends);
  jsonc(config, options?.jsoncExtends);
  yaml(config, options?.yamlExtends);
  react(config, options?.reactExtends);

  const storybookEnabled: boolean = Boolean(options?.storybook ?? false);

  if (storybookEnabled) {
    const storybookOptions: undefined | storybook.Options =
      typeof options?.storybook !== "object" ? undefined : options.storybook;
    config = config.append(
      storybook(...(!storybookOptions ? [] : [storybookOptions])),
    );
  }

  const mdxEnabled: boolean = Boolean(options?.mdx ?? false);

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

  const prettierEnabled: boolean = Boolean(options?.prettier ?? true);
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
