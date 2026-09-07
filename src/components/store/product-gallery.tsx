"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/database";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeImage = images[selectedIdx]?.image_url || null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Viewport */}
      <div className="relative w-full aspect-square bg-white rounded-3xl border border-neutral-200/80 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-xs">
        {activeImage ? (
          <Image
            src={getOptimizedImageUrl(activeImage, "detail")}
            alt={images[selectedIdx]?.alt_text || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 transition-all duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-300">
            <span className="text-6xl">📱</span>
            <span className="text-xs text-neutral-400 mt-2 font-medium">No Image Available</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border p-1.5 shrink-0 overflow-hidden transition-all ${
                selectedIdx === idx
                  ? "border-[#8A1538] ring-2 ring-[#8A1538]/20 shadow-xs"
                  : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={getOptimizedImageUrl(img.image_url, "thumb")}
                alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
