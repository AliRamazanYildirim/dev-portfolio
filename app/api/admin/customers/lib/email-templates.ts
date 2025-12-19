interface ReferrerEmailPayload {
  refFirst: string;
  refLast: string;
  myReferralCode: string;
  newCount: number;
  discountRate: number;
  referrerPrice?: number;
  referrerFinalPrice?: number;
  currentDiscountAmount?: number;
  discountsEnabled?: boolean;
}

interface BonusEmailPayload {
  refFirst: string;
  refLast: string;
  myReferralCode: string;
  referralCount: number;
  previousFinalPrice: number;
  newFinalPrice: number;
  bonusAmount: number;
}

interface WelcomeEmailPayload {
  firstName: string;
  lastName: string;
  language?: string;
}

export function buildReferrerEmailHTML(payload: ReferrerEmailPayload) {
  const {
    refFirst,
    refLast,
    myReferralCode,
    newCount,
    discountRate,
    referrerPrice,
    referrerFinalPrice,
    currentDiscountAmount,
    discountsEnabled = true,
  } = payload;

  const hasReachedMaximum = newCount >= 3;
  const currentDiscount = currentDiscountAmount || 0;
  const totalSavings =
    referrerPrice && referrerFinalPrice
      ? (referrerPrice - referrerFinalPrice).toFixed(2)
      : "0.00";

  const transparentBlock = (() => {
    if (!discountsEnabled) {
      return `<li>Rabatte sind derzeit inaktiv. Ihr Empfehlungscode bleibt gespeichert; wir informieren Sie, sobald Rabatte wieder aktiv sind.</li>`;
    }
    if (!referrerPrice) {
      return "";
    }
    if (newCount === 1) {
      return `
        <li>Ursprünglicher Preis: €${referrerPrice.toFixed(2)}</li>
        <li>1. Empfehlung → 3% Rabatt</li>
        <li>Berechnung: €${referrerPrice.toFixed(2)} - (€${referrerPrice.toFixed(
        2
      )} × 3%) = €${currentDiscount.toFixed(2)} Ersparnis</li>`;
    }
    if (newCount === 2) {
      const after1 = (referrerPrice * 0.97).toFixed(2);
      return `
        <li>Ursprünglicher Preis: €${referrerPrice.toFixed(2)}</li>
        <li>Nach 1. Empfehlung: €${after1}</li>
        <li>2. Empfehlung → 6% Rabatt auf aktuellen Preis</li>
        <li>Berechnung: €${after1} × 6% = €${currentDiscount.toFixed(
        2
      )} zusätzliche Ersparnis</li>`;
    }
    if (newCount === 3) {
      const after1 = (referrerPrice * 0.97).toFixed(2);
      const after2 = (referrerPrice * 0.97 * 0.94).toFixed(2);
      return `
        <li>Ursprünglicher Preis: €${referrerPrice.toFixed(2)}</li>
        <li>Nach 1. Empfehlung: €${after1}</li>
        <li>Nach 2. Empfehlung: €${after2}</li>
        <li>3. Empfehlung → 9% Rabatt auf aktuellen Preis</li>
        <li>Berechnung: €${after2} × 9% = €${currentDiscount.toFixed(
        2
      )} zusätzliche Ersparnis</li>`;
    }
    return "";
  })();

  const remaining = !discountsEnabled
    ? `ℹ️ Rabatte sind momentan deaktiviert. Wir informieren Sie, sobald sie wieder aktiv sind.`
    : hasReachedMaximum
      ? `🏆 <strong style="color:#065f46;">MAXIMUM ERREICHT!</strong><br>Sie haben das Maximum erreicht und sichern sich dauerhaft <strong>9% Rabatt</strong> auf alle zukünftigen Projekte.`
      : `✨ Noch <strong>${3 - newCount}</strong> ${3 - newCount === 1 ? "Empfehlung" : "Empfehlungen"} bis zum Maximum von 9%.`;

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Referral Update</title></head>
  <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:38px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Neue Empfehlung verbucht</h1>
        <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:14px;font-weight:500;">Ihr Code wurde erneut genutzt</p>
      </div>
      <div style="padding:38px 30px;">
        <p style="color:#1e293b;font-size:16px;line-height:1.6;margin:0 0 18px 0;">Hallo <span style="color:#6366f1;font-weight:600;">${refFirst} ${refLast}</span> 🎉</p>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px 0;">Großartig! Jemand hat Ihren Empfehlungscode <strong>${myReferralCode}</strong> genutzt. Dadurch haben Sie einen weiteren Rabatt erhalten.</p>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#1e293b;font-weight:700;">📊 Aktueller Status</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#334155;line-height:1.6;font-size:14px;">
            <li>Empfehlungen gesamt: <strong>${newCount}</strong></li>
            <li>Aktueller Projektpreis: €${referrerFinalPrice?.toFixed(2) || referrerPrice?.toFixed(2) || "0.00"}</li>
            <li>Aktueller Rabatt-Satz: ${discountRate}%</li>
            <li>Aktuelle Ersparnis (diese Stufe): €${currentDiscount.toFixed(2)}</li>
            <li>Gesamtersparnis: €${totalSavings}</li>
          </ul>
        </div>
        <div style="background:linear-gradient(135deg,#ecfdf5,#f0fdf5 100%);border:1px solid #bbf7d0;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#065f46;font-weight:700;">🔍 Transparente Berechnung</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#065f46;line-height:1.6;font-size:13px;">${transparentBlock}</ul>
          <p style="margin:14px 0 0 0;color:#065f46;font-size:13px;line-height:1.5;">Jeder Rabatt bezieht sich immer auf den jeweils zuletzt reduzierten Preis – fair und nachvollziehbar.</p>
        </div>
        <div style="background:linear-gradient(135deg,#fff7ed,#fffbeb);border:1px solid #fed7aa;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#9a3412;font-weight:700;">💰 Rabattstaffel</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#9a3412;line-height:1.6;font-size:13px;">
            <li>1. Empfehlung → 3%</li>
            <li>2. Empfehlung → 6%</li>
            <li>3. Empfehlung → 9% (Maximum)</li>
          </ul>
          <p style="margin:14px 0 0 0;color:#9a3412;font-size:13px;line-height:1.5;">${remaining}</p>
        </div>
        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);border:1px solid #c7d2fe;border-radius:14px;padding:22px 22px;margin:0 0 30px 0;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.5px;font-weight:600;color:#4f46e5;text-transform:uppercase;">Ihr Empfehlungscode</p>
          <div style="font-size:26px;font-weight:700;letter-spacing:3px;color:#312e81;font-family:monospace;">${myReferralCode}</div>
          <p style="margin:10px 0 0 0;font-size:11px;color:#6366f1;">Weiter teilen & Vorteile sichern</p>
        </div>
        <div style="text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 10px 0;color:#1e293b;font-weight:600;">IBAN für Auszahlung</p>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Senden Sie Ihre IBAN an <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a> – Auszahlung innerhalb von 7 Werktagen.</p>
        </div>
        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:18px 18px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 6px 0;color:#334155;font-size:13px;">📧 Kontakt: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0;color:#334155;font-size:13px;">🌐 Portfolio: <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-eight-khaki.vercel.app">Website besuchen</a></p>
        </div>
        <div style="text-align:center;margin-bottom:8px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">Herzliche Grüße</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:16px;">Ali Ramazan Yildirim</p>
          <p style="color:#6366f1;font-weight:600;margin:0;font-size:13px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:12px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
  </body></html>`;

  const subject = `🎉 Danke für Ihre Empfehlung! ${discountRate}% Rabatt erhalten - ${myReferralCode}`;
  return { html, subject };
}

export function buildBonusEmailHTML(payload: BonusEmailPayload) {
  const {
    refFirst,
    refLast,
    myReferralCode,
    referralCount,
    previousFinalPrice,
    newFinalPrice,
    bonusAmount,
  } = payload;

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Bonus Rabatt</title></head>
  <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:38px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">🌟 Bonus-Rabatt erhalten!</h1>
        <p style="color:rgba(255,255,255,0.9);margin:10px 0 0;font-size:14px;font-weight:500;">Ihr Code wurde erneut genutzt</p>
      </div>
      <div style="padding:38px 30px;">
        <p style="color:#1e293b;font-size:16px;line-height:1.6;margin:0 0 18px 0;">Hallo <span style="color:#059669;font-weight:600;">${refFirst} ${refLast}</span> 🎉</p>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px 0;">Fantastisch! Sie haben bereits das <strong>Maximum von 9%</strong> erreicht – aber Ihre Empfehlungen bringen Ihnen weiterhin Vorteile! Für diese neue Empfehlung erhalten Sie einen <strong>zusätzlichen 3% Bonus-Rabatt</strong> auf Ihren aktuellen Preis.</p>
        
        <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #6ee7b7;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#065f46;font-weight:700;">🎁 Bonus-Rabatt Details</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#065f46;line-height:1.8;font-size:14px;">
            <li>Empfehlungen gesamt: <strong>${referralCount}</strong></li>
            <li>Bisheriger Preis: <strong>€${previousFinalPrice.toFixed(2)}</strong></li>
            <li>Bonus-Rabatt: <strong>+3%</strong> = €${bonusAmount.toFixed(2)} Ersparnis</li>
            <li style="color:#047857;font-weight:700;font-size:15px;margin-top:8px;">→ Neuer Preis: €${newFinalPrice.toFixed(2)}</li>
          </ul>
        </div>

        <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #fcd34d;border-radius:14px;padding:22px 22px;margin:0 0 26px 0;">
          <h2 style="margin:0 0 14px 0;font-size:17px;color:#92400e;font-weight:700;">💡 So funktioniert der Bonus</h2>
          <ul style="margin:0;padding:0 0 0 18px;color:#92400e;line-height:1.6;font-size:13px;">
            <li>Sie haben das Maximum von 9% bereits erreicht</li>
            <li>Für jede weitere Empfehlung erhalten Sie <strong>+3% Bonus</strong></li>
            <li>Der Bonus wird auf Ihren aktuellen Preis berechnet</li>
            <li>Es gibt keine Obergrenze für Bonus-Rabatte!</li>
          </ul>
        </div>

        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);border:1px solid #c7d2fe;border-radius:14px;padding:22px 22px;margin:0 0 30px 0;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:0.5px;font-weight:600;color:#4f46e5;text-transform:uppercase;">Ihr Empfehlungscode</p>
          <div style="font-size:26px;font-weight:700;letter-spacing:3px;color:#312e81;font-family:monospace;">${myReferralCode}</div>
          <p style="margin:10px 0 0 0;font-size:11px;color:#6366f1;">Weiter teilen & unbegrenzt profitieren!</p>
        </div>

        <div style="text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 10px 0;color:#1e293b;font-weight:600;">IBAN für Auszahlung</p>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">Senden Sie Ihre IBAN an <a style="color:#059669;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a> – Auszahlung innerhalb von 7 Werktagen.</p>
        </div>

        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:18px 18px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 6px 0;color:#334155;font-size:13px;">📧 Kontakt: <a style="color:#059669;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0;color:#334155;font-size:13px;">🌐 Portfolio: <a style="color:#059669;text-decoration:none;font-weight:600;" href="https://dev-portfolio-eight-khaki.vercel.app">Website besuchen</a></p>
        </div>

        <div style="text-align:center;margin-bottom:8px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">Herzliche Grüße</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:16px;">Ali Ramazan Yildirim</p>
          <p style="color:#059669;font-weight:600;margin:0;font-size:13px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:12px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
  </body></html>`;

  const subject = `🌟 Bonus-Rabatt! +3% auf Ihren aktuellen Preis - ${myReferralCode}`;
  return { html, subject };
}

export function buildWelcomeEmailHTML({
  firstName,
  lastName,
  language = "de",
}: WelcomeEmailPayload) {
  const content = {
    de: {
      subject: `🎉 Willkommen bei Ali Ramazan Yildirim – Ihr Dienstleistungsvertrag`,
      greeting: `Hallo ${firstName}`,
      intro: `Herzlich willkommen! Ich freuen mich sehr, Sie als neuen Kunden begrüßen zu dürfen.`,
      contract: `Im Anhang dieser E-Mail finden Sie unseren Dienstleistungsvertrag in drei Sprachen (DE/EN/TR). Bitte lesen Sie diesen sorgfältig durch und bewahren Sie ihn für Ihre Unterlagen auf.`,
      nextSteps: `Nächste Schritte:`,
      nextStepsList: `
        <li>Vertrag durchlesen und bei Fragen melden</li>
        <li>Projektdetails werden in Kürze besprochen</li>
        <li>Bei Bedarf erhalten Sie weitere Informationen per E-Mail</li>
      `,
      contactTitle: `Bei Fragen erreichen Sie mich unter:`,
      signature: `Herzliche Grüße`,
      footer: `Ich freue mich auf die Zusammenarbeit mit Ihnen!`,
    },
    en: {
      subject: `🎉 Welcome to Ali Ramazan Yildirim – Your Service Agreement`,
      greeting: `Hello ${firstName}`,
      intro: `Welcome! We are delighted to have you as our new customer.`,
      contract: `Attached to this email you will find our service agreement in three languages (DE/EN/TR). Please review it carefully and keep it for your records.`,
      nextSteps: `Next Steps:`,
      nextStepsList: `
        <li>Review the contract and contact us if you have questions</li>
        <li>Project details will be discussed shortly</li>
        <li>You will receive further information via email if needed</li>
      `,
      contactTitle: `If you have any questions, please contact me at:`,
      signature: `Best regards`,
      footer: `I look forward to working with you!`,
    },
    tr: {
      subject: `🎉 Ali Ramazan Yildirim'e Hoş Geldiniz – Hizmet Sözleşmeniz`,
      greeting: `Merhaba ${firstName}`,
      intro: `Hoş geldiniz! Sizi yeni müşterimiz olarak görmekten mutluluk duyuyoruz.`,
      contract: `Bu e-postanın ekinde üç dilde (DE/EN/TR) hizmet sözleşmemizi bulacaksınız. Lütfen dikkatlice okuyunuz ve kayıtlarınız için saklayınız.`,
      nextSteps: `Sonraki Adımlar:`,
      nextStepsList: `
        <li>Sözleşmeyi okuyun ve sorularınız varsa bize ulaşın</li>
        <li>Proje detayları kısa süre içinde görüşülecektir</li>
        <li>Gerekirse e-posta ile daha fazla bilgi alacaksınız</li>
      `,
      contactTitle: `Sorularınız için bana ulaşabilirsiniz:`,
      signature: `Saygılarımla`,
      footer: `Sizinle çalışmayı dört gözle bekliyorum!`,
    },
  };

  const lang = content[language as keyof typeof content] || content.de;

  const html = `<!DOCTYPE html><html lang="${language}"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${lang.subject}</title></head>
  <body style="margin: 0; padding: 40px 20px; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
      <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">📄 Dienstleistungsvertrag</h1>
        <p style="color:rgba(255,255,255,0.9);margin:12px 0 0;font-size:15px;font-weight:500;">Ali Ramazan Yildirim – Fullstack Developer</p>
      </div>
      <div style="padding:40px 30px;">
        <p style="color:#1e293b;font-size:17px;line-height:1.6;margin:0 0 14px 0;">${lang.greeting} 👋</p>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 10px 0;">${lang.intro}</p>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px 0;">${lang.contract}</p>
        
        <div style="background:linear-gradient(135deg,#eef2ff,#ede9fe);border:1px solid #c7d2fe;border-radius:14px;padding:26px 24px;margin-bottom:32px;">
          <h2 style="margin:0 0 14px 0;font-size:18px;color:#4f46e5;font-weight:700;">📌 ${lang.nextSteps}</h2>
          <ul style="margin:0 0 0 18px;padding:0;color:#312e81;line-height:1.8;font-size:14px;">${lang.nextStepsList}</ul>
        </div>

        <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:14px;padding:24px 22px;text-align:center;margin-bottom:30px;">
          <p style="margin:0 0 12px 0;color:#334155;font-size:14px;font-weight:600;">${lang.contactTitle}</p>
          <p style="margin:0 0 6px 0;color:#334155;font-size:14px;">📧 <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="mailto:aliramazanyildirim@gmail.com">aliramazanyildirim@gmail.com</a></p>
          <p style="margin:0 0 6px 0;color:#334155;font-size:14px;">📞 +49 151 67145187</p>
          <p style="margin:0 0 16px 0;color:#334155;font-size:14px;">🌐 <a style="color:#6366f1;text-decoration:none;font-weight:600;" href="https://dev-portfolio-eight-khaki.vercel.app/">Website besuchen</a></p>
          <p style="margin:0;color:#6366f1;font-size:13px;font-weight:600;">${lang.footer}</p>
        </div>

        <div style="text-align:center;margin-bottom:10px;">
          <p style="color:#1e293b;font-weight:600;margin:0 0 4px 0;">${lang.signature}</p>
          <p style="color:#1e293b;font-weight:700;margin:0 0 4px 0;font-size:17px;">Ali Ramazan Yildirim</p>
          <p style="color:#6366f1;font-weight:600;margin:0;font-size:14px;">Fullstack Web Developer & UI/UX Designer</p>
        </div>
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;text-align:center;">
          <p style="color:#64748b;font-size:11px;line-height:1.5;margin:0;">Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie bitte direkt auf diese Nachricht.</p>
        </div>
      </div>
    </div>
  </body></html>`;

  return { html, subject: lang.subject };
}
