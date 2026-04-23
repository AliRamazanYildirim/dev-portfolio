import { describe, it, expect } from "vitest";
import {
    detectImageMimeFromBytes,
    verifyImageSignature,
} from "@/app/api/upload/lib/magicBytes";

function makeFile(bytes: number[], type: string, name = "test"): File {
    const buffer = new Uint8Array(bytes);
    return new File([buffer], name, { type });
}

const JPEG = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00];
const GIF89 = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00];
const WEBP = [
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
];
const FAKE = [0x00, 0x01, 0x02, 0x03, 0x04];

describe("detectImageMimeFromBytes", () => {
    it("detects jpeg, png, gif and webp", async () => {
        expect(await detectImageMimeFromBytes(makeFile(JPEG, "image/jpeg"))).toBe("image/jpeg");
        expect(await detectImageMimeFromBytes(makeFile(PNG, "image/png"))).toBe("image/png");
        expect(await detectImageMimeFromBytes(makeFile(GIF89, "image/gif"))).toBe("image/gif");
        expect(await detectImageMimeFromBytes(makeFile(WEBP, "image/webp"))).toBe("image/webp");
    });

    it("returns null for unknown signatures", async () => {
        expect(await detectImageMimeFromBytes(makeFile(FAKE, "image/png"))).toBeNull();
    });
});

describe("verifyImageSignature", () => {
    it("rejects when declared MIME and magic bytes disagree", async () => {
        const result = await verifyImageSignature(makeFile(PNG, "image/jpeg"));
        expect(result.valid).toBe(false);
    });

    it("accepts when declared MIME matches magic bytes", async () => {
        const result = await verifyImageSignature(makeFile(PNG, "image/png"));
        expect(result).toEqual({ valid: true, mime: "image/png" });
    });

    it("rejects polyglot / unknown payloads", async () => {
        const result = await verifyImageSignature(makeFile(FAKE, "image/png"));
        expect(result.valid).toBe(false);
    });
});
