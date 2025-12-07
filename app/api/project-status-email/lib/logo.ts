import fs from "fs";
import path from "path";
import type { Attachment } from "nodemailer/lib/mailer";

export function buildLogoAttachment() {
    const attachments: Attachment[] = [];
    let logoCid: string | undefined;

    try {
        const logoPath = path.join(
            process.cwd(),
            "public",
            "ali-ramazan-yildirim-white.png"
        );

        if (fs.existsSync(logoPath)) {
            const content = fs.readFileSync(logoPath);
            logoCid = `logo_${Date.now()}`;
            attachments.push({
                filename: "ali-ramazan-yildirim-white.png",
                content,
                cid: logoCid,
            });
        }
    } catch (error) {
        console.warn("Could not read project status logo", error);
    }

    return { attachments, logoCid };
}
