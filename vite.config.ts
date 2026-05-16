import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/Introduction-to-Computer-Graphics-in-Three.js/",
  build: {
    outDir: "../docs/dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
