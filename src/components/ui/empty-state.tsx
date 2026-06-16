import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  title,
  description,
  children,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${compact ? "empty-state--compact" : ""}`.trim()}>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__text">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
