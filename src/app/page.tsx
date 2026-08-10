import { LandingPage } from "@/components/landing-page";
import { getHomePageSchemaGraph, serializeJsonLd } from "@/lib/schema";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(getHomePageSchemaGraph()) }}
      />
      <LandingPage />
    </>
  );
}
