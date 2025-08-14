export function getIpFromHeaders(h: Headers) {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("cf-connecting-ip") || h.get("x-real-ip") || "127.0.0.1";
}
