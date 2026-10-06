import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Save to the exact path used by the frontend
    const filePath = path.join(process.cwd(), "public", "images", "team", "founder.jpg");
    
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, message: "Image updated successfully" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
