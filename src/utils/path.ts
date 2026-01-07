export const basePath = process.env.BASE_PATH || "";

export function getPublicPath(path?: string) {
  return `${basePath}${path}`;
}

export function isRelativePath(path?: string) {
  return path?.startsWith("/");
}

export function getAbsoluteURL(path?: string) {
  return isRelativePath(path) ? getPublicPath(path) : path;
}
