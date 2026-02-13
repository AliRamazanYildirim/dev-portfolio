import jsPDF from "jspdf";

// ─── Colors ──────────────────────────────────────────────────────────────────
export const COLORS = {
  darkBlue: [26, 54, 93] as const,
  lightBlue: [230, 243, 255] as const,
  gray: [74, 85, 104] as const,
  lightGray: [247, 250, 252] as const,
  white: [255, 255, 255] as const,
  green: [34, 139, 34] as const,
  mutedGray: [150, 150, 150] as const,
  mediumGray: [100, 100, 100] as const,
  borderGray: [200, 200, 200] as const,
} as const;

// ─── Date helpers ────────────────────────────────────────────────────────────
/** Robustly parse date values that may arrive as string, number or undefined. */
export function parseDate(input?: string | number): Date {
  if (!input) return new Date();
  if (typeof input === "number") return new Date(input);
  const num = Number(input);
  if (!Number.isNaN(num) && input.toString().trim() !== "") {
    return new Date(num);
  }
  const d = new Date(input as string);
  if (!isNaN(d.getTime())) return d;
  console.warn("Invalid invoice date provided, falling back to now:", input);
  return new Date();
}

/** Format a Date as DD.MM.YYYY (German style). */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
}

// ─── Drawing utilities ───────────────────────────────────────────────────────
/** Draw a thin-bordered filled rectangle. */
export function drawBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor: readonly [number, number, number],
  hasBorder = true,
) {
  doc.setFillColor(...fillColor);
  doc.rect(x, y, w, h, "F");
  if (hasBorder) {
    doc.setDrawColor(...COLORS.borderGray);
    doc.setLineWidth(0.5);
    doc.rect(x, y, w, h, "S");
  }
}

/** Draw a section header bar (dark blue background, white text). */
export function drawSectionHeader(
  doc: jsPDF,
  label: string,
  x: number,
  y: number,
  w: number,
  h = 25,
) {
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(x, y, w, h, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(label, x + 10, y + 17);
}

/** Format a Euro amount. */
export function euro(amount: number): string {
  return `€${amount.toFixed(2)}`;
}
