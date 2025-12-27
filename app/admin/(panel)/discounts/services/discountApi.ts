export async function fetchDiscounts(): Promise<any> {
  const res = await fetch("/api/discounts");
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Failed to load discounts");
  return json.data;
}

export async function fetchDiscountSettings(): Promise<any> {
  const res = await fetch("/api/admin/settings/discounts");
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Failed to load discounts setting");
  return json.data;
}

export async function patchDiscount(
  payload: Record<string, unknown>,
): Promise<any> {
  const res = await fetch("/api/discounts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Discount could not be updated");
  return json.data;
}

export async function deleteDiscountApi(id: string): Promise<void> {
  const res = await fetch("/api/discounts", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Discount could not be deleted");
}

export async function sendDiscountEmailApi(
  transactionId: string,
  discountRate: number | "+3",
) {
  const res = await fetch("/api/admin/discounts/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId, discountRate }),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Email could not be sent");
  return json.data;
}

export async function resetEmailApi(
  transactionId: string,
  sendCorrectionEmail = true,
) {
  const res = await fetch("/api/admin/discounts/reset-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId, sendCorrectionEmail }),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Email status could not be reset");
  return json.data;
}

export async function updateDiscountsSetting(enabled: boolean) {
  const res = await fetch("/api/admin/settings/discounts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Failed to update setting");
  return json.data;
}
