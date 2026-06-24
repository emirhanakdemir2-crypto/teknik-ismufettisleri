"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

import { GENERAL_ASSEMBLY_2026 } from "@/lib/announcements/general-assembly-2026";

const { sessionStorageKey, title, summary, href } = GENERAL_ASSEMBLY_2026;

function markAnnouncementDismissed(): void {
  try {
    sessionStorage.setItem(sessionStorageKey, "1");
  } catch {
    // sessionStorage kullanılamıyorsa sessizce devam et
  }
}

function isAnnouncementDismissed(): boolean {
  try {
    return sessionStorage.getItem(sessionStorageKey) === "1";
  } catch {
    return false;
  }
}

export function AnnouncementModal() {
  const [open, setOpen] = useState(() => !isAnnouncementDismissed());
  const titleId = useId();
  const descriptionId = useId();

  const close = useCallback(() => {
    markAnnouncementDismissed();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!open) {
    return null;
  }

  return (
    <div className="announcement-modal" role="presentation">
      <button
        type="button"
        className="announcement-modal__backdrop"
        aria-label="Duyuruyu kapat"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="announcement-modal__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="announcement-modal__accent" aria-hidden="true" />

        <header className="announcement-modal__header">
          <div className="announcement-modal__labels">
            <span className="announcement-modal__badge">Duyuru</span>
            <time
              className="announcement-modal__date"
              dateTime={GENERAL_ASSEMBLY_2026.meetingDateIso}
            >
              {GENERAL_ASSEMBLY_2026.meetingDateLabel}
            </time>
          </div>
          <h2 id={titleId} className="announcement-modal__title">
            {title}
          </h2>
        </header>

        <div className="announcement-modal__body">
          <p id={descriptionId} className="announcement-modal__summary">
            {summary}
          </p>
        </div>

        <footer className="announcement-modal__footer">
          <Link
            href={href}
            className="btn btn-primary no-underline hover:no-underline"
            onClick={markAnnouncementDismissed}
          >
            Detayları Gör
          </Link>
          <button type="button" className="btn btn-secondary" onClick={close}>
            Kapat
          </button>
        </footer>
      </div>
    </div>
  );
}
