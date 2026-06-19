import Link from "next/link";

import { signOut } from "@/app/actions";
import { AccountQuestionStats } from "@/components/account/account-question-stats";
import {
  AccountQuickLinksGrid,
  buildAccountQuickLinks,
} from "@/components/account/account-quick-links";
import { ApplicationStatusCard } from "@/components/account/application-status-card";
import { AccountSummaryCard } from "@/components/account/account-summary-card";
import { MyQuestionsSection } from "@/components/account/my-questions-section";
import { ForumPanelTable } from "@/components/ui/forum-table";
import { PageHeader } from "@/components/ui/page-header";
import type { MyQuestionItem, MyQuestionStats } from "@/lib/account/queries";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import {
  canAnswerQuestion,
  canModerateQuestions,
} from "@/lib/auth/roles";
import { hasPendingInspectorApplication } from "@/lib/inspector/application-record";

type AccountDashboardProps = {
  user: CurrentUser;
  questions: MyQuestionItem[];
  stats: MyQuestionStats;
  staffStats?: {
    pendingCount: number;
    publishedCount: number;
    rejectedCount: number;
    pendingApplications: number;
  };
};

function accountDescription(user: CurrentUser): string {
  if (canModerateQuestions(user.role)) {
    return "Yönetim kısayolları, hesap bilgileriniz ve moderasyon erişimi.";
  }

  if (canAnswerQuestion(user.role)) {
    return "Müfettiş paneli erişimi, hesap bilgileriniz ve mesleki cevap araçları.";
  }

  if (
    user.role === "inspector_pending" ||
    hasPendingInspectorApplication(user.inspectorApplicationRecord)
  ) {
    return "Müfettişlik başvuru durumunuz ve hesap bilgileriniz.";
  }

  return "Hesap bilgileriniz, soru durumlarınız ve hızlı erişim bağlantıları.";
}

export function AccountDashboard({
  user,
  questions,
  stats,
  staffStats,
}: AccountDashboardProps) {
  const isStaff = canModerateQuestions(user.role);
  const isInspector = canAnswerQuestion(user.role);
  const isPendingApplicant =
    user.role === "inspector_pending" ||
    hasPendingInspectorApplication(user.inspectorApplicationRecord);

  const quickLinks = buildAccountQuickLinks(user, staffStats);
  const showQuestionStats = !isStaff && !isInspector;
  const showMyQuestions = !isStaff;
  const myQuestionsPrimary = !isStaff && !isInspector && !isPendingApplicant;

  return (
    <div className="site-container page-stack pb-8">
      <PageHeader
        title="Hesabım"
        description={accountDescription(user)}
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

      {isPendingApplicant && (
        <ForumPanelTable title="Müfettişlik başvurusu" tone="soft">
          <div className="p-3">
            <ApplicationStatusCard user={user} />
          </div>
        </ForumPanelTable>
      )}

      {showQuestionStats && (
        <ForumPanelTable title="Soru durum özeti" tone="soft">
          <div className="p-3">
            <AccountQuestionStats stats={stats} />
          </div>
        </ForumPanelTable>
      )}

      <ForumPanelTable title={isStaff ? "Yönetim kısayolları" : "Hızlı erişim"}>
        <div className="p-3">
          <AccountQuickLinksGrid links={quickLinks} />
        </div>
      </ForumPanelTable>

      {showMyQuestions && (
        <section
          id="benim-sorularim"
          className={myQuestionsPrimary ? undefined : "account-section--secondary"}
        >
          <ForumPanelTable
            title={myQuestionsPrimary ? "Benim sorularım" : "Gönderdiğim sorular"}
            tone={myQuestionsPrimary ? undefined : "soft"}
            footer={
              !isInspector && questions.length > 0 ? (
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
      )}
    </div>
  );
}
