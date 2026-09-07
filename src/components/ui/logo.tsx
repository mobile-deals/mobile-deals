import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  // Calibrated to exact aspect ratio of /Logo-mobile-deals.png (2103 x 748, ratio 2.811:1)
  const sizeClasses = {
    sm: "h-8 sm:h-9 w-auto",
    md: "h-9 sm:h-11 md:h-12 w-auto",
    lg: "h-12 sm:h-14 md:h-16 w-auto",
  };

  const pixelDimensions = {
    sm: { width: 112, height: 40 },
    md: { width: 146, height: 52 },
    lg: { width: 191, height: 68 },
  };

  const { width, height } = pixelDimensions[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center select-none focus:outline-none transition-opacity hover:opacity-95 ${className}`}
      aria-label="Mobile Deals Homepage"
    >
      <Image
        src="/Logo-mobile-deals.png"
        alt="Mobile Deals"
        width={width}
        height={height}
        priority
        className={`${sizeClasses[size]} object-contain`}
      />
    </Link>
  );
}
