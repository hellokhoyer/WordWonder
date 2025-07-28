import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        search: resolve(__dirname, "search.html"),
      },
    },
    outDir: "../backend/public",
    emptyOutDir: true,
  },
});
