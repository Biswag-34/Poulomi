"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Droplets,
  Flower2,
  Leaf,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Trees,
  Waves,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  amenityHighlights,
  consentText,
  faqItems,
  locationClusters,
  micrositeDisclaimer,
  projectFacts,
  units,
  uspHighlights,
} from "@/data/poulomi-florique";
import { getLeadMetadata, trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Unit = (typeof units)[number];
type LeadAction = "price_sheet" | "brochure" | "floor_plan" | "site_visit";

type HiddenLeadFields = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
  landing_page: string;
  referrer: string;
  cta_source: string;
  form_name: string;
  device_type: string;
  timestamp: string;
};

type LeadModal = {
  action: LeadAction;
  ctaSource: string;
  title: string;
  description: string;
  unit: Unit;
};

const hiddenDefaults: HiddenLeadFields = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  gclid: "",
  fbclid: "",
  msclkid: "",
  landing_page: "",
  referrer: "",
  cta_source: "",
  form_name: "",
  device_type: "",
  timestamp: "",
};

const leadFormSchema = z.object({
  lead_name: z.string().trim().min(2, "Please enter your name."),
  lead_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Use numbers only."),
  lead_unit_type: z.string().min(1, "Please choose a residence."),
  consent: z.boolean().refine(Boolean, "Please confirm consent to continue."),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const primaryUnit = units.find((unit) => unit.primary) ?? units[0];

const navItems = [
  ["Residences", "residences"],
  ["Amenities", "amenities"],
  ["Location", "location"],
  ["Plans", "masterplan"],
  ["Enquire", "enquire"],
] as const;

const heroProof = [
  { value: "8.66", label: "Acres" },
  { value: "85%", label: "Open spaces" },
  { value: "720", label: "Residences" },
  { value: "G+27", label: "Tower height" },
] as const;

const researchSignals = [
  {
    title: "Official brand feel",
    text: "Botanical, calm and landscape-led: a world shaped by sunlight, flowers and daily wonder.",
  },
  {
    title: "Buyer proof",
    text: "Fast facts, RERA, floor-plan evidence, location context and brochure-led enquiries stay visible.",
  },
  {
    title: "Luxury shift",
    text: "Less listing clutter, more editorial pacing, deeper imagery and quieter high-value interactions.",
  },
] as const;

const bloomSpecies = [
  "Lotus",
  "Tangidi Puvvu",
  "Firecracker Flower",
  "Crape Jasmine",
  "Star Flower",
  "Peace Lily",
  "Moss Rose",
  "Blue Jacaranda",
] as const;

const gallery = [
  {
    src: "/florique/images/official-section-three.png",
    alt: "Poulomi Florique tower elevation and clubhouse",
    label: "Architecture",
  },
  {
    src: "/florique/images/pool-deck.jpg",
    alt: "Poulomi Florique pool deck with leaf pavilion",
    label: "Pool deck",
  },
  {
    src: "/florique/images/highlights.jpg",
    alt: "Poulomi Florique landscaped amenity impression",
    label: "Bloomscape",
  },
] as const;

const actionCopy: Record<LeadAction, string> = {
  price_sheet: "Request Price Sheet",
  brochure: "Get Brochure",
  floor_plan: "View Floor Plan",
  site_visit: "Book Site Visit",
};

function collectLeadContext(ctaSource: string, formName: string): HiddenLeadFields {
  if (typeof window === "undefined") {
    return hiddenDefaults;
  }

  const params = new URLSearchParams(window.location.search);
  const width = window.innerWidth;
  const deviceType = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

  return {
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_term: params.get("utm_term") ?? "",
    utm_content: params.get("utm_content") ?? "",
    gclid: params.get("gclid") ?? "",
    fbclid: params.get("fbclid") ?? "",
    msclkid: params.get("msclkid") ?? "",
    landing_page: window.location.href,
    referrer: document.referrer,
    cta_source: ctaSource,
    form_name: formName,
    device_type: deviceType,
    timestamp: new Date().toISOString(),
  };
}

async function submitLead(payload: Record<string, unknown>) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Lead submission failed");
  }

  return response.json();
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand-mark ${light ? "text-white" : "text-[var(--florique-ink)]"}`}>
      <span className="brand-mark__symbol" aria-hidden="true">
        <Flower2 className="size-5" />
      </span>
      <span>
        <span className="block font-semibold leading-none">Poulomi</span>
        <span className="block text-[0.76rem] font-semibold leading-none text-[var(--florique-red)]">
          Florique
        </span>
      </span>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-[family-name:var(--font-display)] text-[2.2rem] leading-[0.98] text-[var(--florique-ink)] sm:text-[2.8rem] lg:text-[4.4rem]">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-pretty text-base leading-7 text-[var(--florique-muted)] lg:text-lg lg:leading-8">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function LeadForm({
  action,
  ctaSource,
  formName,
  selectedUnit,
  compact = false,
  redirectOnSuccess = false,
  onDone,
}: {
  action: LeadAction;
  ctaSource: string;
  formName: string;
  selectedUnit: Unit;
  compact?: boolean;
  redirectOnSuccess?: boolean;
  onDone?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      lead_name: "",
      lead_phone: "",
      lead_unit_type: selectedUnit.label,
      consent: true,
    },
  });

  useEffect(() => {
    setValue("lead_unit_type", selectedUnit.label);
  }, [selectedUnit.label, setValue]);

  const onFocus = () => {
    if (started) {
      return;
    }

    setStarted(true);
    trackEvent("lead_form_start", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: action,
      unit_type: selectedUnit.label,
    });
  };

  const onSubmit = async (values: LeadFormValues) => {
    setStatus("idle");
    const context = collectLeadContext(ctaSource, formName);

    trackEvent("lead_form_submit", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: action,
      unit_type: values.lead_unit_type,
    });

    try {
      await submitLead({
        ...context,
        timestamp: new Date().toISOString(),
        lead_action: action,
        lead_name: values.lead_name,
        lead_phone: values.lead_phone,
        lead_unit_type: values.lead_unit_type,
        name: values.lead_name,
        phone: values.lead_phone,
        interestedIn: values.lead_unit_type,
        preferredAction: action,
        source: ctaSource,
        consent: values.consent,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: action,
          unitSelected: values.lead_unit_type,
        }),
      });

      setStatus("success");
      reset({
        lead_name: "",
        lead_phone: "",
        lead_unit_type: selectedUnit.label,
        consent: true,
      });
      onDone?.();

      if (redirectOnSuccess) {
        window.location.assign("/thank-you");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className={`lead-form ${compact ? "lead-form--compact" : ""}`} onFocus={onFocus} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="field-label">
          <span>Name</span>
          <input className="lux-input" autoComplete="name" {...register("lead_name")} />
          {errors.lead_name ? <small>{errors.lead_name.message}</small> : null}
        </label>
        <label className="field-label">
          <span>Phone</span>
          <input className="lux-input" autoComplete="tel" inputMode="tel" type="tel" {...register("lead_phone")} />
          {errors.lead_phone ? <small>{errors.lead_phone.message}</small> : null}
        </label>
      </div>

      <label className="field-label">
        <span>Interested in</span>
        <span className="relative block">
          <select className="lux-input appearance-none pr-11" {...register("lead_unit_type")}>
            {units.map((unit) => (
              <option key={unit.slug} value={unit.label}>
                {unit.label} - {unit.saleableArea.toLocaleString("en-IN")} sq ft
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--florique-red)]" />
        </span>
        {errors.lead_unit_type ? <small>{errors.lead_unit_type.message}</small> : null}
      </label>

      <label className="consent-row">
        <input type="checkbox" {...register("consent")} />
        <span>{consentText}</span>
      </label>
      {errors.consent ? <small className="form-small-error">{errors.consent.message}</small> : null}

      <Button type="submit" className="lux-button w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : actionCopy[action]}
        <ArrowRight className="size-4" />
      </Button>

      {status === "success" && !redirectOnSuccess ? (
        <p className="form-status">Thank you. The Florique team will connect shortly.</p>
      ) : null}
      {status === "error" ? (
        <p className="form-status form-status--error">We could not submit this just now. Please try again.</p>
      ) : null}
    </form>
  );
}

export function LandingPage() {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(primaryUnit);
  const [leadModal, setLeadModal] = useState<LeadModal | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);

  const featuredAmenities = useMemo(() => amenityHighlights.slice(0, 8), []);

  const openLeadModal = (
    action: LeadAction,
    ctaSource: string,
    title: string,
    description: string,
    unit = selectedUnit,
  ) => {
    trackEvent("lead_modal_open", {
      lead_action: action,
      cta_source: ctaSource,
      unit_type: unit.label,
    });
    setLeadModal({ action, ctaSource, title, description, unit });
  };

  const scrollToSection = (id: string, ctaSource: string) => {
    setMobileMenuOpen(false);
    trackEvent("navigation_click", { target_section: id, cta_source: ctaSource });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="lux-page">
      <header className="site-header">
        <div className="site-shell flex min-h-16 items-center justify-between gap-4">
          <button type="button" className="text-left" onClick={() => scrollToSection("top", "brand")}>
            <BrandMark />
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map(([label, id]) => (
              <button key={id} type="button" className="nav-link" onClick={() => scrollToSection(id, `nav-${id}`)}>
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a className="phone-pill" href="tel:+919119239119">
              <Phone className="size-4" />
              +91 91192 39119
            </a>
            <Button className="lux-button" onClick={() => scrollToSection("enquire", "header-enquiry")}>
              Enquire
            </Button>
          </div>

          <button
            type="button"
            className="icon-button lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="site-shell pb-4 lg:hidden">
            <div className="mobile-menu">
              {navItems.map(([label, id]) => (
                <button key={id} type="button" onClick={() => scrollToSection(id, `mobile-nav-${id}`)}>
                  {label}
                </button>
              ))}
              <a href="tel:+919119239119">Call +91 91192 39119</a>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="absolute inset-0">
            <Image
              src="/florique/hero/official-mobile.jpg"
              alt="Poulomi Florique landscaped courtyard and pool"
              fill
              priority
              sizes="100vw"
              className="object-cover sm:hidden"
            />
            <Image
              src="/florique/hero/official-tablet.jpg"
              alt="Poulomi Florique landscaped courtyard and pool"
              fill
              priority
              sizes="100vw"
              className="hidden object-cover sm:block lg:hidden"
            />
            <Image
              src="/florique/hero/official-desktop.jpg"
              alt="Poulomi Florique landscaped courtyard and pool"
              fill
              priority
              sizes="100vw"
              className="hidden object-cover lg:block"
            />
            <div className="hero-scrim" />
          </div>

          <div className="site-shell relative z-10 grid min-h-[calc(100svh-4rem)] items-end gap-6 pb-8 pt-24 lg:grid-cols-[1.08fr_0.72fr] lg:items-center lg:pb-16 lg:pt-28">
            <div className="max-w-4xl text-white">
              <div className="hero-kicker">
                <ShieldCheck className="size-4" />
                RERA {projectFacts.rera.registration}
              </div>
              <h1 className="mt-5 text-balance font-[family-name:var(--font-display)] text-[3.15rem] leading-[0.9] sm:text-[4.8rem] lg:text-[7.6rem]">
                A World that Blossoms Around You.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/86 sm:text-lg lg:text-xl lg:leading-8">
                Premium 3 BHK and 3.5 BHK residences in Thanisandra, Bengaluru, shaped around open landscapes, refined amenities and North Bengaluru connectivity.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {heroProof.map((stat) => (
                  <div key={stat.label} className="hero-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button className="lux-button lux-button--light" onClick={() => scrollToSection("enquire", "hero-site-visit")}>
                  Book Site Visit
                  <CalendarDays className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="glass-button"
                  onClick={() =>
                    openLeadModal(
                      "brochure",
                      "hero-brochure",
                      "Get the Florique brochure",
                      "Share your details to receive the brochure and current project information.",
                    )
                  }
                >
                  Download Brochure
                  <Download className="size-4" />
                </Button>
              </div>
            </div>

            <aside className="hero-enquiry" id="main-enquiry-form">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Private enquiry desk</p>
                  <h2 className="mt-2 text-[1.65rem] font-semibold leading-tight text-[var(--florique-ink)]">
                    Receive price, floor plan and availability.
                  </h2>
                </div>
                <Sparkles className="mt-1 size-6 text-[var(--florique-red)]" />
              </div>
              <LeadForm
                action="price_sheet"
                ctaSource="hero-form"
                formName="hero"
                selectedUnit={selectedUnit}
                compact
                redirectOnSuccess
              />
            </aside>
          </div>
        </section>

        <section className="research-band">
          <div className="site-shell grid gap-4 lg:grid-cols-3">
            {researchSignals.map((item) => (
              <article key={item.title} className="research-note">
                <p>{item.title}</p>
                <span>{item.text}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad">
          <div className="site-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Design map"
                title="A premium journey built around calm proof."
                text="Florique should feel like a cultivated estate first and a sales page second. The design keeps buyer-critical details near the surface while letting the project imagery, landscape planning and bloomscape idea carry the emotion."
              />
              <div className="mt-7 grid gap-3">
                {uspHighlights.slice(0, 4).map((item) => (
                  <div key={item.title} className="proof-row">
                    <Check className="size-5" />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="image-stack">
              <div className="image-stack__main">
                <Image
                  src="/florique/images/official-section-three.png"
                  alt="Poulomi Florique residential towers"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="image-stack__caption">
                <Building2 className="size-5" />
                Four residential towers with a landscape-first podium and standalone clubhouse life.
              </div>
            </div>
          </div>
        </section>

        <section id="residences" className="section-pad bg-[var(--florique-cream)]">
          <div className="site-shell">
            <SectionIntro
              eyebrow="Residences"
              title="Spacious homes for families who have outgrown compromise."
              text="The unit mix is focused on larger 3 BHK, 3 BHK + Maid and 3.5 BHK + Study + Maid residences from 1,585 to 2,740 sq ft."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="unit-list" role="list" aria-label="Available residences">
                {units.map((unit) => (
                  <button
                    key={unit.slug}
                    type="button"
                    className={`unit-option ${selectedUnit.slug === unit.slug ? "is-selected" : ""}`}
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <span>
                      <strong>{unit.label}</strong>
                      <small>{unit.buyerFit}</small>
                    </span>
                    <span>{unit.saleableArea.toLocaleString("en-IN")} sq ft</span>
                  </button>
                ))}
              </div>

              <article className="unit-feature">
                <div className="relative min-h-[19rem] overflow-hidden rounded-[1.2rem] bg-white sm:min-h-[28rem]">
                  <Image
                    src={selectedUnit.image}
                    alt={`${selectedUnit.label} floor plan at Poulomi Florique`}
                    fill
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="object-contain p-3"
                  />
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="eyebrow">Selected residence</p>
                    <h3 className="mt-2 text-3xl font-semibold text-[var(--florique-ink)]">{selectedUnit.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--florique-muted)]">
                      {selectedUnit.saleableArea.toLocaleString("en-IN")} sq ft super built-up area. {selectedUnit.buyerFit}.
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-[var(--florique-ink)] p-4 text-white">
                    <small className="block text-white/70">Indicative price</small>
                    <strong className="mt-1 block text-2xl">{selectedUnit.price}</strong>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="lux-button"
                    onClick={() =>
                      openLeadModal(
                        "floor_plan",
                        "unit-floor-plan",
                        `View ${selectedUnit.label} floor plan`,
                        "Share your details to receive the selected floor plan and current availability.",
                        selectedUnit,
                      )
                    }
                  >
                    View Floor Plan
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="outline-lux"
                    onClick={() =>
                      openLeadModal(
                        "price_sheet",
                        "unit-price-sheet",
                        "Request current price sheet",
                        "Get the latest floor-wise pricing, preferred location charges and availability.",
                        selectedUnit,
                      )
                    }
                  >
                    Request Price Sheet
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="amenities" className="section-pad">
          <div className="site-shell">
            <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
              <SectionIntro
                eyebrow="Bloomscapes and amenities"
                title="A resort-like everyday, set inside flowering landscapes."
                text="The official brand story gives nature center stage: 20 different floral species, open courtyards, water-sensitive planning, wellness spaces and an active sports zone."
              />
              <div className="bloom-panel">
                <Leaf className="size-7 text-[var(--florique-red)]" />
                <p>Featured bloomscape palette</p>
                <div>
                  {bloomSpecies.map((flower) => (
                    <span key={flower}>{flower}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredAmenities.map((item, index) => {
                const Icon = index % 3 === 0 ? Waves : index % 3 === 1 ? Trees : Droplets;

                return (
                  <article key={item.label} className="amenity-card">
                    <Icon className="size-7 text-[var(--florique-red)]" />
                    <h3>{item.label}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="gallery-strip mt-8">
              {gallery.map((item) => (
                <figure key={item.src}>
                  <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 86vw" className="object-cover" />
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="masterplan" className="section-pad bg-[var(--florique-green)] text-white">
          <div className="site-shell grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <p className="eyebrow eyebrow--light">Master plan</p>
              <h2 className="mt-3 text-balance font-[family-name:var(--font-display)] text-[2.25rem] leading-[0.98] sm:text-[3rem] lg:text-[4.8rem]">
                Balance, movement and quiet corners in one landscape.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/78 lg:text-lg lg:leading-8">
                The plan places towers around a central amenity garden, with pool decks, sports courts, play areas, gardens, plazas and gathering spaces arranged as a daily walking circuit.
              </p>
              <div className="mt-7 grid gap-3">
                {[
                  "Vehicle-free elevated podium",
                  "25M lap pool and pool pavilion",
                  "Dedicated futsal, tennis, basketball and pickleball courts",
                  "Butterfly, fragrant, pebble, herb and reflexology gardens",
                ].map((item) => (
                  <div key={item} className="dark-proof-row">
                    <Check className="size-5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" className="masterplan-frame" onClick={() => setMasterPlanOpen(true)}>
              <Image
                src="/florique/images/masterplan.jpg"
                alt="Poulomi Florique master plan"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-top"
              />
              <span>Tap to enlarge master plan</span>
            </button>
          </div>
        </section>

        <section id="location" className="section-pad">
          <div className="site-shell">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <SectionIntro
                  eyebrow="Location"
                  title="Rooted in North Bengaluru convenience."
                  text="Florique is located at Kannur, Thanisandra, with access to schools, healthcare, shopping, tech parks, ORR and the airport corridor."
                />
                <div className="map-frame mt-7">
                  <Image
                    src="/florique/location/map-mobile.jpg"
                    alt="Poulomi Florique location map"
                    fill
                    sizes="100vw"
                    className="object-contain sm:hidden"
                  />
                  <Image
                    src="/florique/location/map-tablet.jpg"
                    alt="Poulomi Florique location map"
                    fill
                    sizes="100vw"
                    className="hidden object-contain sm:block lg:hidden"
                  />
                  <Image
                    src="/florique/location/map-desktop.jpg"
                    alt="Poulomi Florique location map"
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    className="hidden object-contain lg:block"
                  />
                </div>
              </div>

              <div className="location-list">
                {locationClusters.map((cluster) => (
                  <details key={cluster.label} open={cluster.label === "Education"}>
                    <summary>
                      <span>
                        <MapPin className="size-4" />
                        {cluster.label}
                      </span>
                      <ChevronDown className="size-4" />
                    </summary>
                    <div>
                      {cluster.items.map((item) => (
                        <p key={item.name}>
                          <span>{item.name}</span>
                          <strong>{item.time}</strong>
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="enquire" className="section-pad bg-[var(--florique-cream)]">
          <div className="site-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <SectionIntro
                eyebrow="Questions and visit"
                title="Plan a private walkthrough of Florique."
                text="Use the form to request current pricing, a guided site visit or the complete brochure. Project details are subject to verification with Poulomi and the official RERA portal."
              />
              <div className="faq-list mt-7">
                {faqItems.map((item) => (
                  <details key={item.question}>
                    <summary>
                      {item.question}
                      <ChevronDown className="size-4" />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="final-form">
              <BrandMark />
              <h2>Schedule project site visit</h2>
              <p>Share your details and the Florique enquiry team will help with brochure, pricing and available floor plans.</p>
              <LeadForm
                action="site_visit"
                ctaSource="final-form"
                formName="final"
                selectedUnit={selectedUnit}
                redirectOnSuccess
              />
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <BrandMark light />
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Poulomi Florique, {projectFacts.locationLong}. RERA {projectFacts.rera.registration}. Contact: floriquesales@poulomi.in, +91 91192 39119.
            </p>
            <p className="mt-4 text-xs leading-6 text-white/52">{micrositeDisclaimer}</p>
          </div>
          <div className="footer-links">
            {navItems.map(([label, id]) => (
              <button key={id} type="button" onClick={() => scrollToSection(id, `footer-${id}`)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <div className="mobile-sticky">
        <button type="button" onClick={() => scrollToSection("main-enquiry-form", "sticky-enquiry")}>
          <Phone className="size-5" />
          Enquire
        </button>
        <button
          type="button"
          onClick={() =>
            openLeadModal(
              "brochure",
              "sticky-brochure",
              "Get the Florique brochure",
              "Share your details to receive the brochure and project information.",
            )
          }
        >
          <Download className="size-5" />
          Brochure
        </button>
      </div>

      <Dialog open={Boolean(leadModal)} onOpenChange={(open) => !open && setLeadModal(null)}>
        <DialogContent>
          {leadModal ? (
            <>
              <DialogHeader>
                <BrandMark />
                <DialogTitle>{leadModal.title}</DialogTitle>
                <DialogDescription>{leadModal.description}</DialogDescription>
              </DialogHeader>
              <LeadForm
                action={leadModal.action}
                ctaSource={leadModal.ctaSource}
                formName="modal"
                selectedUnit={leadModal.unit}
                onDone={() => setLeadModal(null)}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {masterPlanOpen ? (
        <div className="plan-lightbox" role="dialog" aria-modal="true" aria-label="Poulomi Florique master plan">
          <button type="button" aria-label="Close master plan" onClick={() => setMasterPlanOpen(false)}>
            <X className="size-5" />
          </button>
          <div>
            <Image
              src="/florique/images/masterplan.jpg"
              alt="Poulomi Florique enlarged master plan"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
