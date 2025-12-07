import type { ProjectStatusPayload } from "./types";

function escapeHtml(value?: string) {
    if (!value) {
        return "";
    }
    return value.replace(/[&<>\"]/g, (char) => {
        const replacements: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
        };
        return replacements[char];
    });
}

export function statusLabel(status: ProjectStatusPayload["status"]) {
    if (status === "gestart") {
        return "Gestart";
    }
    if (status === "in-vorbereitung") {
        return "In Vorbereitung";
    }
    return "Abgeschlossen";
}

interface BuildTemplateOptions {
    baseUrl?: string;
    logoCid?: string;
}

export function buildStatusEmail(
    payload: ProjectStatusPayload,
    options: BuildTemplateOptions = {}
) {
    const { baseUrl, logoCid } = options;
    const title = escapeHtml(payload.projectTitle || "Ihr Projekt");
    const client = escapeHtml(payload.clientName);
    const displayStatusLabel = statusLabel(payload.status);
    const fallbackMessage = `Der Status Ihres Projekts wurde aktualisiert: ${displayStatusLabel}`;
    const message = escapeHtml(payload.message || fallbackMessage);
    const preheader = escapeHtml(payload.message || fallbackMessage);
    const steps = [
        { key: "gestart", label: "Gestart" },
        { key: "in-vorbereitung", label: "In Vorbereitung" },
        { key: "abgeschlossen", label: "Abgeschlossen" },
    ];
    const currentIndex = steps.findIndex((step) => step.key === payload.status);

    const logo = logoCid
        ? `cid:${logoCid}`
        : baseUrl
            ? `${baseUrl.replace(/\/$/, "")}/ali-ramazan-yildirim-white.png`
            : process.env.NEXT_PUBLIC_SITE_URL
                ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/ali-ramazan-yildirim-white.png`
                : `/ali-ramazan-yildirim-white.png`;

    const stepsHtml = steps
        .map((step, index) => {
            const isActive = index === currentIndex;
            const isDone = index < currentIndex;
            const showDash = !isActive && !isDone && currentIndex >= 0;

            const activeColorMap: Record<string, string> = {
                gestart: "#3b82f6",
                "in-vorbereitung": "#f59e0b",
                abgeschlossen: "#10b981",
            };
            const activeBg = activeColorMap[step.key] || "#3b82f6";
            const size = 72;
            const baseCircleStyle =
                `width:${size}px;height:${size}px;border-radius:999px;display:inline-block;line-height:${size}px;text-align:center;vertical-align:middle;font-weight:800`;

            let circleStyle = baseCircleStyle;
            if (isActive) {
                circleStyle += `;background:${activeBg};color:#ffffff;border:none;`;
            } else if (isDone) {
                circleStyle += ";background:#ffffff;color:#0f172a;border:2px solid #e6eefc;";
            } else {
                circleStyle += ";background:#ffffff;color:#64748b;border:2px solid #e6eefc;";
            }

            const innerContent = isDone
                ? "✓"
                : isActive
                    ? step.key === "abgeschlossen"
                        ? "100%"
                        : step.key === "in-vorbereitung"
                            ? "66%"
                            : "33%"
                    : showDash
                        ? "-"
                        : "";

            const labelColor = isActive || isDone ? "#0f172a" : "#64748b";
            const fontSize = isActive ? "18px" : isDone ? "16px" : "14px";

            return `
        <td align="center" style="padding:12px;width:33.333%;vertical-align:top">
          <div style="display:inline-block;text-align:center;">
            <div style="${circleStyle}"><span style="display:inline-block;vertical-align:middle;line-height:normal;font-size:${fontSize};font-weight:800;color:${isActive ? "#ffffff" : labelColor
                }">${escapeHtml(innerContent)}</span></div>
            <div style="font-size:13px;color:${labelColor};margin-top:8px">${escapeHtml(
                    step.label
                )}</div>
          </div>
        </td>`;
        })
        .join("\n");

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Projekt Update</title>
  <style>
    .step-circle{width:56px;height:56px;border-radius:999px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px auto;font-weight:800;line-height:1;text-align:center}
    @media (max-width:520px){.container{padding:14px}.title{font-size:18px}.step-circle{width:44px;height:44px}}
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
            <table role="presentation" align="center" style="border-collapse:collapse;margin:0 auto;text-align:center">
              <tr>
                <td style="padding-right:16px;vertical-align:middle;text-align:center">
                  ${logo
            ? `<img src="${logo}" alt="logo" width="96" height="96" style="display:block;margin:0 auto;border-radius:10px;object-fit:contain;"/>`
            : ""
        }
                </td>
                <td style="vertical-align:middle;text-align:center">
                  <div style="font-size:26px;font-weight:700;margin:0;line-height:1">${title}</div>
                  <div style="font-size:15px;opacity:0.9;margin-top:8px">Projekt‑Update • ${escapeHtml(
            displayStatusLabel
        )}</div>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
      ${payload.projectImage ? `<tr><td style="padding:0"><img src="${payload.projectImage}" alt="project image" width="100%" style="display:block;object-fit:cover;max-height:300px;width:100%;"/></td></tr>` : ""}
      <tr>
        <td style="padding:22px" class="container">
          <p style="margin:0 0 10px 0;color:#0f172a;font-size:15px;font-weight:700">Hallo ${client},</p>
          <p style="margin:0 0 18px 0;color:#334155;font-size:14px;line-height:1.6">${message}</p>

          <table role="presentation" width="100%" style="border-collapse:collapse;margin:10px 0 18px 0;background:transparent;border-radius:8px;">
            <tr style="vertical-align:top">${stepsHtml}</tr>
          </table>

          ${payload.ctaUrl ? `<p style="margin:0 0 18px 0"><a href="${payload.ctaUrl}" style="display:inline-block;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Zum Projekt</a></p>` : ""}

          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6">Bei Fragen antworte einfach auf diese E‑Mail oder kontaktiere uns über die <a href="https://dev-portfolio-eight-khaki.vercel.app/#contact" target="_blank" rel="noopener noreferrer" style="color:#6366f1;text-decoration:none;font-weight:700">Website</a>.</p>
        </td>
      </tr>
      <tr><td style="background:#fafafa;padding:14px 18px;color:#64748b;font-size:12px;text-align:center">Diese E‑Mail wurde automatisch gesendet. Bei Rückfragen einfach antworten.</td></tr>
    </table>
  </div>
</body>
</html>`;

    const text = `${title}\n\n${payload.message || fallbackMessage}\n\n${payload.ctaUrl ? `Zum Projekt: ${payload.ctaUrl}\n\n` : ""
        }Bei Fragen antworte bitte auf diese E‑Mail.`;

    return { html, text };
}
