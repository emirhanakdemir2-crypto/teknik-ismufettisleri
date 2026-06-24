import { GENERAL_ASSEMBLY_2026 } from "@/lib/announcements/general-assembly-2026";

export function GeneralAssembly2026Detail() {
  const { organization, greeting, body, signature, agenda, venue } = GENERAL_ASSEMBLY_2026;

  return (
    <article className="content-card announcement-detail">
      <header className="announcement-detail__header">
        <p className="announcement-detail__org-name">{organization.name}</p>
        <p className="announcement-detail__org-meta">{organization.address}</p>
        <p className="announcement-detail__org-meta">Tel: {organization.phone}</p>
      </header>

      <div className="content-card__body announcement-detail__body">
        <p className="announcement-detail__greeting">{greeting}</p>
        <p className="announcement-detail__paragraph">{body}</p>

        <div className="announcement-detail__signature">
          <p>{signature.organization}</p>
          <p>{signature.board}</p>
        </div>

        <section className="announcement-detail__section" aria-labelledby="announcement-agenda-title">
          <h2 id="announcement-agenda-title" className="announcement-detail__section-title">
            Gündem
          </h2>
          <ol className="announcement-detail__agenda">
            {agenda.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="announcement-detail__section" aria-labelledby="announcement-venue-title">
          <h2 id="announcement-venue-title" className="announcement-detail__section-title">
            {venue.title}
          </h2>
          <address className="announcement-detail__venue">
            {venue.lines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
        </section>
      </div>
    </article>
  );
}
