import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/actions";
import { AccountQuestionStats } from "@/components/account/account-question-stats";
import { AccountQuickLinks } from "@/components/account/account-quick-links";
import { AccountSummaryCard } from "@/components/account/account-summary-card";
import { MyQuestionsSection } from "@/components/account/my-questions-section";
import { ForumPanelTable } from "@/components/ui/forum-table";
import { PageHeader } from "@/components/ui/page-header";
import {
  computeMyQuestionStats,
  getMyQuestions,
} from "@/lib/account/queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const questions = await getMyQuestions(user.id);
  const stats = computeMyQuestionStats(questions);

  return (
    <div className="site-container page-stack pb-8">
      <PageHeader
        title="Hesabım"
        description="Hesap bilgileriniz, soru durumlarınız ve hızlı erişim bağlantıları."
        actions={
          <form action={signOut}>
            <button type="submit" className="btn btn-secondary">
              Çıkış Yap
            </button>
          </form>
        }
      />

      <ForumPanelTable title="Hesap özeti">
        <div className="p-3">
          <AccountSummaryCard user={user} />
        </div>
      </ForumPanelTable>

      <ForumPanelTable title="Soru durum özeti" tone="soft">
        <div className="p-3">
          <AccountQuestionStats stats={stats} />
        </div>
      </ForumPanelTable>

      <ForumPanelTable title="Hızlı erişim">
        <div className="p-3">
          <AccountQuickLinks user={user} />
        </div>
      </ForumPanelTable>

      <section id="benim-sorularim">
        <ForumPanelTable
          title="Benim sorularım"
          footer={
            questions.length > 0 ? (
              <Link href="/ask" className="text-link hover:underline">
                Yeni soru gönder
              </Link>
            ) : undefined
          }
        >
          <div className="p-3">
            <MyQuestionsSection questions={questions} />
          </div>
        </ForumPanelTable>
      </section>
    </div>
  );
}
