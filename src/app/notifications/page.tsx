import Link from "next/link";
import { redirect } from "next/navigation";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/notifications/actions";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { formatDateTR } from "@/lib/format/date";
import { getNotificationsForUser } from "@/lib/notifications/queries";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/notifications"));
  }

  const notifications = await getNotificationsForUser(user.id);

  return (
    <div className="site-container page-stack">
      <PageHeader
        title="Bildirimler"
        description="Hesabınıza gelen güncel bildirimleri buradan takip edebilirsiniz."
      />

      {notifications.length > 0 && (
        <form action={markAllNotificationsReadAction} className="notifications-page__toolbar">
          <button type="submit" className="btn btn-secondary">
            Tümünü okundu işaretle
          </button>
        </form>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          title="Henüz bildiriminiz yok"
          description="Sorularınız, moderasyon veya müfettiş paneli güncellemeleri burada görünecektir."
        />
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notifications-list__item ${
                notification.readAt ? "notifications-list__item--read" : ""
              }`}
            >
              <form action={markNotificationReadAction.bind(null, notification.id)}>
                <button type="submit" className="notifications-list__button">
                  <div className="notifications-list__head">
                    <p className="notifications-list__title">{notification.payload.title}</p>
                    {!notification.readAt && (
                      <span className="notifications-list__unread" aria-label="Okunmadı">
                        Yeni
                      </span>
                    )}
                  </div>
                  {notification.payload.body && (
                    <p className="notifications-list__body">{notification.payload.body}</p>
                  )}
                  <p className="notifications-list__meta">
                    {formatDateTR(notification.createdAt)}
                  </p>
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <p className="notifications-page__hint">
        <Link href="/account" className="text-link">
          Hesabıma dön
        </Link>
      </p>
    </div>
  );
}
