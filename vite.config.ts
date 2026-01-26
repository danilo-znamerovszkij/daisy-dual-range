import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "DaisyDualRange",
      fileName: (format) => {
        if (format === "es") return "index.mjs";
        if (format === "cjs") return "index.cjs";
        if (format === "umd") return "index.umd.js";
        if (format === "iife") return "index.iife.js";
        return `index.${format}.js`;
      },
      formats: ["es", "cjs", "umd", "iife"],
    },
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: ["nouislider"],
      output: {
        globals: { nouislider: "noUiSlider" },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css" || assetInfo.name === "index.css") {
            return "style.css";
          }
          return assetInfo.name ? assetInfo.name : "assets/[name][extname]";
        },
      },
    },
  },
});
