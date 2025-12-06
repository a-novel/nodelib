import { includeIgnoreFile } from "@eslint/compat";
import type { ConfigWithExtends } from "@eslint/config-helpers";
import js from "@eslint/js";
import type { Config as SvelteConfig } from "@sveltejs/kit";
import prettier from "eslint-config-prettier";
import storybook from "eslint-plugin-storybook";
import svelte from "eslint-plugin-svelte";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

export interface EslintOptions {
  isLib?: boolean;
  svelte?: SvelteConfig;
  storybook?: boolean;
  ignores?: string[];
  gitIgnorePath?: string;
  customRules?: ConfigWithExtends;
}

export function Eslint(
  opts: EslintOptions = {}
): Parameters<typeof defineConfig> {
  let customRules: ConfigWithExtends = {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  };

  // Only ignore links without resolve in lib mode, as they can be generic, reusable elements.
  if (opts.svelte && opts.isLib) {
    customRules.rules!["svelte/no-navigation-without-resolve"] = [
      "error",
      { ignoreLinks: true },
    ];
  }

  if (opts.customRules) {
    customRules = {
      ...opts.customRules,
      languageOptions: {
        ...customRules.languageOptions,
        ...opts.customRules.languageOptions,
      },
      rules: {
        ...customRules.rules,
        ...opts.customRules.rules,
      },
    };
  }

  // Make sure to insert rules in the correct order.
  const sortedRules: Record<string, ConfigWithExtends[]> = {
    ignoreRules: [
      globalIgnores(["**/dist/**", "**/.*/**", ...(opts.ignores ?? [])]),
    ],
    langRules: [js.configs.recommended, ...ts.configs.recommended],
    frameworkRules: [],
    customRules: [customRules],
    styleRules: [prettier],
  };

  if (opts.svelte) {
    sortedRules.langRules.push(...svelte.configs.recommended);
    sortedRules.styleRules.push(...svelte.configs.prettier);
    sortedRules.customRules.push({
      files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: [".svelte"],
          parser: ts.parser,
          svelteConfig: opts.svelte,
        },
      },
    });
  }

  if (opts.gitIgnorePath) {
    sortedRules.ignoreRules.push(includeIgnoreFile(opts.gitIgnorePath));
  }

  if (opts.storybook) {
    sortedRules.frameworkRules.push(
      ...(storybook.configs["flat/recommended"] as ConfigWithExtends[])
    );
  }

  return [
    ...sortedRules.ignoreRules,
    ...sortedRules.langRules,
    ...sortedRules.frameworkRules,
    ...sortedRules.customRules,
    ...sortedRules.styleRules,
  ];
}
