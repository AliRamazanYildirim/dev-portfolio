import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import { InvoiceData } from "@/lib/invoiceUtils";
import fs from "fs";
import path from "path";
import { INVOICE_CONSTANTS } from "@/constants/invoice";

// Ensure this API route runs on Node runtime (required for fs, path, jsPDF)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json();

    // Helper to robustly parse incoming date values
    function parseDate(input?: string | number): Date {
      if (!input) return new Date();
      // If it's a number-like string, try Number
      if (typeof input === "number") return new Date(input);
      const num = Number(input);
      if (!Number.isNaN(num) && input.toString().trim() !== "") {
        return new Date(num);
      }
      // Try ISO / built-in parsing
      const d = new Date(input as string);
      if (!isNaN(d.getTime())) return d;
      // Fallback to now and log
      console.warn("Invalid invoice date provided, falling back to now:", input);
      return new Date();
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const darkBlue = "#1a365d";
    const lightBlue = "#e6f3ff";
    const gray = "#4a5568";
    const lightGray = "#f7fafc";

    // Header - Logo without background box
    try {
      // Logo dosyasının yolunu belirle
      const logoPath = path.join(
        process.cwd(),
        "public",
        "ali-ramazan-yildirim.png"
      );

      if (fs.existsSync(logoPath)) {
        // Logo dosyasını base64'e çevir
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString("base64");

        // Logo'yu ekle (arka plan olmadan, 120x100 boyutunda, daha yukarıda)
        doc.addImage(
          `data:image/png;base64,${logoBase64}`,
          "PNG",
          40,
          -10,
          140,
          130
        );
      } else {
        // Fallback: Logo bulunamazsa text kullan
        doc.setTextColor(26, 54, 93);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ARY", 85, 75, { align: "center" });
      }
    } catch (error) {
      // Hata durumunda fallback text kullan
      console.error("Logo yüklenirken hata:", error);
      doc.setTextColor(26, 54, 93);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ARY", 85, 75, { align: "center" });
    }

    // INVOICE Title (right)
    doc.setTextColor(26, 54, 93);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 40, 65, { align: "right" });

    // Blue line under header
    doc.setDrawColor(26, 54, 93);
    doc.setLineWidth(3);
    doc.line(40, 100, pageWidth - 40, 100);

    // Invoice Details Box (top right) - Genişletilmiş
    let yPos = 110;
    doc.setFillColor(247, 250, 252); // Light gray
    doc.rect(pageWidth - 250, yPos, 210, 80, "F"); // Genişliği 160'dan 210'a çıkardık
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(pageWidth - 250, yPos, 210, 80, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Labels (sol tarafta)
    doc.text("Invoice Number:", pageWidth - 240, yPos + 15);
    doc.text("Invoice Date:", pageWidth - 240, yPos + 30);
    doc.text("Due Date:", pageWidth - 240, yPos + 45);
    doc.text("Project:", pageWidth - 240, yPos + 60);

    // Values (sağ tarafta, aynı satırda) - Daha geniş alan
    doc.setFont("helvetica", "bold");
    doc.text(invoiceData.invoiceNumber, pageWidth - 50, yPos + 15, {
      align: "right",
    });
    const issueDate = parseDate(invoiceData.issueDate);
    const dueDate = parseDate(invoiceData.dueDate);

    // Deterministic German-style date formatting (DD.MM.YYYY)
    function formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      return `${day}.${month}.${year}`;
    }

    doc.text(formatDate(issueDate), pageWidth - 50, yPos + 30, {
      align: "right",
    });
    doc.text(formatDate(dueDate), pageWidth - 50, yPos + 45, {
      align: "right",
    });
    doc.text(invoiceData.project?.title || "", pageWidth - 50, yPos + 60, {
      align: "right",
    });

    // FROM and BILL TO sections - Boşlukları azalttık
    yPos = 200;

    // FROM section - Yüksekliği azalttık
    doc.setFillColor(26, 54, 93);
    doc.rect(40, yPos, 240, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("FROM", 50, yPos + 17);

    doc.setFillColor(247, 250, 252);
    doc.rect(40, yPos + 25, 240, 75, "F"); // 110'dan 75'e düşürdük (email/phone kaldırıldı)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(40, yPos + 25, 240, 75, "S");

    doc.setTextColor(26, 54, 93);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("ARY Tech Solutions", 50, yPos + 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Inh. Ramazan Yildirim", 50, yPos + 62);

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.text("Hebelstraße 1", 50, yPos + 78);
    doc.text("77880 Sasbach, Germany", 50, yPos + 93);

    // BILL TO section - Invoice Details box ile aynı hizada
    doc.setFillColor(26, 54, 93);
    doc.rect(pageWidth - 250, yPos, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", pageWidth - 240, yPos + 17);

    doc.setFillColor(247, 250, 252);
    doc.rect(pageWidth - 250, yPos + 25, 210, 75, "F"); // FROM ile aynı yükseklik
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(pageWidth - 250, yPos + 25, 210, 75, "S");

    doc.setTextColor(26, 54, 93);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceData.billTo?.name || "", pageWidth - 240, yPos + 45);

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let billToY = yPos + 60;

    // Address handling - eğer address çok satırlıysa split et, yoksa olduğu gibi göster
    if (invoiceData.billTo?.address) {
      const addressLines = invoiceData.billTo.address.split("\n");
      addressLines.forEach((line: string) => {
        if (line.trim()) {
          doc.text(line.trim(), pageWidth - 240, billToY);
          billToY += 13;
        }
      });
    }

    // City and Postcode - eğer address'te yoksa ayrıca göster
    if (invoiceData.billTo?.postcode || invoiceData.billTo?.city) {
      const cityLine = [
        invoiceData.billTo?.postcode,
        invoiceData.billTo?.city
      ].filter(Boolean).join(" ");

      // Eğer cityLine address içinde yoksa, ayrı göster
      const addressStr = invoiceData.billTo?.address || "";
      if (!addressStr.includes(cityLine)) {
        doc.text(cityLine, pageWidth - 240, billToY);
        billToY += 13;
      }
    }

    // Email (optional)
    if (invoiceData.billTo?.email) {
      doc.text(`Email: ${invoiceData.billTo.email}`, pageWidth - 240, billToY);
    }

    // Project Details Section - Boşlukları azalttık
    yPos = 310;
    doc.setFillColor(26, 54, 93);
    doc.rect(40, yPos, pageWidth - 80, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT DETAILS", 50, yPos + 17);

    // Project content - Yüksekliği azalttık
    doc.setFillColor(255, 255, 255);
    doc.rect(40, yPos + 25, (pageWidth - 80) * 0.7, 100, "F"); // 120'den 100'e düşürdük
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(40, yPos + 25, (pageWidth - 80) * 0.7, 100, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Beschreibung: Wenn leer ODER exakt Standardwert => dynamisch mit Kategorie erzeugen
    const selectedCategory = invoiceData.project?.category || "web development";
    const rawDesc = invoiceData.project?.description?.trim() || "";
    let description: string;
    if (!rawDesc || rawDesc === INVOICE_CONSTANTS.PROJECT.DEFAULT_DESCRIPTION) {
      description = `Custom (${selectedCategory}) solution including design, development, and deployment.`;
    } else {
      description = rawDesc;
    }
    const maxWidth = (pageWidth - 80) * 0.7 - 20; // Kutunun genişliği - padding
    const wrappedText = doc.splitTextToSize(description, maxWidth);

    let lineY = yPos + 45;
    wrappedText.forEach((line: string) => {
      if (lineY < yPos + 105) {
        // Metin alanını 105'e kadar sınırla
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

    // Category and Amount (right side)
    const categoryX = 40 + (pageWidth - 80) * 0.7;
    doc.setFillColor(247, 250, 252);
    doc.rect(categoryX, yPos + 25, (pageWidth - 80) * 0.3, 100, "F"); // 120'den 100'e düşürdük
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(categoryX, yPos + 25, (pageWidth - 80) * 0.3, 100, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Category:", categoryX + 10, yPos + 45);
    doc.text("Amount:", categoryX + 10, yPos + 75);

    doc.setFont("helvetica", "normal");

    // Category değerini formdan gelen değerle göster
    const categoryText = invoiceData.project?.category || "Web Development";

    doc.text(categoryText, categoryX + 10, yPos + 60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 54, 93);
    doc.text(
      `€${(invoiceData.pricing?.netAmount || 0).toFixed(2)}`,
      categoryX + 10,
      yPos + 95
    ); // Show net amount (after discount, before MwSt)

    // Deliverables Section - Boşlukları azalttık
    yPos = 440;
    doc.setFillColor(230, 243, 255);
    doc.rect(40, yPos, pageWidth - 80, 25, "F");
    doc.setDrawColor(26, 54, 93);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(40, yPos, pageWidth - 80, 25, "S");

    doc.setTextColor(26, 54, 93);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DELIVERABLES", 50, yPos + 17);

    // Deliverables content - 3 sütun için optimize edildi
    doc.setFillColor(255, 255, 255);
    doc.rect(40, yPos + 25, pageWidth - 80, 80, "F"); // 120'den 80'e düşürüldü (3 sütun daha verimli)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(40, yPos + 25, pageWidth - 80, 80, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (
      invoiceData.project?.deliverables &&
      invoiceData.project.deliverables.length > 0
    ) {
      // 3 sütun layout için parametreler
      const columnWidth = (pageWidth - 80 - 60) / 3; // 3 eşit sütun, 20px padding her sütun arası
      const startX = 50; // Sol kenar
      const startY = yPos + 45; // Başlangıç Y pozisyonu
      const lineHeight = 12; // Satır yüksekliği
      const maxItemsPerColumn = 5; // Her sütunda maksimum 5 item

      let currentColumn = 0; // 0, 1, 2
      let currentRow = 0; // 0, 1, 2, 3, 4

      invoiceData.project.deliverables.forEach(
        (deliverable: string, index: number) => {
          // Eğer 15 item'e ulaştıysak (3x5) dur
          if (index >= 15) return;

          // Mevcut pozisyonu hesapla
          const xPos = startX + currentColumn * columnWidth;
          const yPos_item = startY + currentRow * lineHeight;

          // Deliverable'ı yazdır
          doc.text(`• ${deliverable}`, xPos, yPos_item);

          // Sonraki pozisyonu hesapla
          currentRow++;
          if (currentRow >= maxItemsPerColumn) {
            currentRow = 0;
            currentColumn++;
          }
        }
      );

      // Eğer 15'den fazla item varsa, uyarı göster
      if (invoiceData.project.deliverables.length > 15) {
        const remainingCount = invoiceData.project.deliverables.length - 15;
        doc.setFont("helvetica", "italic");
        doc.text(
          `... and ${remainingCount} more items`,
          startX,
          startY + 5 * lineHeight + 10
        );
        doc.setFont("helvetica", "normal");
      }
    } else {
      // Fallback durumu - eğer deliverables yoksa
      doc.text("• No specific deliverables selected", 50, yPos + 45);
    }

    // Pricing ve Total - 3 sütun layout ile optimize edildi
    yPos += 110; // 150'den 110'a düşürüldü (deliverables kutusu küçüldü)

    // Pricing breakdown - German tax system (19% MwSt)
    doc.setFillColor(26, 54, 93);
    doc.rect(pageWidth - 200, yPos, 160, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PRICING", pageWidth - 190, yPos + 17);

    // Pricing content - Extended for German tax breakdown with discount
    const hasDiscount = (invoiceData.pricing?.referralDiscount || 0) > 0;
    const pricingBoxHeight = hasDiscount ? 115 : 100;

    doc.setFillColor(255, 255, 255);
    doc.rect(pageWidth - 200, yPos + 25, 160, pricingBoxHeight, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(pageWidth - 200, yPos + 25, 160, pricingBoxHeight, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // German tax system breakdown
    let pricingY = yPos + 45;

    // 1. Subtotal (Original price)
    doc.text("Subtotal:", pageWidth - 190, pricingY);
    doc.text(
      `€${(invoiceData.pricing?.subtotal || 0).toFixed(2)}`,
      pageWidth - 50,
      pricingY,
      { align: "right" }
    );
    pricingY += 15;

    // 2. Referral Discount (if applicable)
    if (hasDiscount) {
      doc.setTextColor(34, 139, 34); // Green color for discount
      const discountPercent = invoiceData.pricing?.referralDiscountPercent || 0;
      doc.text(`Discount (${discountPercent.toFixed(2)}%):`, pageWidth - 190, pricingY);
      doc.text(
        `-€${(invoiceData.pricing?.referralDiscount || 0).toFixed(2)}`,
        pageWidth - 50,
        pricingY,
        { align: "right" }
      );
      pricingY += 15;
      doc.setTextColor(74, 85, 104); // Reset to gray
    }

    // 3. Net Amount (after discount, before MwSt)
    doc.setFont("helvetica", "bold");
    doc.text("Net Amount:", pageWidth - 190, pricingY);
    doc.text(
      `€${(invoiceData.pricing?.netAmount || 0).toFixed(2)}`,
      pageWidth - 50,
      pricingY,
      { align: "right" }
    );
    pricingY += 15;

    // 4. MwSt (19% German VAT)
    doc.setFont("helvetica", "normal");
    doc.text(
      `MwSt (${(invoiceData.pricing?.vatPercent || 19).toFixed(2)}%):`,
      pageWidth - 190,
      pricingY
    );
    doc.text(
      `€${(invoiceData.pricing?.vat || 0).toFixed(2)}`,
      pageWidth - 50,
      pricingY,
      { align: "right" }
    );

    // Total section - dynamic position based on discount
    const totalBoxY = yPos + pricingBoxHeight;
    doc.setFillColor(26, 54, 93);
    doc.rect(pageWidth - 200, totalBoxY, 160, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", pageWidth - 190, totalBoxY + 17);
    doc.setFontSize(14);
    doc.text(
      `€${(invoiceData.pricing?.total || 0).toFixed(2)}`,
      pageWidth - 50,
      totalBoxY + 17,
      { align: "right" }
    );

    // Payment Information - Adjusted spacing based on discount
    yPos += (hasDiscount ? 145 : 130); // Extra space when discount is shown
    doc.setFillColor(26, 54, 93);
    doc.rect(40, yPos, pageWidth - 80, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INFORMATION", 50, yPos + 17);

    // Payment bilgi kutusunu düzenledik
    doc.setFillColor(247, 250, 252);
    doc.rect(40, yPos + 25, pageWidth - 80, 100, "F"); // Yüksekliği 120'den 100'e düşürdük
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5); // İnce çerçeve
    doc.rect(40, yPos + 25, pageWidth - 80, 100, "S");

    doc.setTextColor(74, 85, 104);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text("Payment is due within 30 days of invoice date.", 50, yPos + 40);
    doc.text(
      "Please use the following bank details for payment:",
      50,
      yPos + 55
    );
    doc.setFont("helvetica", "bold");
    doc.text("Bank Transfer Details:", 50, yPos + 75);
    doc.setFont("helvetica", "normal");
    doc.text("IBAN: DE86 5009 0500 0006 4023 17", 50, yPos + 90);
    doc.text("BIC: GENODEF1XXX", 50, yPos + 105);
    doc.text("Account Holder: Ramazan Yildirim", 50, yPos + 120);

    // Sağ alt köşeye ek bilgiler
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Amtsgericht: Offenburg", pageWidth - 50, yPos + 105, { align: "right" });
    doc.text("USt-IdNr.: DE123456789", pageWidth - 50, yPos + 120, { align: "right" });

    // Footer - sayfanın altında optimum konumda
    const footerY = yPos + 140; // PAYMENT kutusu sonrası
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Ramazan Yildirim - Full Stack Developer - Sasbach, Germany",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    const pdfBytes = doc.output("arraybuffer");

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
