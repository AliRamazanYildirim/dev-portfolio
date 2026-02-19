/**
 * Upload Service – Abstrahiert den Bild-Upload (DIP-Fix).
 *
 * Route-Handler ruft nur diesen Service auf,
 * statt cloudinary-SDK direkt zu importieren.
 */

import cloudinary from "@/lib/cloudinary";
import { ValidationError } from "@/lib/errors";

export interface UploadResult {
    url: string;
    publicId: string;
}

export class UploadService {
    /**
     * Lädt eine Datei nach Cloudinary hoch.
     *
     * @param file  Das hochgeladene File-Objekt
     * @param folder  Ziel-Ordner in Cloudinary (Standard: "portfolio")
     * @throws ValidationError wenn keine Datei übergeben wird
     */
    static async uploadImage(file: File | null, folder = "portfolio"): Promise<UploadResult> {
        if (!file) {
            throw new ValidationError("File not found");
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder }, (error, uploadResult) => {
                    if (error) reject(error);
                    else resolve(uploadResult as { secure_url: string; public_id: string });
                })
                .end(buffer);
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
}
