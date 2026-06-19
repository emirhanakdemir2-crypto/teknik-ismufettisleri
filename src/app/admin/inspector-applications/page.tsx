import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminPanelShell } from "@/components/admin/admin-panel-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getPendingInspectorApplications } from "@/lib/admin/inspector-application-queries";
import { getAdminAccess } from "@/lib/auth/require-admin";
import { redirect } from "next/navigation";

import { PendingApplicationRow } from "./pending-application-row";

export default async function InspectorApplicationsAdminPage() {
  const access = await getAdminAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    return <AdminAccessDenied />;
  }

  const applications = await getPendingInspectorApplications();

  return (
    <div className="site-container py-4 pb-8">
      <AdminPanelShell
        title="Müfettiş Başvuruları"
        description="İncelemede olan müfettiş başvurularını onaylayın veya reddedin."
        user={access.user}
        activePath="/admin/inspector-applications"
        showInspectorApplications
      >
        {applications.length === 0 ? (
          <EmptyState
            title="Bekleyen başvuru yok"
            description="İncelemede müfettiş başvurusu bulunmuyor."
          />
        ) : (
          <div className="forum-table-wrap">
            <table className="forum-table forum-table--responsive">
              <thead>
                <tr>
                  <th scope="col">Başvuran</th>
                  <th scope="col">Kurum / unvan</th>
                  <th scope="col">Başvuru notu</th>
                  <th scope="col" className="last">
                    Tarih
                  </th>
                  <th scope="col" className="num">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <PendingApplicationRow
                    key={application.id}
                    application={application}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanelShell>
    </div>
  );
}
