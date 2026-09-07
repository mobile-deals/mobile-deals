import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SeedButton } from "@/components/admin/seed-button";
import {
  Package,
  ShoppingBag,
  Layers,
  Banknote,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Fetch key dashboard statistics
  const [
    { count: productsCount },
    { count: categoriesCount },
    { data: ordersData },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, order_reference, customer_name, customer_phone, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const orders = ordersData || [];
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const stats = [
    {
      label: "Total Products",
      value: productsCount ?? 0,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active Categories",
      value: categoriesCount ?? 0,
      icon: Layers,
      href: "/admin/categories",
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Revenue",
      value: `QAR ${totalRevenue.toLocaleString()}`,
      icon: Banknote,
      href: "/admin/orders",
      color: "text-[#8A1538] bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Store Overview
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Manage your Qatar electronics catalog, banners, orders, and pricing.
          </p>
        </div>

        {/* Database One-Click Seeder / Sync */}
        <SeedButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-[#8A1538]/30 transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500">
                  {stat.label}
                </span>
                <p className="text-2xl font-black text-neutral-900 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8A1538]" />
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Recent Cash on Delivery Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#8A1538] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-xs sm:text-sm">
            No orders placed yet. Customer COD orders will appear here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/80">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#8A1538]">
                      {o.order_reference}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {o.customer_name}
                    </td>
                    <td className="py-3.5 px-3">{o.customer_phone}</td>
                    <td className="py-3.5 px-3 font-bold text-neutral-900">
                      QAR {Number(o.total).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          o.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "confirmed"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
