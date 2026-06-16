import type { ReactNode } from "react";

type ForumTableProps = {
  children: ReactNode;
  responsive?: boolean;
  className?: string;
};

export function ForumTable({
  children,
  responsive = true,
  className = "",
}: ForumTableProps) {
  const responsiveClass = responsive ? "forum-table--responsive" : "";

  return (
    <table className={`forum-table ${responsiveClass} ${className}`.trim()}>
      {children}
    </table>
  );
}

type ForumPanelTableProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  tone?: "default" | "soft";
};

export function ForumPanelTable({
  title,
  children,
  footer,
  tone = "default",
}: ForumPanelTableProps) {
  const toneClass = tone === "soft" ? "site-panel--soft" : "";

  return (
    <div className={`site-panel ${toneClass}`.trim()}>
      <div className="site-panel__head">{title}</div>
      <div className="site-panel__body p-0">{children}</div>
      {footer && <div className="site-panel__footer">{footer}</div>}
    </div>
  );
}
