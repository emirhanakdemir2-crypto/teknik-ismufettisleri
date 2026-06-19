import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import type { NotificationItem, NotificationPayload, NotificationType } from "@/lib/notifications/types";
import { createClient } from "@/lib/supabase/server";

function parsePayload(value: unknown): NotificationPayload {
  if (!value || typeof value !== "object") {
    return {
      title: "Bildirim",
      body: "",
      href: "/notifications",
    };
  }

  const payload = value as Record<string, unknown>;

  return {
    title: typeof payload.title === "string" ? payload.title : "Bildirim",
    body: typeof payload.body === "string" ? payload.body : "",
    href:
      typeof payload.href === "string" && payload.href.startsWith("/")
        ? payload.href
        : "/notifications",
    questionId: typeof payload.questionId === "string" ? payload.questionId : undefined,
    answerId: typeof payload.answerId === "string" ? payload.answerId : undefined,
    applicationId:
      typeof payload.applicationId === "string" ? payload.applicationId : undefined,
  };
}

function mapNotificationRow(row: {
  id: string;
  type: string;
  payload: unknown;
  read_at: string | null;
  created_at: string;
}): NotificationItem {
  return {
    id: row.id,
    type: row.type as NotificationType,
    payload: parsePayload(row.payload),
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function getNotificationsForUser(userId: string): Promise<NotificationItem[]> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, payload, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return data.map(mapNotificationRow);
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  noStore();
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const readAt = new Date().toISOString();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    return { error: "Bildirim okundu olarak işaretlenemedi." };
  }

  return {};
}

export async function markAllNotificationsRead(userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const readAt = new Date().toISOString();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    return { error: "Bildirimler okundu olarak işaretlenemedi." };
  }

  return {};
}

export async function getNotificationForUser(
  userId: string,
  notificationId: string,
): Promise<NotificationItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, payload, read_at, created_at")
    .eq("id", notificationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapNotificationRow(data);
}
