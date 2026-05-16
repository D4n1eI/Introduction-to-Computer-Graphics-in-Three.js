import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/Introduction-to-Computer-Graphics-in-Three.js/",
  publicDir: "Pixel UI pack 3/public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "Pixel UI pack 3/main.ts",
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
