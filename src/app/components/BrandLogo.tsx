import { useState } from "react";

export const BRAND_NAME = "STYLISH FANCY JEWELRY";
export const BRAND_TAGLINE = "Luxury Jewelry";
export const BRAND_LOGO_PATH = "/logo.png";
export const BRAND_INSTAGRAM_HANDLE = "@stylishfancyjewelry";
export const BRAND_HASHTAG = "#StylishFancyJewelry";
export const BUSINESS_EMAIL = "info@stylishfancyjewelry.com";
export const BUSINESS_PHONE = "+92 300 1234567";
export const BUSINESS_WHATSAPP = "923001234567";
export const BUSINESS_LOCATION = "Lahore, Pakistan";

interface BrandLogoProps {
  align?: "left" | "center";
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
  showTagline?: boolean;
  titleClassName?: string;
  taglineClassName?: string;
}

export function BrandLogo({
  align = "left",
  className = "",
  containerClassName = "",
  imageClassName = "",
  showTagline = true,
  titleClassName = "",
  taglineClassName = "",
}: BrandLogoProps) {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <div
        className={containerClassName}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {!logoMissing && (
          <img
            src={BRAND_LOGO_PATH}
            alt={BRAND_NAME}
            className={imageClassName}
            onError={() => setLogoMissing(true)}
          />
        )}
        <div
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
      </div>
    </div>
  );
}
