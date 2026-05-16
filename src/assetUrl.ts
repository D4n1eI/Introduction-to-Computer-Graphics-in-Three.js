export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\//, "");
  const assetPath = import.meta.env.DEV
    ? normalizedPath
    : `dist/${normalizedPath}`;

  return new URL(assetPath, document.baseURI).toString();
}
