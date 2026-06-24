import Link from "next/link";

import { GENERAL_ASSEMBLY_2026 } from "@/lib/announcements/general-assembly-2026";

export function HomeAnnouncementCard() {
  return (
    <section className="announcement-card" aria-labelledby="home-announcement-title">
      <div className="announcement-card__inner">
        <span className="announcement-card__badge">Duyuru</span>
        <h2 id="home-announcement-title" className="announcement-card__title">
          {GENERAL_ASSEMBLY_2026.title}
        </h2>
        <p className="announcement-card__summary">{GENERAL_ASSEMBLY_2026.summary}</p>
        <div className="announcement-card__actions">
          <Link
            href={GENERAL_ASSEMBLY_2026.href}
            className="btn btn-secondary no-underline hover:no-underline"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
