"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { getCloudinaryUploadSignature } from "@/app/actions/cloudinary";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "mobile-deals/products",
  label = "Upload Image to Cloudinary",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(10);

    try {
      // 1. Get secure signature from server
      const sigRes = await getCloudinaryUploadSignature(folder);
      if (!sigRes.success || !sigRes.data) {
        throw new Error(sigRes.error || "Failed to generate upload signature.");
      }

      setUploadProgress(30);

      const { signature, timestamp, apiKey, cloudName } = sigRes.data;

      // 2. Direct browser upload to Cloudinary (zero Vercel serverless load)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      setUploadProgress(60);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setUploadProgress(90);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Cloudinary upload failed.");
      }

      const data = await res.json();
      setUploadProgress(100);

      if (data.secure_url) {
        onChange(data.secure_url);
      }
    } catch (err: unknown) {
      console.error("[Cloudinary Upload]", err);
      setError((err as Error).message || "Upload failed. You can paste a direct URL below.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold text-neutral-700 text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#8A1538]" />
          <span>{label}</span>
        </span>
        <span className="text-[10px] text-neutral-400 font-normal">Direct to Cloudinary</span>
      </label>

      {/* Preview if image is already set */}
      {value ? (
        <div className="relative flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div className="relative w-16 h-16 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
            <Image
              src={value}
              alt="Uploaded image preview"
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image Uploaded to Cloudinary</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono truncate mt-0.5" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Upload Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
            uploading
              ? "border-[#8A1538] bg-[#8A1538]/5"
              : "border-neutral-300 hover:border-[#8A1538] hover:bg-neutral-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-2 py-2 flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#8A1538] animate-spin" />
              <span className="text-xs font-bold text-neutral-800">
                Uploading directly to Cloudinary... ({uploadProgress || 50}%)
              </span>
            </div>
          ) : (
            <div className="space-y-1.5 py-1 flex flex-col items-center justify-center">
              <div className="w-9 h-9 rounded-xl bg-[#8A1538]/10 text-[#8A1538] flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-neutral-800">
                Click to browse &amp; upload image
              </p>
              <p className="text-[10px] text-neutral-400">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL input fallback */}
      <div className="pt-1">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste Cloudinary URL: https://res.cloudinary.com/noeooeae/..."
          className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-[#8A1538]"
        />
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
