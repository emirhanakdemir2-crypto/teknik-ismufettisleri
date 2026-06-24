"use client";

import dynamic from "next/dynamic";

export const HomeAnnouncementModal = dynamic(
  () =>
    import("@/components/announcements/announcement-modal").then(
      (module) => module.AnnouncementModal,
    ),
  { ssr: false },
);
