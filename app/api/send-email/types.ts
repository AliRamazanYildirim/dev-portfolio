export interface SendEmailPayload {
    name: string;
    email: string;
    message: string;
}

export interface SmtpConfig {
    host: string;
    port: number;
    user?: string;
    pass?: string;
    from?: string;
    to?: string;
}
