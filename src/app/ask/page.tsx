import { redirect } from "next/navigation";

import { AskForm } from "@/app/ask/ask-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getActiveCategories } from "@/lib/questions/queries";

export default async function AskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const categories = await getActiveCategories();

  return (
    <div className="auth-page">
      <div className="site-container auth-page__inner auth-page__inner--wide">
        <AskForm categories={categories} />
      </div>
    </div>
  );
}
