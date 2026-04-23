/**
 * Magic-Byte Validierung für hochgeladene Bilder.
 *
 * Schützt gegen MIME-Spoofing und Polyglot-Payloads, indem der Dateiinhalt
 * tatsächlich inspiziert wird statt dem vom Client gemeldeten MIME-Type zu vertrauen.
 */

const SIGNATURE_BYTES_TO_READ = 16;

interface Signature {
    mime: string;
    bytes: number[];
    offset?: number;
}

const IMAGE_SIGNATURES: readonly Signature[] = [
    { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
    { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
];

function matchesAt(bytes: Uint8Array, sig: Signature): boolean {
    const offset = sig.offset ?? 0;
    for (let i = 0; i < sig.bytes.length; i++) {
        if (bytes[offset + i] !== sig.bytes[i]) return false;
    }
    return true;
}

function isWebP(bytes: Uint8Array): boolean {
    // RIFF....WEBP
    if (bytes.length < 12) return false;
    const riff = [0x52, 0x49, 0x46, 0x46];
    const webp = [0x57, 0x45, 0x42, 0x50];
    for (let i = 0; i < 4; i++) {
        if (bytes[i] !== riff[i]) return false;
        if (bytes[8 + i] !== webp[i]) return false;
    }
    return true;
}

/**
 * Liest die ersten Bytes einer Datei und bestimmt den realen MIME-Typ
 * anhand der Magic-Bytes. Liefert `null` wenn kein bekanntes Bildformat erkannt wurde.
 */
export async function detectImageMimeFromBytes(file: File): Promise<string | null> {
    const slice = file.slice(0, SIGNATURE_BYTES_TO_READ);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    for (const signature of IMAGE_SIGNATURES) {
        if (matchesAt(bytes, signature)) return signature.mime;
    }
    if (isWebP(bytes)) return "image/webp";

    return null;
}

/**
 * Stellt sicher, dass der vom Client deklarierte MIME-Typ mit den tatsächlichen
 * Magic-Bytes übereinstimmt.
 */
export async function verifyImageSignature(
    file: File,
): Promise<{ valid: true; mime: string } | { valid: false; error: string }> {
    const detected = await detectImageMimeFromBytes(file);
    if (!detected) {
        return { valid: false, error: "Unsupported or corrupt image file" };
    }
    if (detected !== file.type) {
        return {
            valid: false,
            error: `File content does not match declared type (declared: ${file.type}, detected: ${detected})`,
        };
    }
    return { valid: true, mime: detected };
}
