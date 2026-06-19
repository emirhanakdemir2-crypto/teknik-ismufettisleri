import { redirect } from "next/navigation";

import { AccountDashboard } from "@/components/account/account-dashboard";
import { getPendingInspectorApplicationCount } from "@/lib/admin/inspector-application-queries";
import { getModerationDashboardStats } from "@/lib/admin/queries";
import {
  computeMyQuestionStats,
  getMyQuestions,
} from "@/lib/account/queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { canModerateQuestions, canReviewInspectorApplications } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const questions = await getMyQuestions(user.id);
  const stats = computeMyQuestionStats(questions);

  let staffStats;

  if (canModerateQuestions(user.role)) {
    const moderationStats = await getModerationDashboardStats();
    const pendingApplications = canReviewInspectorApplications(user.role)
      ? await getPendingInspectorApplicationCount()
      : 0;

    staffStats = {
      pendingCount: moderationStats.pendingCount,
      publishedCount: moderationStats.publishedCount,
      rejectedCount: moderationStats.rejectedCount,
      pendingApplications,
    };
  }

  return (
    <AccountDashboard
      user={user}
      questions={questions}
      stats={stats}
      staffStats={staffStats}
    />
  );
}
