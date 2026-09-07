"use client";

import React, { useState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { Loader2 } from "lucide-react";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as typeof currentStatus;
    setStatus(newStatus);
    setLoading(true);
    await updateOrderStatusAction(orderId, newStatus);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
          status === "delivered"
            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
            : status === "shipped"
            ? "bg-blue-50 text-blue-800 border-blue-300"
            : status === "confirmed"
            ? "bg-amber-50 text-amber-800 border-amber-300"
            : status === "cancelled"
            ? "bg-rose-50 text-rose-800 border-rose-300"
            : "bg-neutral-50 text-neutral-800 border-neutral-300"
        }`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />}
    </div>
  );
}
