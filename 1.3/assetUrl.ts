export function assetUrl(path: string): string {
  const normalizedPath = path.replace(/^\//, "");
  return new URL(`dist/${normalizedPath}`, document.baseURI).toString();
}
