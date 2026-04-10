import { describe, expect, it } from "vitest";
import { validateUploadFile } from "@/app/api/upload/validation";

function createFile(type: string, sizeInBytes: number): File {
    return new File([new Uint8Array(sizeInBytes)], "sample.bin", { type });
}

describe("upload validation", () => {
    it("returns error when file is missing", () => {
        const result = validateUploadFile(null);

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toBe("File not found");
        }
    });

    it("rejects svg files", () => {
        const file = createFile("image/svg+xml", 256);
        const result = validateUploadFile(file);

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toContain("Invalid file type");
        }
    });

    it("accepts supported image types", () => {
        const file = createFile("image/png", 256);
        const result = validateUploadFile(file);

        expect(result.valid).toBe(true);
    });

    it("rejects files larger than 10MB", () => {
        const file = createFile("image/jpeg", 10 * 1024 * 1024 + 1);
        const result = validateUploadFile(file);

        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.error).toContain("File too large");
        }
    });
});
