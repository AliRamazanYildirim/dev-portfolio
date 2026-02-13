import jsPDF from "jspdf";
import fs from "fs";
import path from "path";
import { COLORS, drawSectionHeader, drawBox, formatDate, parseDate, euro } from "./pdfHelpers";
import { InvoiceData } from "@/lib/invoiceUtils";

// ─── Logo ────────────────────────────────────────────────────────────────────
export function renderLogo(doc: jsPDF) {
    try {
        const logoPath = path.join(process.cwd(), "public", "ali-ramazan-yildirim.png");

        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const logoBase64 = logoBuffer.toString("base64");
            doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 40, -10, 140, 130);
        } else {
            renderFallbackLogo(doc);
        }
    } catch (error) {
        console.error("Logo yüklenirken hata:", error);
        renderFallbackLogo(doc);
    }
}

function renderFallbackLogo(doc: jsPDF) {
    doc.setTextColor(...COLORS.darkBlue);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ARY", 85, 75, { align: "center" });
}

// ─── Header ──────────────────────────────────────────────────────────────────
export function renderHeader(doc: jsPDF, pageWidth: number) {
    renderLogo(doc);

    // INVOICE title
    doc.setTextColor(...COLORS.darkBlue);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 40, 65, { align: "right" });

    // Blue line
    doc.setDrawColor(...COLORS.darkBlue);
    doc.setLineWidth(3);
    doc.line(40, 100, pageWidth - 40, 100);
}

// ─── Invoice Details Box ─────────────────────────────────────────────────────
export function renderInvoiceDetails(doc: jsPDF, pageWidth: number, invoiceData: InvoiceData) {
    const yPos = 110;

    drawBox(doc, pageWidth - 250, yPos, 210, 80, COLORS.lightGray);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Labels
    doc.text("Invoice Number:", pageWidth - 240, yPos + 15);
    doc.text("Invoice Date:", pageWidth - 240, yPos + 30);
    doc.text("Due Date:", pageWidth - 240, yPos + 45);
    doc.text("Project:", pageWidth - 240, yPos + 60);

    // Values
    doc.setFont("helvetica", "bold");
    doc.text(invoiceData.invoiceNumber, pageWidth - 50, yPos + 15, { align: "right" });

    const issueDate = parseDate(invoiceData.issueDate);
    const dueDate = parseDate(invoiceData.dueDate);

    doc.text(formatDate(issueDate), pageWidth - 50, yPos + 30, { align: "right" });
    doc.text(formatDate(dueDate), pageWidth - 50, yPos + 45, { align: "right" });
    doc.text(invoiceData.project?.title || "", pageWidth - 50, yPos + 60, { align: "right" });
}

// ─── FROM / BILL TO ──────────────────────────────────────────────────────────
export function renderFromAndBillTo(doc: jsPDF, pageWidth: number, invoiceData: InvoiceData) {
    const yPos = 200;

    // FROM section
    drawSectionHeader(doc, "FROM", 40, yPos, 240);
    drawBox(doc, 40, yPos + 25, 240, 75, COLORS.lightGray);

    doc.setTextColor(...COLORS.darkBlue);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("ARY Tech Solutions", 50, yPos + 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Inh. Ramazan Yildirim", 50, yPos + 62);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.text("Hebelstraße 1", 50, yPos + 78);
    doc.text("77880 Sasbach, Germany", 50, yPos + 93);

    // BILL TO section
    drawSectionHeader(doc, "BILL TO", pageWidth - 250, yPos, 210);
    drawBox(doc, pageWidth - 250, yPos + 25, 210, 75, COLORS.lightGray);

    doc.setTextColor(...COLORS.darkBlue);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceData.billTo?.name || "", pageWidth - 240, yPos + 45);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let billToY = yPos + 60;

    if (invoiceData.billTo?.address) {
        const addressLines = invoiceData.billTo.address.split("\n");
        addressLines.forEach((line: string) => {
            if (line.trim()) {
                doc.text(line.trim(), pageWidth - 240, billToY);
                billToY += 13;
            }
        });
    }

    if (invoiceData.billTo?.postcode || invoiceData.billTo?.city) {
        const cityLine = [invoiceData.billTo?.postcode, invoiceData.billTo?.city]
            .filter(Boolean)
            .join(" ");
        const addressStr = invoiceData.billTo?.address || "";
        if (!addressStr.includes(cityLine)) {
            doc.text(cityLine, pageWidth - 240, billToY);
            billToY += 13;
        }
    }

    if (invoiceData.billTo?.email) {
        doc.text(`Email: ${invoiceData.billTo.email}`, pageWidth - 240, billToY);
    }
}
