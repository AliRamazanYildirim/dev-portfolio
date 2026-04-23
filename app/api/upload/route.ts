// Bild-Upload API-Endpoint - Image upload API endpoint
import { NextRequest } from "next/server";
import { UploadService } from "./service";
import { validateUploadFile } from "./validation";
import { verifyImageSignature } from "./lib/magicBytes";
import { handleError, successResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    // Input validieren (MIME + Größe)
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      throw new ValidationError(validation.error);
    }

    // Magic-Byte Verifikation gegen MIME-Spoofing
    const signature = await verifyImageSignature(validation.value);
    if (!signature.valid) {
      throw new ValidationError(signature.error);
    }

    const result = await UploadService.uploadImage(validation.value);

    return successResponse({ url: result.url });
  } catch (error) {
    return handleError(error, "Upload error");
  }
}
