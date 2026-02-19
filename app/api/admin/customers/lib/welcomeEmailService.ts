/**
 * Welcome Email Service – Eigenständiger Service für Willkommens-E-Mails.
 *
 * SRP-Fix: E-Mail-Logik aus CustomersService herausgelöst.
 * Verwendet den zentralen Mail-Port (DIP) anstelle der direkten Nutzung von nodemailer.
 */

import path from "path";
import fs from "fs";
import { getMailPort } from "@/lib/mail";
import { buildWelcomeEmailHTML } from "./email-templates";

interface WelcomeEmailRecipient {
    email?: string;
    firstname?: string;
    lastname?: string;
}

export class WelcomeEmailService {
    /**
     * Willkommens-E-Mail mit Vertrag senden.
     * Fehler blockieren den Kunden-Erstellungsprozess nicht.
     */
    static async send(customer: WelcomeEmailRecipient, language = "de"): Promise<boolean> {
        if (!customer.email) return false;

        try {
            const welcomeEmail = buildWelcomeEmailHTML({
                firstName: customer.firstname || "",
                lastName: customer.lastname || "",
                language,
            });

            const pdfPath = path.join(
                process.cwd(),
                "public",
                "contracts",
                "IT_Service_Agreement_EN-DE-TR.pdf",
            );
            const pdfExists = fs.existsSync(pdfPath);

            if (!pdfExists) {
                console.warn("Contract PDF not found at:", pdfPath);
            }

            const mailPort = getMailPort();
            await mailPort.send({
                to: customer.email,
                subject: welcomeEmail.subject,
                html: welcomeEmail.html,
                attachments: pdfExists
                    ? [
                        {
                            filename: "IT_Service_Agreement_EN-DE-TR.pdf",
                            path: pdfPath,
                            contentType: "application/pdf",
                        },
                    ]
                    : undefined,
            });

            console.log("Welcome email sent to:", customer.email);
            return true;
        } catch (emailErr) {
            console.error("Failed sending welcome email:", emailErr);
            return false;
        }
    }
}
