"use server";

import crypto from "crypto";

export interface CloudinarySignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Generates a secure signature for direct browser-to-Cloudinary uploads.
 * Prevents passing large image buffers through Vercel serverless functions.
 */
export async function getCloudinaryUploadSignature(
  folder = "mobile-deals/products"
): Promise<{ success: boolean; data?: CloudinarySignatureResult; error?: string }> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        error: "Cloudinary credentials not fully configured in environment.",
      };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Sort parameters alphabetically
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return {
      success: true,
      data: {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      },
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
