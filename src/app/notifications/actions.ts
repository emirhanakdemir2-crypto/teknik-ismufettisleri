"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  getNotificationForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/queries";

export async function markNotificationReadAction(notificationId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/notifications"));
  }

  const notification = await getNotificationForUser(user.id, notificationId);

  if (!notification) {
    redirect("/notifications");
  }

  if (!notification.readAt) {
    await markNotificationRead(user.id, notificationId);
  }

  revalidatePath("/notifications");
  redirect(notification.payload.href);
}

export async function markAllNotificationsReadAction() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/notifications"));
  }

  await markAllNotificationsRead(user.id);
  revalidatePath("/notifications");
}
