import Image from "next/image";

import timderLogo from "../../../public/brand/timder-logo.png";

type SiteLogoVariant = "full" | "compact" | "mark";

type SiteLogoProps = {
  variant?: SiteLogoVariant;
  className?: string;
};

const LOGO_ALT = "TİMDER — Teknik İş Müfettişleri Derneği";

const VARIANT_WIDTH: Record<SiteLogoVariant, number> = {
  full: 188,
  compact: 118,
  mark: 46,
};

function logoHeightForWidth(width: number): number {
  return Math.round((timderLogo.height / timderLogo.width) * width);
}

export function SiteLogo({ variant = "full", className = "" }: SiteLogoProps) {
  const width = VARIANT_WIDTH[variant];
  const height = logoHeightForWidth(width);

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
          sizes="(min-width: 960px) 188px, 118px"
        />
      </span>
    </span>
  );
}
