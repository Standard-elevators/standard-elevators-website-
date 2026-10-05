import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyServerAdminAuth } from "@/lib/server-auth";

/**
 * Cloudinary Asset Deletion Route
 * POST /api/cloudinary/delete
 * 
 * Safely removes replaced or deleted assets from Cloudinary.
 * Strictly requires server-side Firebase Admin authentication.
 */
export async function POST(request: Request) {
  // 1. Verify Server-Side Firebase Admin Authorization
  const authCheck = await verifyServerAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error || "Unauthorized" },
      { status: authCheck.status || 401 }
    );
  }

  // 2. Read Server-Side Credentials
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ikgbbha9";

  if (!apiSecret || !apiKey) {
    return NextResponse.json(
      {
        error:
          "CLOUDINARY_API_SECRET and/or CLOUDINARY_API_KEY are not configured on the server. Remote asset deletion cannot proceed without server credentials.",
        missingCredentials: {
          apiKey: !apiKey,
          apiSecret: !apiSecret,
        },
      },
      { status: 501 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const publicId = body.publicId;

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { error: "A valid publicId string is required to delete a Cloudinary asset." },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    // Sort parameters: public_id, timestamp
    const serializedParams = `public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(serializedParams + apiSecret)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const destroyRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const destroyData = await destroyRes.json();

    if (!destroyRes.ok || destroyData.result !== "ok") {
      return NextResponse.json(
        {
          error: destroyData?.error?.message || destroyData.result || "Deletion failed on Cloudinary.",
          details: destroyData,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Asset "${publicId}" successfully deleted from Cloudinary.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Asset deletion error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
