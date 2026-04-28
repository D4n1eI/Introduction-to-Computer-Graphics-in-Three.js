# Video Game built with TypeScript and Three.js

Live demo: [https://d4n1ei.github.io/Introduction-to-Computer-Graphics-in-Three.js/](https://d4n1ei.github.io/Introduction-to-Computer-Graphics-in-Three.js/)

Current published version: 1.3

## Deploy to GitHub Pages

This repo is set up to deploy automatically from the `main` branch using [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Make sure the game changes you want are in the `1.3/` source tree.
2. Run `npm run build` from the repository root if you want to verify the production bundle locally.
3. Push your changes to `main`.
4. GitHub Actions runs `npm ci` and `npm run build`.
5. The generated `dist/` folder is published to GitHub Pages.

## Local development

1. Install dependencies with `npm ci`.
2. Run `npm run dev` for local editing.
3. Run `npm run build` before pushing if you want to verify the production bundle.
4. If you want a static preview, serve the generated `dist/` folder instead of opening `1.3/index.html` directly.