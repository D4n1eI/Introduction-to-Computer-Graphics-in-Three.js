export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\//, "");
  // If the current document base already contains `/dist/`, keep paths
  // relative to that base. Otherwise prefix with `dist/` so local dev
  // servers that serve the `docs/` folder still find built assets.
  const base = document.baseURI || window.location.href;
  const needsDistPrefix = !base.includes('/dist/');
  const assetPath = needsDistPrefix ? `dist/${normalizedPath}` : normalizedPath;

  return new URL(assetPath, base).toString();
}
