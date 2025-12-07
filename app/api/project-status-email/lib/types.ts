export type ProjectStatusPayload = {
    clientName: string;
    clientEmail: string;
    projectTitle?: string;
    status: "gestart" | "in-vorbereitung" | "abgeschlossen";
    message?: string;
    projectImage?: string;
    ctaUrl?: string;
};
