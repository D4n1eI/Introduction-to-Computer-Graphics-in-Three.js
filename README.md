# Video Game built with TypeScript and Three.js

Live demo: [https://d4n1ei.github.io/Introduction-to-Computer-Graphics-in-Three.js/](https://d4n1ei.github.io/Introduction-to-Computer-Graphics-in-Three.js/)

## Deploy to GitHub Pages

This repo is set up to deploy automatically from the `main` branch using [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push your changes to `main`.
2. GitHub Actions runs `npm ci` and `npm run build`.
3. The generated `dist/` folder is published to GitHub Pages.

## Local development

1. Install dependencies with `npm ci`.
2. Run `npm run dev` for local editing.
3. Run `npm run build` before pushing if you want to verify the production bundle.