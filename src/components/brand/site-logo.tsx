type SiteLogoVariant = "full" | "compact" | "mark";

type SiteLogoProps = {
  variant?: SiteLogoVariant;
  className?: string;
};

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`site-logo__mark ${className}`.trim()}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="var(--logo-accent)"
        strokeWidth="1.25"
      />
      <circle cx="32" cy="32" r="26.5" stroke="var(--logo-ink)" strokeWidth="0.75" />

      <ellipse cx="32" cy="17.5" rx="13.5" ry="3" fill="var(--logo-ink)" />
      <path
        d="M19.5 17.5C19.5 12 24.5 8.5 32 8.5C39.5 8.5 44.5 12 44.5 17.5V19H19.5V17.5Z"
        fill="var(--logo-ink)"
      />
      <rect x="20" y="16" width="24" height="2.25" rx="0.5" fill="var(--logo-band)" />

      <path d="M17.5 39L25.5 29.5V41.5L17.5 39Z" fill="var(--logo-ink)" opacity="0.9" />
      <path d="M46.5 39L38.5 29.5V41.5L46.5 39Z" fill="var(--logo-ink)" opacity="0.9" />

      <circle cx="32" cy="37" r="8.75" stroke="var(--logo-ink)" strokeWidth="2" />
      <path
        d="M38.5 43.5L44.5 49.5"
        stroke="var(--logo-ink)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M27.5 37L31 40.5L36.5 33.5"
        stroke="var(--logo-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteLogo({ variant = "full", className = "" }: SiteLogoProps) {
  const rootClass = ["site-logo", `site-logo--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  if (variant === "mark") {
    return (
      <span className={rootClass}>
        <span className="site-logo__mark-wrap">
          <BrandMark />
        </span>
      </span>
    );
  }

  return (
    <span className={rootClass}>
      <span className="site-logo__mark-wrap">
        <BrandMark />
      </span>
      <span className="site-logo__text">
        <span className="site-logo__org">Teknik İşmüfettişleri Derneği</span>
        {variant === "full" && <span className="site-logo__product">Müfettişe Sor</span>}
      </span>
    </span>
  );
}
