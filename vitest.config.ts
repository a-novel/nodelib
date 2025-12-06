import { builtinModules } from "node:module";

import { defineConfig } from "vitest/config";

const NODE_BUILT_IN_MODULES = builtinModules.filter((m) => !m.startsWith("_"));
NODE_BUILT_IN_MODULES.push(...NODE_BUILT_IN_MODULES.map((m) => `node:${m}`));

export default defineConfig({
  optimizeDeps: {
    exclude: NODE_BUILT_IN_MODULES,
  },
  build: {
    minify: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    provide: {
      globalConfigValue: true,
    },
    coverage: {
      enabled: true,
      clean: true,
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["packages/browser/**/*.{ts,tsx}"],
      exclude: ["packages/browser/dist"],
      allowExternal: true,
    },
    projects: [
      {
        root: "packages/browser",
        extends: true,
      },
    ],
  },
});
