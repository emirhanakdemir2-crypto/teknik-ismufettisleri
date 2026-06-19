import Link from "next/link";

import { InfoNotice } from "@/components/ui/info-notice";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import { formatDateTR } from "@/lib/format/date";

type ApplicationStatusCardProps = {
  user: CurrentUser;
};

export function ApplicationStatusCard({ user }: ApplicationStatusCardProps) {
  const record = user.inspectorApplicationRecord;
  const submittedAt =
    record?.createdAt ??
    user.inspectorApplication.submittedAt ??
    user.createdAt;

  return (
    <InfoNotice variant="info" title="Başvurunuz incelemede">
      <p>
        Müfettişlik başvurunuz inceleniyor. Onay sonrası doğrulanmış müfettiş yetkisi
        verilir ve Müfettiş Paneli erişiminiz açılır.
      </p>
      <dl className="account-dl mt-3">
        <tbody>
          {(record?.organizationOrTitle ?? user.inspectorApplication.organization) && (
            <tr>
              <th scope="row">Kurum / unvan</th>
              <td>
                {record?.organizationOrTitle ?? user.inspectorApplication.organization}
              </td>
            </tr>
          )}
          {submittedAt && (
            <tr>
              <th scope="row">Başvuru tarihi</th>
              <td>{formatDateTR(submittedAt)}</td>
            </tr>
          )}
        </tbody>
      </dl>
      <p className="mt-3">
        <Link href="/inspector/apply" className="text-link hover:underline">
          Başvuru ayrıntıları
        </Link>
      </p>
    </InfoNotice>
  );
}
