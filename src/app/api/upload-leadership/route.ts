import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    
    // Save Name Data
    if (name) {
      const dataDir = path.join(process.cwd(), "public", "data");
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
      }
      const dataPath = path.join(dataDir, "founder.json");
      await fs.writeFile(dataPath, JSON.stringify({ name }), "utf-8");
    }

    // Save Image File
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Save to the exact path used by the frontend
      const imgDir = path.join(process.cwd(), "public", "images", "team");
      try {
        await fs.access(imgDir);
      } catch {
        await fs.mkdir(imgDir, { recursive: true });
      }
      const filePath = path.join(imgDir, "founder.jpg");
      
      await fs.writeFile(filePath, buffer);
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
