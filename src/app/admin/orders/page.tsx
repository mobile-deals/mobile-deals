import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Order } from "@/types/database";
import { ShoppingBag, MessageCircle, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data as Order[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Cash on Delivery Orders
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-medium">
          Manage Qatar customer orders, update dispatch statuses, and contact via WhatsApp.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No Orders Placed Yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Customer orders placed on the storefront will appear here with full line items and address details.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-neutral-500 uppercase font-bold text-[10px]">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Customer &amp; Location</th>
                  <th className="py-3.5 px-3">Items</th>
                  <th className="py-3.5 px-3">Total Payable</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {orders.map((o) => {
                  const whatsappClean = o.customer_phone.replace(/[^\d]/g, "");
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50/70">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#8A1538] block">
                          {o.order_reference}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(o.created_at).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-neutral-900 block">
                          {o.customer_name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8A1538]" />
                          <span>
                            {o.area}
                            {o.zone ? `, Z${o.zone}` : ""}
                            {o.building ? `, ${o.building}` : ""}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-neutral-800">
                          {o.order_items?.length || 0} items
                        </span>
                        <div className="text-[10px] text-neutral-400 max-w-xs truncate">
                          {o.order_items?.map((i) => i.product_name).join(", ")}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-black text-sm text-[#8A1538]">
                          QAR {Number(o.total).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 block">
                          Cash on Delivery
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <OrderStatusSelect
                          orderId={o.id}
                          currentStatus={o.status}
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                            `Hello ${o.customer_name} 👋 Regarding your Mobile Deals order #${o.order_reference} (QAR ${o.total}), our delivery team is preparing your package.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-emerald-800 font-bold text-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
