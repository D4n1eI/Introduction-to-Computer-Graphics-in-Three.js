export function assetUrl(path: string): string {
  return new URL(path, import.meta.env.BASE_URL).href;
}
