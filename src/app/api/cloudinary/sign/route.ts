import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyServerAdminAuth } from "@/lib/server-auth";

/**
 * Cloudinary Signature Generator Route
 * POST /api/cloudinary/sign
 * 
 * Generates an authenticated upload signature for Cloudinary.
 * Strictly requires server-side Firebase Admin authentication.
 */
export async function POST(request: Request) {
  // 1. Verify Server-Side Firebase Identity & Admin Authorization
  const authCheck = await verifyServerAdminAuth(request);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error || "Unauthorized" },
      { status: authCheck.status || 401 }
    );
  }

  // 2. Read Server-Side Cloudinary Credentials (NEVER exposed with NEXT_PUBLIC_)
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ikgbbha9";

  // Explicit check: Never invent or pretend signed uploads work without the API secret
  if (!apiSecret || !apiKey) {
    return NextResponse.json(
      {
        error:
          "CLOUDINARY_API_SECRET and/or CLOUDINARY_API_KEY are not configured on the server. Server-signed uploads cannot proceed without these credentials.",
        missingCredentials: {
          apiKey: !apiKey,
          apiSecret: !apiSecret,
        },
        cloudName,
      },
      { status: 501 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || "standard_elevators";
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Build sorted parameter string for Cloudinary signature
    // Parameters must be sorted alphabetically: folder, timestamp
    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
    };

    if (body.transformation) {
      paramsToSign.transformation = body.transformation;
    }

    const sortedKeys = Object.keys(paramsToSign).sort();
    const serializedParams = sortedKeys
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    // SHA-1 signature per Cloudinary spec
    const signature = crypto
      .createHash("sha1")
      .update(serializedParams + apiSecret)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Signature generation error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
