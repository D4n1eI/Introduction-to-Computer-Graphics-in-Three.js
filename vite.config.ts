import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/Introduction-to-Computer-Graphics-in-Three.js/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
