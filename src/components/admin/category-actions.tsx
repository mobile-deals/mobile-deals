"use client";

import React, { useState } from "react";
import { deleteCategoryAction } from "@/app/actions/admin";
import { Trash2, Loader2 } from "lucide-react";

interface CategoryActionsProps {
  categoryId: string;
  categoryName: string;
}

export function CategoryActions({
  categoryId,
  categoryName,
}: CategoryActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete category "${categoryName}"?`)) return;
    setLoading(true);
    await deleteCategoryAction(categoryId);
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
      title="Delete category"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
