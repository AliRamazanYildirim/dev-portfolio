import { NextRequest, NextResponse } from "next/server";
import { InvoiceData } from "@/lib/invoice-utils";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { invoiceData, customerEmail, customerName } = await request.json();

    if (!invoiceData || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.",
        },
        { status: 500 }
      );
    }

    // First generate the PDF
    const pdfResponse = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/invoice/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      }
    );

    if (!pdfResponse.ok) {
      throw new Error(
        `Failed to generate PDF: ${pdfResponse.status} ${pdfResponse.statusText}`
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Prepare email content with PDF attachment
    const emailContent = `
Hallo ${customerName},

vielen Dank für Ihr Vertrauen in meine Dienstleistungen!

Im Anhang finden Sie die offizielle Rechnung für Ihr Projekt "${
      invoiceData.project?.title || "Web Development Project"
    }".

� Rechnungsdetails:
• Rechnungsnummer: ${invoiceData.invoiceNumber}
• Rechnungsdatum: ${new Date(invoiceData.issueDate).toLocaleDateString("de-DE")}
• Fälligkeitsdatum: ${new Date(invoiceData.dueDate).toLocaleDateString("de-DE")}
• Gesamtbetrag: €${(invoiceData.pricing?.total || 0).toFixed(2)}

💳 Zahlungsdetails:
Die Rechnung ist innerhalb von 30 Tagen nach Rechnungsdatum fällig.

Überweisungsdetails:
• IBAN: DE89 3704 0044 0532 0130 00
• BIC: COBADEFFXXX
• Empfänger: Ali Ramazan Yıldırım
• Verwendungszweck: Rechnungsnummer ${invoiceData.invoiceNumber}

Bei Fragen zur Rechnung stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ali Ramazan Yıldırım
Full Stack Developer

---
Diese E-Mail wurde automatisch generiert.
Bei Fragen wenden Sie sich bitte an: aliramazanyildirim@gmail.com
    `.trim();

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify email configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      throw new Error(`Email configuration invalid: ${verifyError}`);
    }

    // Send email with PDF attachment
    const mailOptions = {
      from: `"Ali Ramazan Yıldırım" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Ihre Rechnung ${invoiceData.invoiceNumber} - Ali Ramazan Yıldırım`,
      text: emailContent,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rechnung ${invoiceData.invoiceNumber}</title>
        </head>
        <body style="margin: 0; padding: 40px 20px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <!-- Main Container -->
          <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid rgba(148, 163, 184, 0.2);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg></div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; position: relative; z-index: 1;">Ihre Rechnung ist da!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px; position: relative; z-index: 1;">Ali Ramazan Yıldırım - Full Stack Developer</p>
            </div>
            
            <!-- Content Wrapper -->
            <div style="padding: 40px 30px;">
              
              <!-- Greeting Section -->
              <div style="margin-bottom: 35px; text-align: center;">
                <p style="color: #1e293b; font-size: 18px; line-height: 1.6; margin-bottom: 15px;">
                  Hallo <span style="color: #3b82f6; font-weight: 600;">${customerName}</span> 👋
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                  vielen Dank für Ihr Vertrauen in meine Dienstleistungen!
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                  Im Anhang finden Sie die offizielle Rechnung für Ihr Projekt <br>
                  <strong style="color: #1e293b;">"${
                    invoiceData.project?.title || "Web Development Project"
                  }"</strong>
                </p>
              </div>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 35px 0;"></div>

              <!-- Invoice Details Section -->
              <div style="margin-bottom: 35px;">
                <div style="display: flex; align-items: center; margin-bottom: 20px; justify-content: center;">
                  <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0;">Rechnungsdetails</h3>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">Rechnungsnummer</p>
                      <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${
                        invoiceData.invoiceNumber
                      }</p>
                    </div>
                    <div>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">Rechnungsdatum</p>
                      <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${new Date(
                        invoiceData.issueDate
                      ).toLocaleDateString("de-DE")}</p>
                    </div>
                    <div>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">Fälligkeitsdatum</p>
                      <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${new Date(
                        invoiceData.dueDate
                      ).toLocaleDateString("de-DE")}</p>
                    </div>
                    <div>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 5px 0; font-weight: 500;">Gesamtbetrag</p>
                      <p style="color: #059669; font-size: 24px; font-weight: 700; margin: 0;">€${(
                        invoiceData.pricing?.total || 0
                      ).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 35px 0;"></div>

              <!-- Payment Details Section -->
              <div style="margin-bottom: 35px;">
                <div style="display: flex; align-items: center; margin-bottom: 20px; justify-content: center;">
                  <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #059669, #047857); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0;">Zahlungsdetails</h3>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 25px; border-radius: 12px; border: 1px solid #bbf7d0;">
                  <p style="color: #166534; margin-bottom: 20px; font-size: 16px; font-weight: 500; text-align: center;">
                    💳 Die Rechnung ist innerhalb von 30 Tagen nach Rechnungsdatum fällig.
                  </p>
                  
                  <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #d1fae5;">
                    <h4 style="color: #14532d; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Überweisungsdetails:</h4>
                    <div style="color: #166534; line-height: 1.8; font-size: 15px;">
                      <div style="margin-bottom: 8px;"><strong>IBAN:</strong> DE89 3704 0044 0532 0130 00</div>
                      <div style="margin-bottom: 8px;"><strong>BIC:</strong> COBADEFFXXX</div>
                      <div style="margin-bottom: 8px;"><strong>Empfänger:</strong> Ali Ramazan Yıldırım</div>
                      <div><strong>Verwendungszweck:</strong> Rechnungsnummer ${
                        invoiceData.invoiceNumber
                      }</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 35px 0;"></div>

              <!-- Footer Section -->
              <div style="text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <p style="color: #475569; margin-bottom: 20px; font-size: 16px;">
                  Bei Fragen zur Rechnung stehe ich Ihnen gerne zur Verfügung. 
                </p>
                <div style="margin-bottom: 25px;">
                  <p style="color: #1e293b; font-weight: 600; font-size: 18px; margin: 0 0 5px 0;">
                    Mit freundlichen Grüßen
                  </p>
                  <p style="color: #1e293b; font-weight: 700; font-size: 20px; margin: 0 0 5px 0;">
                    Ali Ramazan Yıldırım
                  </p>
                  <p style="color: #3b82f6; font-weight: 600; font-size: 16px; margin: 0;">
                    Full Stack Developer
                  </p>
                </div>
                
                <div style="border-top: 1px solid #d1d5db; padding-top: 20px;">
                  <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">
                    Diese E-Mail wurde automatisch generiert. 🤖<br>
                    Bei Fragen wenden Sie sich bitte an: 
                    <a href="mailto:aliramazanyildirim@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 500;">aliramazanyildirim@gmail.com</a>
                  </p>
                </div>
              </div>
              
            </div>
          </div>
          
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        message: "Invoice email sent successfully with PDF attachment",
        customerEmail,
        invoiceNumber: invoiceData.invoiceNumber,
        pdfSize: Buffer.from(pdfBuffer).length,
        messageId: result.messageId,
      },
    });
  } catch (error) {
    // Provide more detailed error information
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to prepare invoice email",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
