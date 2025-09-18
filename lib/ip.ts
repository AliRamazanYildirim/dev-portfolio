export function getIpFromHeaders(h: Headers) {
  const xff = h.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0]!.trim() : h.get("cf-connecting-ip") || h.get("x-real-ip") || "127.0.0.1";
  return ip;
}
