import type { Metadata } from "next";
import Script from "next/script";

import { absoluteUrl, siteDescription, siteKeywords, siteName, siteUrl } from "@/lib/site";

import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-5BVDMXBN";
const GOOGLE_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID?.trim() ||
  process.env.NEXT_PUBLIC_GTAG_ID?.trim() ||
  process.env.NEXT_PUBLIC_GA_ID?.trim() ||
  "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Poulomi Florique Thanisandra | Price, Brochure, Floor Plans & Site Visit",
    template: "%s | Poulomi Florique Thanisandra",
  },
  description: siteDescription,
  keywords: siteKeywords,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Poulomi Florique Thanisandra | Price, Brochure, Floor Plans & Site Visit",
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/florique/official/hero-official-desktop.jpg"),
        width: 1440,
        height: 810,
        alt: "Poulomi Florique Thanisandra residential towers and clubhouse",
      },
    ],
    locale: "en_IN",
    siteName,
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Poulomi Florique Thanisandra | Price, Brochure, Floor Plans & Site Visit",
    description: siteDescription,
    images: [absoluteUrl("/florique/official/hero-official-desktop.jpg")],
  },
  category: "real estate",
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Thanisandra, Bengaluru",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
    >
    <head>
    {GTM_ID ? (
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({
                'gtm.start': new Date().getTime(),
                event:'gtm.js'
              });
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
    ) : null}
    {GOOGLE_TAG_ID ? (
      <>
        <Script
          id="google-tag-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>
      </>
    ) : null}
    </head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Script id="scroll-reset-guard" strategy="beforeInteractive">
          {`(() => {
            const resetScroll = () => {
              if (window.location.hash) return;
              window.scrollTo(0, 0);
              window.requestAnimationFrame(() => window.scrollTo(0, 0));
              window.setTimeout(() => window.scrollTo(0, 0), 240);
            };

            if ("scrollRestoration" in window.history) {
              window.history.scrollRestoration = "manual";
            }

            window.addEventListener("load", resetScroll, { once: true });
            window.addEventListener("pageshow", resetScroll);
          })();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
