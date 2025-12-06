import type { PrettierConfig as SortImportsConfig } from "@trivago/prettier-plugin-sort-imports";
import type { Config } from "prettier";
import type { SqlOptions } from "prettier-plugin-sql";

export interface PrettierOptions {
  svelte?: boolean;
  sql?: boolean;
}

export function Prettier(opts: PrettierOptions = {}): Config & SortImportsConfig & Partial<SqlOptions> {
  const baseConfig: Config & SortImportsConfig & Partial<SqlOptions> = {
    useTabs: false,
    tabWidth: 2,
    trailingComma: "es5",
    semi: true,
    singleQuote: false,
    printWidth: 120,
    importOrder: [
      "^\\$",
      "^\\.(\\.)?\\/",
      "^node\\:",
      "^virtual\\:",
      "^svelte",
      "^vite",
      "^vitest",
      "^@a-novel",
      "<THIRD_PARTY_MODULES>",
    ],
    importOrderSeparation: true,
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-packagejson"],
    overrides: [],
    htmlWhitespaceSensitivity: "strict",
  };

  if (opts.svelte) {
    baseConfig.plugins!.push("prettier-plugin-svelte");
    baseConfig.overrides!.push({
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    });
  }

  if (opts.sql) {
    baseConfig.plugins!.push("prettier-plugin-sql");
    baseConfig.language = "postgresql";
    baseConfig.paramTypes = `{ numbered: ["?"] }`;
  }

  return baseConfig;
}
