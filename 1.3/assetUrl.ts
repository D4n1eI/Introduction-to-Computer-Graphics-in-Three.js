export function assetUrl(path: string): string {
  const basePath = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${basePath}${path.replace(/^\//, "")}`;
}
