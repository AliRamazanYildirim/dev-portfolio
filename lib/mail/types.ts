/**
 * Mail Port – Abstraction Layer (DIP)
 *
 * Domänendienste sind von diesem Interface abhängig,  
 * nicht von konkreten SMTP-/Transportdetails.
 */

export interface MailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
}

export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: MailAttachment[];
}

export interface SendMailResult {
    messageId: string;
    previewUrl?: string | false | null;
}

/**
 * Mail Port-Schnittstelle – Abstraktion, die für den gesamten Mailversand verwendet wird.  
 * Verschiedene Adapter (SMTP, SES, Test/Mock) implementieren diese Schnittstelle.  
 */
export interface IMailPort {
    send(options: SendMailOptions): Promise<SendMailResult>;
}
