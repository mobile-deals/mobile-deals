"use client";

import React, { useState } from "react";
import { deleteBannerAction } from "@/app/actions/admin";
import { Trash2, Loader2 } from "lucide-react";

interface BannerActionsProps {
  bannerId: string;
  bannerTitle: string;
}

export function BannerActions({ bannerId, bannerTitle }: BannerActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete banner "${bannerTitle}"?`)) return;
    setLoading(true);
    await deleteBannerAction(bannerId);
    setLoading(false);
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />;
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
      title="Delete banner"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
