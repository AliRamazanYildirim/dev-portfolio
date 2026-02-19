// Bild-Upload API-Endpoint - Image upload API endpoint
import { NextRequest } from "next/server";
import { UploadService } from "./service";
import { handleError, successResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    const result = await UploadService.uploadImage(file);

    return successResponse({ url: result.url });
  } catch (error) {
    return handleError(error, "Upload error");
  }
}
