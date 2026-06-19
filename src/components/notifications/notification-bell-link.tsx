import Link from "next/link";

type NotificationBellLinkProps = {
  unreadCount: number;
};

export function NotificationBellLink({ unreadCount }: NotificationBellLinkProps) {
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <Link
      href="/notifications"
      className="site-header__notifications no-underline hover:no-underline"
      aria-label={
        unreadCount > 0
          ? `Bildirimler, ${unreadCount} okunmamış`
          : "Bildirimler"
      }
    >
      <span className="site-header__notifications-label">Bildirimler</span>
      {unreadCount > 0 && (
        <span className="site-header__notifications-badge" aria-hidden="true">
          {badgeLabel}
        </span>
      )}
    </Link>
  );
}
