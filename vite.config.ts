import { defineConfig } from "vite";

export default defineConfig({
  root: "src/dist",
  base: "/Introduction-to-Computer-Graphics-in-Three.js/",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
});
