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
        width={120}
        height={32}
        priority
        className={`h-8 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="Tutor For Test"
        width={160}
        height={40}
        priority
        className="h-10 w-auto object-contain"
      />
      {showTagline && (
        <div className="hidden min-w-0 text-left xl:block">
          <div className="truncate text-[10px] font-medium uppercase tracking-wider text-tft-muted">
            TFT
          </div>
          <div className="truncate text-[11px] leading-snug text-tft-muted">
            Verified HD tutors. Unit-specific support.
          </div>
        </div>
      )}
    </div>
  );
}
