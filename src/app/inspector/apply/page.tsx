import Link from "next/link";
import { redirect } from "next/navigation";

import { InspectorApplyForm } from "@/app/inspector/apply/inspector-apply-form";
import { AuthCard } from "@/components/auth-card";
import { InfoNotice } from "@/components/ui/info-notice";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { resolveInspectorApplyView } from "@/lib/inspector/apply-state";
import { formatDateTR } from "@/lib/format/date";

export const dynamic = "force-dynamic";

type InspectorApplyPageProps = {
  searchParams: Promise<{
    notice?: string;
  }>;
};

export default async function InspectorApplyPage({ searchParams }: InspectorApplyPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const view = resolveInspectorApplyView(
    user?.role ?? null,
    user?.inspectorApplication ?? {
      status: null,
      organization: null,
      note: null,
      submittedAt: null,
    },
    user?.inspectorApplicationRecord ?? null,
  );

  if (view === "guest") {
    redirect("/login?next=" + encodeURIComponent("/inspector/apply"));
  }

  const showReceivedNotice = params.notice === "application-received";
  const dbApplication = user?.inspectorApplicationRecord ?? null;

  if (view === "verified") {
    return (
      <div className="auth-page">
        <div className="site-container auth-page__inner">
          <AuthCard title="Müfettiş başvurusu">
            <InfoNotice variant="info" title="Doğrulanmış müfettiş hesabınız var">
              Bu hesap zaten doğrulanmış müfettiş yetkisine sahiptir.
            </InfoNotice>
            <p className="mt-4">
              <Link href="/inspector" className="btn btn-primary no-underline hover:no-underline">
                Müfettiş paneline git
              </Link>
            </p>
          </AuthCard>
        </div>
      </div>
    );
  }

  if (view === "staff") {
    return (
      <div className="auth-page">
        <div className="site-container auth-page__inner">
          <AuthCard title="Müfettiş başvurusu">
            <InfoNotice variant="info" title="Bu hesap için başvuru gerekmez">
              Yönetici veya moderatör hesapları müfettiş başvurusu yapamaz.
            </InfoNotice>
          </AuthCard>
        </div>
      </div>
    );
  }

  if (view === "pending_review" || view === "complete_metadata") {
    const submittedAt =
      dbApplication?.createdAt ??
      user?.inspectorApplication.submittedAt ??
      user?.createdAt ??
      null;
    const organization =
      dbApplication?.organizationOrTitle ?? user?.inspectorApplication.organization;

    return (
      <div className="auth-page">
        <div className="site-container auth-page__inner">
          <AuthCard title="Müfettiş başvurusu">
            {showReceivedNotice && (
              <InfoNotice
                variant="info"
                className="mb-4"
                title="Başvurunuz alındı"
              >
                Başvurunuz kaydedildi. İnceleme tamamlandığında e-posta veya hesap
                sayfanız üzerinden bilgilendirileceksiniz.
              </InfoNotice>
            )}
            <InfoNotice variant="info" title="Başvurunuz incelemede">
              Müfettişlik başvurunuz inceleniyor. Onay sonrası doğrulanmış müfettiş
              yetkisi verilir.
            </InfoNotice>
            {organization && (
              <dl className="account-dl mt-4">
                <tbody>
                  <tr>
                    <th scope="row">Kurum / unvan</th>
                    <td>{organization}</td>
                  </tr>
                  {submittedAt && (
                    <tr>
                      <th scope="row">Başvuru tarihi</th>
                      <td>{formatDateTR(submittedAt)}</td>
                    </tr>
                  )}
                </tbody>
              </dl>
            )}
            <p className="mt-4">
              <Link href="/account" className="text-link hover:underline">
                Hesabıma dön
              </Link>
            </p>
          </AuthCard>
        </div>
      </div>
    );
  }

  if (view === "rejected") {
    const rejectionNote =
      dbApplication?.rejectionReason ??
      dbApplication?.reviewNote ??
      null;

    return (
      <div className="auth-page">
        <div className="site-container auth-page__inner">
          <AuthCard title="Müfettiş başvurusu">
            <InfoNotice variant="warning" title="Başvurunuz reddedildi">
              Müfettişlik başvurunuz incelendi ve reddedildi.
              {rejectionNote ? ` Gerekçe: ${rejectionNote}` : ""}
            </InfoNotice>
            <p className="mt-4">
              <Link href="/account" className="text-link hover:underline">
                Hesabıma dön
              </Link>
            </p>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="site-container auth-page__inner auth-page__inner--wide">
        {showReceivedNotice && (
          <InfoNotice
            variant="info"
            className="mb-4"
            title="E-posta doğrulaması sonrası devam edin"
          >
            Hesabınız oluşturuldu. E-posta doğrulamasından sonra giriş yaparak
            başvurunuzu tamamlayabilirsiniz.
          </InfoNotice>
        )}
        <InspectorApplyForm />
      </div>
    </div>
  );
}
