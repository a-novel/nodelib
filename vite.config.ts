import { peerDependencies, name } from "./package.json";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        msw: "src/msw/index.ts",
      },
      name,
      formats: ["es"],
      fileName: (format, entryName) =>
        entryName === "index" ? `index.${format}.js` : `${entryName}/index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: Object.keys(peerDependencies),
    },
  },
});
