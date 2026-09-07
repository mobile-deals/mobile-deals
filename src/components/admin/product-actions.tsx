"use client";

import React, { useState } from "react";
import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/app/actions/admin";
import { Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  isActive: boolean;
  productName: string;
}

export function ProductActions({
  productId,
  isActive,
  productName,
}: ProductActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleProductActiveAction(productId, isActive);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }
    setLoading(true);
    await deleteProductAction(productId);
    setLoading(false);
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        className={`p-1 rounded-md transition-colors ${
          isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-neutral-400 hover:bg-neutral-100"
        }`}
        title={isActive ? "Deactivate product" : "Activate product"}
      >
        {isActive ? (
          <ToggleRight className="w-5 h-5 fill-current" />
        ) : (
          <ToggleLeft className="w-5 h-5" />
        )}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        title="Delete product"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
