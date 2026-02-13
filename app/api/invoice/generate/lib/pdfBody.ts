import jsPDF from "jspdf";
import { COLORS, drawSectionHeader, drawBox, euro } from "./pdfHelpers";
import { InvoiceData } from "@/lib/invoiceUtils";
import { INVOICE_CONSTANTS } from "@/constants/invoice";

// ─── Project Details ─────────────────────────────────────────────────────────
export function renderProjectDetails(doc: jsPDF, pageWidth: number, invoiceData: InvoiceData) {
  const yPos = 310;
  const contentWidth = pageWidth - 80;

  drawSectionHeader(doc, "PROJECT DETAILS", 40, yPos, contentWidth);

  // Left: description
  const leftWidth = contentWidth * 0.7;
  drawBox(doc, 40, yPos + 25, leftWidth, 100, COLORS.white);

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const selectedCategory = invoiceData.project?.category || "web development";
  const rawDesc = invoiceData.project?.description?.trim() || "";
  let description: string;
  if (!rawDesc || rawDesc === INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION) {
    description = `Custom (${selectedCategory}) solution including design, development, and deployment.`;
  } else {
    description = rawDesc;
  }

  const maxWidth = leftWidth - 20;
  const wrappedText = doc.splitTextToSize(description, maxWidth);

  let lineY = yPos + 45;
  wrappedText.forEach((line: string) => {
    if (lineY < yPos + 105) {
      doc.text(line, 50, lineY);
      lineY += 12;
    }
  });

  const durationText = invoiceData.project?.duration;
  if (durationText) {
    const durationY = Math.min(lineY + 10, yPos + 110);
    doc.setFont("helvetica", "bold");
    doc.text("Duration:", 50, durationY);
    doc.setFont("helvetica", "normal");
    doc.text(durationText, 110, durationY);
  }

  // Right: category + amount
  const categoryX = 40 + leftWidth;
  const rightWidth = contentWidth * 0.3;
  drawBox(doc, categoryX, yPos + 25, rightWidth, 100, COLORS.lightGray);

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Category:", categoryX + 10, yPos + 45);
  doc.text("Amount:", categoryX + 10, yPos + 75);

  doc.setFont("helvetica", "normal");
  doc.text(invoiceData.project?.category || "Web Development", categoryX + 10, yPos + 60);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkBlue);
  doc.text(euro(invoiceData.pricing?.netAmount || 0), categoryX + 10, yPos + 95);
}

// ─── Deliverables ────────────────────────────────────────────────────────────
export function renderDeliverables(doc: jsPDF, pageWidth: number, invoiceData: InvoiceData) {
  const yPos = 440;
  const contentWidth = pageWidth - 80;

  // Header with light blue background
  doc.setFillColor(...COLORS.lightBlue);
  doc.rect(40, yPos, contentWidth, 25, "F");
  doc.setDrawColor(...COLORS.darkBlue);
  doc.setLineWidth(0.5);
  doc.rect(40, yPos, contentWidth, 25, "S");

  doc.setTextColor(...COLORS.darkBlue);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DELIVERABLES", 50, yPos + 17);

  // Content
  drawBox(doc, 40, yPos + 25, contentWidth, 80, COLORS.white);

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  if (invoiceData.project?.deliverables && invoiceData.project.deliverables.length > 0) {
    const columnWidth = (contentWidth - 60) / 3;
    const startX = 50;
    const startY = yPos + 45;
    const lineHeight = 12;
    const maxItemsPerColumn = 5;

    let currentColumn = 0;
    let currentRow = 0;

    invoiceData.project.deliverables.forEach((deliverable: string, index: number) => {
      if (index >= 15) return;

      const xPos = startX + currentColumn * columnWidth;
      const yPosItem = startY + currentRow * lineHeight;
      doc.text(`• ${deliverable}`, xPos, yPosItem);

      currentRow++;
      if (currentRow >= maxItemsPerColumn) {
        currentRow = 0;
        currentColumn++;
      }
    });

    if (invoiceData.project.deliverables.length > 15) {
      const remainingCount = invoiceData.project.deliverables.length - 15;
      doc.setFont("helvetica", "italic");
      doc.text(`... and ${remainingCount} more items`, startX, startY + 5 * lineHeight + 10);
      doc.setFont("helvetica", "normal");
    }
  } else {
    doc.text("• No specific deliverables selected", 50, yPos + 45);
  }
}
