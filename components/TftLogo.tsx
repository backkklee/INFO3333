"use client";

import Image from "next/image";

type TftLogoProps = {
  dark: boolean;
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
};

export function TftLogo({
  dark,
  compact = false,
  showTagline = true,
  className = "",
}: TftLogoProps) {
  const src = dark ? "/tft-logo-dark.png" : "/tft-logo-light.png";

  if (compact) {
    return (
      <Image
        src={src}
        alt="TFT — Tutor For Test"
        width={200}
        height={200}
        priority
        className={`h-12 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="Tutor For Test"
        width={700}
        height={700}
        priority
        className="h-16 w-auto object-contain"
      />
      {showTagline && (
        <div className="hidden min-w-0 text-left xl:block">
          <div className="truncate text-[15px] font-medium uppercase tracking-wider text-tft-muted">
            TFT
          </div>
          <div className="truncate text-[16px] leading-snug text-tft-muted">
            Tutor For Test
          </div>
        </div>
      )}
    </div>
  );
}
