import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

type Payload = {
    clientName: string;
    clientEmail: string;
    projectTitle?: string;
    status: "gestart" | "in-vorbereitung" | "abgeschlossen";
    message?: string;
    projectImage?: string;
    ctaUrl?: string;
};

function escapeHtml(str?: string) {
    if (!str) return "";
    return str.replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function statusLabel(s: Payload['status']) {
    if (s === 'gestart') return 'Gestart';
    if (s === 'in-vorbereitung') return 'In Vorbereitung';
    return 'Abgeschlossen';
}

function buildHtml(p: Payload, baseUrl?: string, logoCid?: string) {
    const title = escapeHtml(p.projectTitle || 'Ihr Projekt');
    const client = escapeHtml(p.clientName);
    const msg = escapeHtml(p.message || `Der Status Ihres Projekts wurde aktualisiert: ${statusLabel(p.status)}`);
    const status = statusLabel(p.status);
    // Prefer an absolute URL built from the request's baseUrl (better for email clients).
    // Fallback to NEXT_PUBLIC_SITE_URL or a relative path if necessary.
    // If a logo CID is provided, reference it as an inline cid (works in most email clients).
    const logo = logoCid
        ? `cid:${logoCid}`
        : baseUrl
            ? `${baseUrl.replace(/\/$/, '')}/ali-ramazan-yildirim-white.png`
            : process.env.NEXT_PUBLIC_SITE_URL
                ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/ali-ramazan-yildirim-white.png`
                : `/ali-ramazan-yildirim-white.png`;

    // Preheader for inbox preview
    const preheader = escapeHtml(p.message || `Der Status Ihres Projekts wurde aktualisiert: ${status}`);

    // Build a three-step progress row
    const steps = [
        { key: 'gestart', label: 'Gestart' },
        { key: 'in-vorbereitung', label: 'In Vorbereitung' },
        { key: 'abgeschlossen', label: 'Abgeschlossen' },
    ];

    const currentIndex = steps.findIndex((s) => s.key === p.status);

    const stepsHtml = steps
        .map((s, i) => {
            const isActive = i === currentIndex;
            const isDone = i < currentIndex;
            const showDash = !isActive && !isDone && currentIndex >= 0;

            const activeColorMap: Record<string, string> = {
                'gestart': '#3b82f6', // blue
                'in-vorbereitung': '#f59e0b', // orange
                'abgeschlossen': '#10b981', // green
            };
            const activeBg = activeColorMap[s.key] || '#3b82f6';

            // circle size inspired by CustomerDetails (w-20 => 80px)
            const size = 72;

            let circleStyle = `width:${size}px;height:${size}px;border-radius:999px;display:inline-block;line-height:${size}px;text-align:center;vertical-align:middle;font-weight:800`;

            if (isActive) {
                circleStyle += `;background:${activeBg};color:#ffffff;border:none;`;
            } else if (isDone) {
                circleStyle += `;background:#ffffff;color:#0f172a;border:2px solid #e6eefc;`;
            } else {
                circleStyle += `;background:#ffffff;color:#64748b;border:2px solid #e6eefc;`;
            }

            const innerContent = isDone ? '✓' : isActive ? (s.key === 'abgeschlossen' ? '100%' : s.key === 'in-vorbereitung' ? '66%' : '33%') : showDash ? '-' : '';

            // label color
            const labelColor = isActive ? '#0f172a' : isDone ? '#0f172a' : '#64748b';

            return `
              <td align="center" style="padding:12px;width:33.333%;vertical-align:top">
                <div style="display:inline-block;text-align:center;">
                  <div style="${circleStyle}"><span style="display:inline-block;vertical-align:middle;line-height:normal;font-size:${isActive ? '18px' : isDone ? '16px' : '14px'};font-weight:800;color:${isActive ? '#ffffff' : labelColor}">${escapeHtml(innerContent)}</span></div>
                  <div style="font-size:13px;color:${labelColor};margin-top:8px">${escapeHtml(s.label)}</div>
                </div>
              </td>`;
        })
        .join('\n');

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Projekt Update</title>
    <style>
    /* responsive small tweaks */
    .step-circle{width:56px;height:56px;border-radius:999px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px auto;font-weight:800;line-height:1;text-align:center}
    @media (max-width:520px){.container{padding:14px}.title{font-size:18px}.step-circle{width:44px;height:44px}}
    /* ensure label readability */
    .step-label{font-size:13px;color:#475569;margin-top:4px}
    @media (max-width:520px){.step-label{font-size:12px}}
  </style>
</head>
<body style="margin:0;padding:20px;background:#f3f4f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none!important;visibility:hidden;mso-hide:all;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>
  <div style="max-width:680px;margin:0 auto;">
    <table role="presentation" width="100%" style="border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(15,23,42,0.06);box-shadow:0 8px 30px rgba(2,6,23,0.04);">
      <tr>
        <td style="padding:0;">
          <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;position:relative;color:#fff;">
            <table role="presentation" width="100%" style="border-collapse:collapse"><tr>
              <td style="width:100px;vertical-align:middle;padding-right:12px">${logo ? `<img src="${logo}" alt="logo" width="96" height="96" style="display:block;border-radius:10px;object-fit:contain;"/>` : ''}</td>
              <td style="vertical-align:middle;text-align:left">
                <div style="font-size:26px;font-weight:700;margin:0;line-height:1">${escapeHtml(title)}</div>
                <div style="font-size:15px;opacity:0.9;margin-top:8px">Projekt‑Update • ${escapeHtml(status)}</div>
              </td>
            </tr></table>
          </div>
        </td>
      </tr>
      ${p.projectImage ? `<tr><td style="padding:0"><img src="${p.projectImage}" alt="project image" width="100%" style="display:block;object-fit:cover;max-height:300px;width:100%;"/></td></tr>` : ''}
      <tr>
        <td style="padding:22px" class="container">
          <p style="margin:0 0 10px 0;color:#0f172a;font-size:15px;font-weight:700">Hallo ${client},</p>
          <p style="margin:0 0 18px 0;color:#334155;font-size:14px;line-height:1.6">${msg}</p>

          <table role="presentation" width="100%" style="border-collapse:collapse;margin:10px 0 18px 0;background:transparent;border-radius:8px;">
            <tr style="vertical-align:top">${stepsHtml}</tr>
          </table>

          ${p.ctaUrl ? `<p style="margin:0 0 18px 0"><a href="${p.ctaUrl}" style="display:inline-block;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Zum Projekt</a></p>` : ''}

          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6">Bei Fragen antworte einfach auf diese E‑Mail oder kontaktiere uns über die <a href="https://dev-portfolio-obhj.onrender.com/#contact" target="_blank" rel="noopener noreferrer" style="color:#6366f1;text-decoration:none;font-weight:700">Website</a>.</p>
        </td>
      </tr>
      <tr><td style="background:#fafafa;padding:14px 18px;color:#64748b;font-size:12px;text-align:center">Diese E‑Mail wurde automatisch gesendet. Bei Rückfragen einfach antworten.</td></tr>
    </table>
  </div>
</body>
</html>`;

    const text = `${title}\n\n${p.message || `Der Status Ihres Projekts wurde aktualisiert: ${status}`}\n\n${p.ctaUrl ? `Zum Projekt: ${p.ctaUrl}\n\n` : ''}Bei Fragen antworte bitte auf diese E‑Mail.`;

    return { html, text };
}

export async function POST(req: Request) {
    try {
        const body: Payload = await req.json();

        // Admin auth: check cookie + verify
        const cookieHeader = (req as any).headers?.get?.('cookie') || '';
        const token = (() => {
            try {
                // simple parse
                const m = cookieHeader.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`));
                return m ? m[1] : null;
            } catch (e) {
                return null;
            }
        })();

        if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

        const decoded = verifyToken(token as string);
        if (!decoded) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = Number(process.env.SMTP_PORT || 587);
        const user = process.env.SMTP_USER || process.env.EMAIL_USER;
        const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
        const from = process.env.FROM_EMAIL || user;

        if (!user || !pass) {
            console.error('SMTP credentials missing for project-status-email');
            return NextResponse.json({ success: false, error: 'SMTP not configured' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

        // Build absolute base url from headers when possible (scheme + host)
        const hostHeader = (req as any).headers?.get?.('host');
        const proto = (req as any).headers?.get?.('x-forwarded-proto') || 'https';
        const baseUrl = hostHeader ? `${proto}://${hostHeader}` : undefined;

        // try to attach the local logo as an inline CID so email clients can render it reliably
        let attachments: any[] = [];
        let logoCid: string | undefined;
        try {
            const publicLogoPath = path.join(process.cwd(), 'public', 'ali-ramazan-yildirim-white.png');
            if (fs.existsSync(publicLogoPath)) {
                const logoContent = fs.readFileSync(publicLogoPath);
                logoCid = 'logo_' + Date.now();
                attachments.push({ filename: 'ali-ramazan-yildirim-white.png', content: logoContent, cid: logoCid });
            }
        } catch (e) {
            console.warn('Could not read public logo for inline attachment', e);
        }

        const { html, text } = buildHtml(body, baseUrl, logoCid);
        const subject = `Update zu Ihrem Projekt: ${statusLabel(body.status)}`;

        await transporter.sendMail({ from, to: body.clientEmail, subject, html, text, attachments });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('project-status-email error', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
