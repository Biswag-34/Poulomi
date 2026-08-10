import Image from "next/image";
import Link from "next/link";

import { micrositeDisclaimer, projectFacts } from "@/data/poulomi-florique";

type LegalSection = {
  title: string;
  body: string;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <span className="botanical-mask botanical-mask--cornerTop legal-botanical legal-botanical--top" aria-hidden="true" />
        <span className="botanical-mask botanical-mask--divider legal-botanical legal-botanical--divider" aria-hidden="true" />
        <Link href="/" className="legal-logo" aria-label="Back to Poulomi Florique homepage">
          <Image
            src={projectFacts.images.logoRose}
            alt="Poulomi Florique"
            width={951}
            height={762}
            sizes="150px"
          />
        </Link>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{intro}</span>
      </section>

      <section className="legal-content">
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}

        <aside className="legal-note">
          <strong>Project reference</strong>
          <p>
            Poulomi Florique is presented as a project enquiry microsite for {projectFacts.locationShort}. RERA Reg. No. {projectFacts.rera.registration}.
          </p>
          <p>{micrositeDisclaimer}</p>
        </aside>

        <nav className="legal-actions" aria-label="Helpful Poulomi Florique links">
          <Link href="/">Back to Homepage</Link>
          <Link href="/#residences">Floor Plans</Link>
          <Link href="/#location">Location</Link>
          <Link href="/#faqs">FAQs</Link>
        </nav>
      </section>
    </main>
  );
}
