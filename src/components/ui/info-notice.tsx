import type { ReactNode } from "react";

type InfoNoticeVariant = "info" | "warning" | "legal";

type InfoNoticeProps = {
  variant?: InfoNoticeVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

const VARIANT_CLASS: Record<InfoNoticeVariant, string> = {
  info: "info-notice--info",
  warning: "info-notice--warning",
  legal: "info-notice--legal",
};

export function InfoNotice({
  variant = "info",
  title,
  children,
  className = "",
}: InfoNoticeProps) {
  return (
    <div
      className={`info-notice ${VARIANT_CLASS[variant]} ${className}`.trim()}
      role="note"
    >
      {title && <p className="info-notice__title">{title}</p>}
      <div className="info-notice__body">{children}</div>
    </div>
  );
}
