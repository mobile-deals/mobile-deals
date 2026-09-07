import React from "react";
import { Truck, Banknote, ShieldCheck, PhoneCall } from "lucide-react";

interface AnnouncementBarProps {
  items?: string[];
}

export function AnnouncementBar({
  items = [
    "Free Delivery Across Qatar",
    "Cash on Delivery Available",
    "Order on WhatsApp",
    "100% Genuine Products",
  ],
}: AnnouncementBarProps) {
  const icons = [Truck, Banknote, PhoneCall, ShieldCheck];

  return (
    <div className="w-full bg-[#8A1538] text-white text-xs font-medium border-b border-[#6E132D] select-none">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Dynamic Trust Items */}
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar py-0.5">
          {items.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 whitespace-nowrap text-white/90 hover:text-white transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span>{item}</span>
                {idx < items.length - 1 && (
                  <span className="text-white/30 hidden lg:inline ml-4 md:ml-6">|</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Qatar Currency & Language */}
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-white/90">
          {/* Qatar Flag + Currency */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/20">
            {/* Qatar Flag mini icon */}
            <svg
              className="w-4 h-3 rounded-xs shadow-xs"
              viewBox="0 0 28 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="18" fill="#8A1538" />
              <path
                d="M0 0H8L11 2L8 4L11 6L8 8L11 10L8 12L11 14L8 16L11 18H0V0Z"
                fill="white"
              />
            </svg>
            <span className="font-semibold text-white">QAR</span>
          </div>

          <span className="text-white/30">|</span>

          {/* Arabic Option Link */}
          <span
            className="hover:text-white cursor-pointer font-sans transition-colors"
            title="Arabic language support"
          >
            العربية
          </span>
        </div>
      </div>
    </div>
  );
}
