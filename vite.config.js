import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/src/content/reference/")) {
            const name = id.split("/").at(-1).replace(/\.js$/, "");
            return "reference-" + name;
          }
          if (id.includes("/src/content/")) return "course-content";
          if (
            id.includes("/node_modules/react") ||
            id.includes("/node_modules/scheduler")
          )
            return "react-vendor";
        },
      },
    },
  },
});
