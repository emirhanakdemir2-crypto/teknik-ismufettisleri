import { getRoleDescription, getRoleLabel } from "@/lib/auth/role-labels";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import { formatDateTR } from "@/lib/format/date";

type AccountSummaryCardProps = {
  user: CurrentUser;
};

export function AccountSummaryCard({ user }: AccountSummaryCardProps) {
  return (
    <table className="account-dl">
      <tbody>
        <tr>
          <th scope="row">Ad soyad</th>
          <td>{user.displayName}</td>
        </tr>
        <tr>
          <th scope="row">E-posta</th>
          <td>{user.email}</td>
        </tr>
        <tr>
          <th scope="row">Hesap tipi</th>
          <td>
            <span className="account-role-label">{getRoleLabel(user.role)}</span>
          </td>
        </tr>
        <tr>
          <th scope="row">Yetki özeti</th>
          <td>{getRoleDescription(user.role)}</td>
        </tr>
        <tr>
          <th scope="row">Üyelik tarihi</th>
          <td>{formatDateTR(user.createdAt)}</td>
        </tr>
      </tbody>
    </table>
  );
}
