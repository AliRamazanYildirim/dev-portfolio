import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "resume.pdf");

export async function GET() {
    try {
        const fileBuffer = await fs.readFile(filePath);
        const arrayBuffer = fileBuffer.buffer.slice(
            fileBuffer.byteOffset,
            fileBuffer.byteOffset + fileBuffer.byteLength
        ) as ArrayBuffer;
        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=resume.pdf",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Resume file not found" },
            { status: 404 }
        );
    }
}

export async function HEAD() {
    try {
        const stats = await fs.stat(filePath);
        return new NextResponse(null, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Length": String(stats.size),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return new NextResponse(null, { status: 404 });
    }
}
