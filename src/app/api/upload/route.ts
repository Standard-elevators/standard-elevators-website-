import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File exceeds 15MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Clean filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${originalName}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/images/uploads/${uniqueName}`;

    return NextResponse.json({
      secure_url: publicUrl,
      url: publicUrl,
      public_id: uniqueName,
    });
  } catch (error) {
    console.error("Direct upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
