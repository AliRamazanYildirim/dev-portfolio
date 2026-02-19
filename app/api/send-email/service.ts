import nodemailer from "nodemailer";
import type { SendEmailPayload, SmtpConfig } from "./types";

function buildSmtpConfig(): SmtpConfig {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const from = process.env.FROM_EMAIL || user;
    const to =
        process.env.CONTACT_RECIPIENT_EMAIL ||
        process.env.EMAIL_USER ||
        process.env.ADMIN_EMAIL ||
        user;

    return { host, port, user, pass, from, to };
}

function buildContactHtml(payload: SendEmailPayload) {
    return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Kontaktnachricht</title></head>
    <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;position:relative;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">Neue Kontaktanfrage</h1>
        <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;font-weight:500;">Kontaktformular Nachricht</p>
      </div>
      <div style="padding:40px 30px;">
        <div style="text-align:left;margin-bottom:24px;color:#1e293b;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 8px 0;"><strong>Von:</strong> ${payload.name} &lt;${payload.email}&gt;</p>
          <p style="margin:0 0 8px 0;"><strong>Betreff:</strong> Kontaktformular</p>
        </div>

        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);padding:20px;border-radius:12px;border:1px solid #c7d2fe;">
          <p style="margin:0;color:#334155;font-size:15px;line-height:1.6;">${payload.message.replace(/\n/g, "<br/>")}</p>
        </div>

        <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:12px;">
          <p style="margin:0">Diese Nachricht wurde über das Kontaktformular gesendet.</p>
          <p style="margin:6px 0 0 0;">Kontakt: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
        </div>
      </div>
    </div>
    </body></html>`;
}

export class SendEmailService {
    static async sendContactEmail(payload: SendEmailPayload) {
        const config = buildSmtpConfig();

        if (!config.user || !config.pass) {
            throw new Error("SMTP credentials not configured on server");
        }

        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465,
            auth: { user: config.user, pass: config.pass },
        });

        const info = await transporter.sendMail({
            from: config.from,
            to: config.to,
            subject: `Contact form: ${payload.name}`,
            text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
            html: buildContactHtml(payload),
        });

        return info;
    }
}
