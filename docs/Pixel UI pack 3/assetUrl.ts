export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\//, "");
  // Use paths relative to the page base so assets resolve correctly
  // whether the site is served from the repo root or from inside `dist/`.
  const assetPath = normalizedPath;

  return new URL(assetPath, document.baseURI).toString();
}
