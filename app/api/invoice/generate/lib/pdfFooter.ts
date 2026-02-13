import jsPDF from "jspdf";
import { COLORS, drawSectionHeader, drawBox, euro } from "./pdfHelpers";
import { InvoiceData } from "@/lib/invoiceUtils";

// ─── Pricing ─────────────────────────────────────────────────────────────────
export function renderPricing(doc: jsPDF, pageWidth: number, invoiceData: InvoiceData) {
    const baseY = 550; // 440 (deliverables) + 110
    const hasDiscount = (invoiceData.pricing?.referralDiscount || 0) > 0;

    // Header
    drawSectionHeader(doc, "PRICING", pageWidth - 200, baseY, 160);

    // Content
    const pricingBoxHeight = hasDiscount ? 115 : 100;
    drawBox(doc, pageWidth - 200, baseY + 25, 160, pricingBoxHeight, COLORS.white);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let pricingY = baseY + 45;

    // 1. Subtotal
    doc.text("Subtotal:", pageWidth - 190, pricingY);
    doc.text(euro(invoiceData.pricing?.subtotal || 0), pageWidth - 50, pricingY, { align: "right" });
    pricingY += 15;

    // 2. Referral Discount
    if (hasDiscount) {
        doc.setTextColor(...COLORS.green);
        const discountPercent = invoiceData.pricing?.referralDiscountPercent || 0;
        doc.text(`Discount (${discountPercent.toFixed(2)}%):`, pageWidth - 190, pricingY);
        doc.text(`-${euro(invoiceData.pricing?.referralDiscount || 0)}`, pageWidth - 50, pricingY, { align: "right" });
        pricingY += 15;
        doc.setTextColor(...COLORS.gray);
    }

    // 3. Net Amount
    doc.setFont("helvetica", "bold");
    doc.text("Net Amount:", pageWidth - 190, pricingY);
    doc.text(euro(invoiceData.pricing?.netAmount || 0), pageWidth - 50, pricingY, { align: "right" });
    pricingY += 15;

    // 4. MwSt (19%)
    doc.setFont("helvetica", "normal");
    doc.text(`MwSt (${(invoiceData.pricing?.vatPercent || 19).toFixed(2)}%):`, pageWidth - 190, pricingY);
    doc.text(euro(invoiceData.pricing?.vat || 0), pageWidth - 50, pricingY, { align: "right" });

    // Total bar
    const totalBoxY = baseY + pricingBoxHeight;
    doc.setFillColor(...COLORS.darkBlue);
    doc.rect(pageWidth - 200, totalBoxY, 160, 25, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", pageWidth - 190, totalBoxY + 17);
    doc.setFontSize(14);
    doc.text(euro(invoiceData.pricing?.total || 0), pageWidth - 50, totalBoxY + 17, { align: "right" });

    return { nextY: baseY + (hasDiscount ? 145 : 130) };
}

// ─── Payment Information ─────────────────────────────────────────────────────
export function renderPaymentInfo(doc: jsPDF, pageWidth: number, yPos: number) {
    drawSectionHeader(doc, "PAYMENT INFORMATION", 40, yPos, pageWidth - 80);
    drawBox(doc, 40, yPos + 25, pageWidth - 80, 100, COLORS.lightGray);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text("Payment is due within 30 days of invoice date.", 50, yPos + 40);
    doc.text("Please use the following bank details for payment:", 50, yPos + 55);

    doc.setFont("helvetica", "bold");
    doc.text("Bank Transfer Details:", 50, yPos + 75);
    doc.setFont("helvetica", "normal");
    doc.text("IBAN: DE86 5009 0500 0006 4023 17", 50, yPos + 90);
    doc.text("BIC: GENODEF1XXX", 50, yPos + 105);
    doc.text("Account Holder: Ramazan Yildirim", 50, yPos + 120);

    // Legal details
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.mediumGray);
    doc.text("Amtsgericht: Offenburg", pageWidth - 50, yPos + 105, { align: "right" });
    doc.text("USt-IdNr.: DE123456789", pageWidth - 50, yPos + 120, { align: "right" });

    return { nextY: yPos + 140 };
}

// ─── Footer ──────────────────────────────────────────────────────────────────
export function renderFooter(doc: jsPDF, pageWidth: number, yPos: number) {
    doc.setTextColor(...COLORS.mutedGray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
        "Ramazan Yildirim - Full Stack Developer - Sasbach, Germany",
        pageWidth / 2,
        yPos,
        { align: "center" },
    );
}
