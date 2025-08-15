export function getIpFromHeaders(h: Headers) {
  // Debug: Protokolle die Header.
  console.log("Headers:", Object.fromEntries(h.entries()));
  const xff = h.get("x-forwarded-for");
  let ip = xff
    ? xff.split(",")[0]!.trim()
    : h.get("cf-connecting-ip") || h.get("x-real-ip") || "127.0.0.1";
  const ua = h.get("user-agent") || "";
  // IP und User-Agent kombinieren
  return `${ip}|${ua}`;
}
