import { load } from "js-yaml";

import { defineConfig } from "vite";

import { readFileSync } from "node:fs";
import type { PackageJson } from "type-fest";
import { viteStaticCopy } from "vite-plugin-static-copy";

const pkg = load(readFileSync("package.yaml", "utf8")) as PackageJson;

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "LICENSE", dest: "." },
        {
          src: "package.yaml",
          dest: ".",
          rename: "package.json",
          transform: (content: string) => JSON.stringify(load(content), null, 2),
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: {},
      name: pkg.name,
      formats: ["es"],
    },
    ssr: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        msw: "src/msw/index.ts",
        "test/e2e": "src/test/e2e/index.ts",
        "test/form": "src/test/form/index.ts",
        "mocks/tolgee": "src/mocks/tolgee/index.ts",
        "mocks/query_client": "src/mocks/query_client/index.ts",
      },
      output: {
        format: "es",
        entryFileNames: (chunkInfo) => {
          const entryName = chunkInfo.name === "index" ? "index" : `${chunkInfo.name}/index`;
          return `${entryName}.es.js`;
        },
      },
      external: Object.keys(pkg.peerDependencies!),
    },
  },
});
