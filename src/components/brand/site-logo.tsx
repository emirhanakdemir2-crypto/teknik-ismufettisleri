import Image from "next/image";

import timderLogo from "../../../public/brand/timder-logo.png";

type SiteLogoVariant = "full" | "compact" | "mark";

type SiteLogoProps = {
  variant?: SiteLogoVariant;
  className?: string;
};

const LOGO_ALT = "TİMDER — Teknik İş Müfettişleri Derneği";

const VARIANT_HEIGHT: Record<SiteLogoVariant, number> = {
  full: 50,
  compact: 38,
  mark: 32,
};

function logoWidthForHeight(height: number): number {
  return Math.round((timderLogo.width / timderLogo.height) * height);
}

export function SiteLogo({ variant = "full", className = "" }: SiteLogoProps) {
  const height = VARIANT_HEIGHT[variant];
  const width = logoWidthForHeight(height);

  const rootClass = ["site-logo", `site-logo--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={rootClass}>
      <span className="site-logo__emblem-wrap">
        <Image
          src={timderLogo}
          alt={LOGO_ALT}
          width={width}
          height={height}
          className="site-logo__image"
          priority={variant === "full"}
          sizes="(min-width: 960px) 44px, 36px"
        />
      </span>
    </span>
  );
}
