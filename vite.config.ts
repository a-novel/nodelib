import { peerDependencies, name } from "./package.json";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        msw: "src/msw/index.ts",
        "test/e2e": "src/test/e2e/index.ts",
        "test/form": "src/test/form/index.ts",
        "mocks/tolgee": "src/mocks/tolgee/index.ts",
        "mocks/query_client": "src/mocks/query_client/index.ts",
      },
      name,
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
        http: "src/http/index.ts",
        "http/test": "src/http/test/index.ts",
      },
      output: {
        format: "es",
        entryFileNames: (chunkInfo) => {
          const entryName = chunkInfo.name === "index" ? "index" : `${chunkInfo.name}/index`;
          return `${entryName}.es.js`;
        },
      },
      external: Object.keys(peerDependencies),
    },
  },
});
