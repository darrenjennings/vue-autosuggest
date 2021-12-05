import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  build: {
    lib: {
      entry: "src/vue-autosuggest.js",
      name: "VueAutosuggest",
      fileName: format => (format === "umd" ? "vue-autosuggest.js" : "vue-autosuggest.esm.js"),
      formats: ["umd", "es"]
    },
    rollupOptions: {
      output: {
        exports: "named",
        name: "VueAutosuggest"
      },
      external: ["vue"]
    }
  },
  plugins: [vue({})]
});
