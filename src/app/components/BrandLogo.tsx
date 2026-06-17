import { useState } from "react";

export const BRAND_NAME = "STYLISH FANCY JEWELRY";
export const BRAND_TAGLINE = "Luxury Jewelry";
export const BRAND_LOGO_PATH = "/assets/logo.png";
export const BRAND_INSTAGRAM_HANDLE = "@stylishfancyjewelry";
export const BRAND_HASHTAG = "#StylishFancyJewelry";

interface BrandLogoProps {
  align?: "left" | "center";
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
  titleClassName?: string;
  taglineClassName?: string;
}

export function BrandLogo({
  align = "left",
  className = "",
  imageClassName = "",
  showTagline = true,
  titleClassName = "",
  taglineClassName = "",
}: BrandLogoProps) {
  const [logoMissing, setLogoMissing] = useState(false);

  if (!logoMissing) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        <img
          src={BRAND_LOGO_PATH}
          alt={BRAND_NAME}
          className={imageClassName}
          onError={() => setLogoMissing(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        lineHeight: 1,
      }}
    >
      <span className={titleClassName}>{BRAND_NAME}</span>
      {showTagline && <span className={taglineClassName}>{BRAND_TAGLINE}</span>}
    </div>
  );
}

