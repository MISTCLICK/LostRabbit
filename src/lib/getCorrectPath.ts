export default function getCorrectPath(path: string, st: string): string {
  if (path === "/") return path;
  if (st === "default" && path === "/survey") return path;
  if (st === "default") return "/";
  if (st !== path) return st;

  return path;
}
