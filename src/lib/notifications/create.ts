import "server-only";

import type { UserRole } from "@/lib/auth/roles";
import type { NotificationPayload, NotificationType } from "@/lib/notifications/types";
import { createAdminClient } from "@/lib/supabase/admin";

async function getProfileIdsByRoles(roles: UserRole[]): Promise<string[]> {
  if (roles.length === 0) {
    return [];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("profiles").select("id").in("role", roles);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.id);
}

export async function createNotificationForUser(
  userId: string,
  type: NotificationType,
  payload: NotificationPayload,
): Promise<void> {
  const admin = createAdminClient();

  const { error } = await admin.from("notifications").insert({
    user_id: userId,
    type,
    payload,
  });

  if (error) {
    console.error("Bildirim oluşturulamadı:", error.message);
  }
}

export async function createNotificationsForUsers(
  userIds: string[],
  type: NotificationType,
  payload: NotificationPayload,
  options?: { excludeUserIds?: string[] },
): Promise<void> {
  const exclude = new Set(options?.excludeUserIds ?? []);
  const recipients = [...new Set(userIds.filter((id) => id && !exclude.has(id)))];

  if (recipients.length === 0) {
    return;
  }

  const admin = createAdminClient();
  const rows = recipients.map((userId) => ({
    user_id: userId,
    type,
    payload,
  }));

  const { error } = await admin.from("notifications").insert(rows);

  if (error) {
    console.error("Toplu bildirim oluşturulamadı:", error.message);
  }
}

export async function createNotificationsForRoles(
  roles: UserRole[],
  type: NotificationType,
  payload: NotificationPayload,
  options?: { excludeUserIds?: string[] },
): Promise<void> {
  const userIds = await getProfileIdsByRoles(roles);
  await createNotificationsForUsers(userIds, type, payload, options);
}
