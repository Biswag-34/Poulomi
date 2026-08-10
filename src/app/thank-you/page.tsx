import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Thank You | Poulomi Florique",
  },
  description: "Thank you for enquiring about Poulomi Florique.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Thank You | Poulomi Florique",
    description: "Thank you for enquiring about Poulomi Florique.",
    url: "/thank-you",
    siteName: "Poulomi Florique",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Thank You | Poulomi Florique",
    description: "Thank you for enquiring about Poulomi Florique.",
  },
};

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--florique-forest-deep)] text-white">
      <Image
        src="/florique/official/hero-official-desktop.jpg"
        alt="Poulomi Florique tower and clubhouse view"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-32"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,41,33,0.42)_0%,rgba(12,41,33,0.96)_100%)]" />
      <span className="botanical-mask botanical-mask--cornerTop absolute right-[-4rem] top-[-3rem] z-10 h-72 w-72 text-white/18" aria-hidden="true" />
      <span className="botanical-mask botanical-mask--divider absolute bottom-8 left-1/2 z-10 h-36 w-[min(42rem,86vw)] -translate-x-1/2 text-[#f0c9c6]/24" aria-hidden="true" />
      <span className="botanical-mask botanical-mask--branch absolute bottom-[-4rem] left-4 z-10 h-[28rem] w-44 text-white/10" aria-hidden="true" />

      <section className="relative z-10 mx-auto flex min-h-screen w-[min(100%,68rem)] items-center px-5 py-12">
        <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-white/18 bg-white/12 p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
          <span className="botanical-mask botanical-mask--cluster absolute right-[-5rem] top-[-5rem] h-64 w-64 text-white/10" aria-hidden="true" />
          <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-white text-[var(--florique-rose)] shadow-[0_18px_50px_rgba(255,255,255,0.18)]">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[2.6rem] leading-[0.92] md:text-[4.4rem]">
            Thank you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-white/86 md:text-lg">
            Your enquiry has been received. The project team will connect with the current apartment details shortly.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="rose-cta flex min-h-12 items-center justify-center gap-2 px-6 text-sm"
            >
              <Home className="size-4" />
              Back to site
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
