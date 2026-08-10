import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Page Not Found | Poulomi Florique",
  },
  description: "The requested Poulomi Florique page could not be found.",
  alternates: {
    canonical: "/404",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Page Not Found | Poulomi Florique",
    description: "The requested Poulomi Florique page could not be found.",
    url: "/404",
    siteName: "Poulomi Florique",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Page Not Found | Poulomi Florique",
    description: "The requested Poulomi Florique page could not be found.",
  },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--florique-ivory)] px-5 py-16 text-center text-[var(--florique-ink)]">
      <section className="w-[min(100%,36rem)]">
        <p className="text-sm font-bold uppercase text-[var(--florique-rose)]">404</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-none md:text-7xl">
          Page not found.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#687068] md:text-base">
          This page is not available. Return to the Poulomi Florique overview for floor plans, amenities, location and enquiry details.
        </p>
        <Link href="/" className="rose-cta mt-7 inline-flex min-h-12 px-6">
          Back to site
        </Link>
      </section>
    </main>
  );
}
