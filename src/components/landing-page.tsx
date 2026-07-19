"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  Check,
  Download,
  Eye,
  Leaf,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
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
  proofFacts,
  residenceFamilies,
  trustItems,
  uspHighlights,
} from "@/data/poulomi-florique";
import { getLeadMetadata, trackEvent } from "@/lib/analytics";

type LeadIntent = "site_visit" | "price_sheet" | "brochure" | "floor_plan" | "general_enquiry";
type ResidenceFamily = (typeof residenceFamilies)[number];

type LeadOverlay = {
  intent: LeadIntent;
  ctaSource: string;
  title: string;
  description: string;
  selectedResidence?: ResidenceFamily;
};

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number."),
  email: z.string().trim().email("Enter a valid email.").optional().or(z.literal("")),
  configuration: z.string().min(1, "Choose a configuration."),
  preferredDate: z.string().optional(),
  message: z.string().trim().max(400, "Keep the message under 400 characters.").optional(),
  consent: z.boolean().refine(Boolean, "Please confirm consent."),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const actionLabels: Record<LeadIntent, string> = {
  site_visit: "Schedule My Visit",
  price_sheet: "Request Current Price",
  brochure: "Download Brochure",
  floor_plan: "View Plan Details",
  general_enquiry: "Send Enquiry",
};

const masterPlanPoints = [
  "Arrival Plaza",
  "Clubhouse",
  "Central Greens",
  "Pool & Deck",
  "Sports Zone",
  "Children's Play Area",
  "Walking Trail",
] as const;

function normalisePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const number = digits.length > 10 ? digits.slice(-10) : digits;
  return `+91${number}`;
}

function captureAttribution(ctaSource: string, formName: string) {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
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
    device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
    timestamp: new Date().toISOString(),
  };
}

async function submitLead(payload: Record<string, unknown>) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Lead submission failed");
  }

  return response.json();
}

function BrandWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-wordmark ${light ? "brand-wordmark--light" : ""}`}>
      <span>Poulomi</span>
      <span>Florique</span>
    </span>
  );
}

function BotanicalMark() {
  return (
    <Image
      src="/florique/decorative/florique-flower-outline.svg"
      alt=""
      width={22}
      height={22}
      aria-hidden="true"
    />
  );
}

function SectionLabel({ index, eyebrow }: { index: string; eyebrow: string }) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <i />
      <p>{eyebrow}</p>
    </div>
  );
}

function LeadForm({
  intent,
  ctaSource,
  formName,
  selectedResidence,
  compact = false,
  onSuccess,
}: {
  intent: LeadIntent;
  ctaSource: string;
  formName: string;
  selectedResidence?: ResidenceFamily;
  compact?: boolean;
  onSuccess?: () => void;
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
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      configuration: selectedResidence?.label ?? residenceFamilies[0].label,
      preferredDate: "",
      message: "",
      consent: true,
    },
  });

  useEffect(() => {
    if (selectedResidence) {
      setValue("configuration", selectedResidence.label);
    }
  }, [selectedResidence, setValue]);

  const onFocus = () => {
    if (started) {
      return;
    }

    setStarted(true);
    trackEvent("lead_form_start", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: intent,
      configuration: selectedResidence?.label,
    });
  };

  const onSubmit = async (values: LeadFormValues) => {
    setStatus("idle");

    try {
      const phone = normalisePhone(values.phone);
      await submitLead({
        ...captureAttribution(ctaSource, formName),
        lead_action: intent,
        lead_name: values.name,
        lead_phone: phone,
        lead_unit_type: values.configuration,
        lead_callback_time: values.preferredDate,
        name: values.name,
        phone,
        email: values.email,
        interestedIn: values.configuration,
        preferredAction: intent,
        callbackTime: values.preferredDate,
        note: values.message,
        source: ctaSource,
        consent: values.consent,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: intent,
          unitSelected: values.configuration,
        }),
      });

      trackEvent("lead_submit_success", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: intent,
        configuration: values.configuration,
      });

      setStatus("success");
      reset({
        name: "",
        phone: "",
        email: "",
        configuration: selectedResidence?.label ?? residenceFamilies[0].label,
        preferredDate: "",
        message: "",
        consent: true,
      });
      onSuccess?.();
    } catch {
      trackEvent("lead_submit_error", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: intent,
      });
      setStatus("error");
    }
  };

  return (
    <form className={`visit-form ${compact ? "visit-form--compact" : ""}`} onFocus={onFocus} onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <label>
          <span>Full Name</span>
          <input autoComplete="name" {...register("name")} />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>
        <label>
          <span>Phone Number</span>
          <input autoComplete="tel" inputMode="tel" type="tel" {...register("phone")} />
          {errors.phone ? <small>{errors.phone.message}</small> : null}
        </label>
        <label>
          <span>Email Address</span>
          <input autoComplete="email" inputMode="email" type="email" {...register("email")} />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>
        <label>
          <span>Preferred Date</span>
          <input type="date" {...register("preferredDate")} />
        </label>
      </div>

      <div className="form-grid form-grid--wide">
        <label>
          <span>I&apos;m interested in</span>
          <select {...register("configuration")}>
            {residenceFamilies.map((family) => (
              <option key={family.slug} value={family.label}>
                {family.label}
              </option>
            ))}
          </select>
          {errors.configuration ? <small>{errors.configuration.message}</small> : null}
        </label>
        <label>
          <span>Message (Optional)</span>
          <input {...register("message")} />
          {errors.message ? <small>{errors.message.message}</small> : null}
        </label>
      </div>

      <label className="consent-line">
        <input type="checkbox" {...register("consent")} />
        <span>{consentText}</span>
      </label>
      {errors.consent ? <small className="form-error">{errors.consent.message}</small> : null}

      <button type="submit" className="rose-cta" disabled={isSubmitting}>
        <BotanicalMark />
        {isSubmitting ? "Scheduling..." : actionLabels[intent]}
      </button>

      {status === "success" ? (
        <p className="form-success" role="status">
          Thank you. Your request has been received.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form-error" role="status">
          We could not submit right now. Please try again.
        </p>
      ) : null}
    </form>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedResidence, setSelectedResidence] = useState<ResidenceFamily>(residenceFamilies[0]);
  const [leadOverlay, setLeadOverlay] = useState<LeadOverlay | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  const [locationTab, setLocationTab] = useState<(typeof locationClusters)[number]["label"]>(
    locationClusters[0].label,
  );
  const [openFaq, setOpenFaq] = useState<string>(faqItems[0].question);

  const selectedLocation = useMemo(
    () => locationClusters.find((cluster) => cluster.label === locationTab) ?? locationClusters[0],
    [locationTab],
  );

  useEffect(() => {
    document.body.style.overflow = menuOpen || leadOverlay || planOpen || masterPlanOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [leadOverlay, masterPlanOpen, menuOpen, planOpen]);

  const scrollTo = (id: string, source: string) => {
    setMenuOpen(false);
    trackEvent("navigation_click", { target_section: id, cta_source: source });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openLead = (overlay: LeadOverlay) => {
    setMenuOpen(false);
    trackEvent("lead_sheet_open", {
      lead_action: overlay.intent,
      cta_source: overlay.ctaSource,
      configuration: overlay.selectedResidence?.label,
    });
    setLeadOverlay(overlay);
  };

  return (
    <div className="florique-page">
      <header className="florique-header">
        <div className="announcement">
          <span>Exclusive preview for a select few. Private appointments only.</span>
          <span>RERA Reg. No. {projectFacts.rera.registration}</span>
        </div>
        <div className="nav-shell">
          <button type="button" className="brand-button" onClick={() => scrollTo("top", "brand")}>
            <BrandWordmark />
          </button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button type="button" onClick={() => scrollTo("residences", "nav-residences")}>Residences</button>
            <button type="button" onClick={() => scrollTo("amenities", "nav-amenities")}>Amenities</button>
            <button type="button" onClick={() => scrollTo("location", "nav-location")}>Location</button>
            <button type="button" onClick={() => scrollTo("trust", "nav-about")}>About Poulomi</button>
          </nav>
          <button
            type="button"
            className="outline-nav-cta"
            onClick={() =>
              openLead({
                intent: "site_visit",
                ctaSource: "desktop-header",
                title: "Book a private viewing",
                description: "Share your preferred details and the Florique team will coordinate your visit.",
                selectedResidence,
              })
            }
          >
            Book a Private Viewing
          </button>
          <button type="button" className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <picture>
            <source media="(min-width: 1024px)" srcSet={projectFacts.images.heroDesktop} />
            <source media="(min-width: 768px)" srcSet={projectFacts.images.heroTablet} />
            <img src={projectFacts.images.heroMobile} alt="Poulomi Florique landscaped residential tower at dusk" />
          </picture>
          <div className="hero-card">
            <Image className="card-botanical" src="/florique/decorative/botanical-corner-top-right.svg" alt="" width={260} height={260} aria-hidden="true" />
            <p>Thanisandra · North Bengaluru</p>
            <h1>Where architecture blooms.</h1>
            <i />
            <span>Botanical living, thoughtfully designed. Homes that feel private. Spaces that inspire.</span>
            <div className="hero-actions">
              <button type="button" className="rose-cta" onClick={() => scrollTo("residences", "hero-explore-residences")}>
                <BotanicalMark />
                Explore Residences
              </button>
              <button
                type="button"
                className="text-cta"
                onClick={() =>
                  openLead({
                    intent: "brochure",
                    ctaSource: "hero-brochure",
                    title: "Download brochure",
                    description: "Share your details to receive the latest Florique brochure.",
                    selectedResidence,
                  })
                }
              >
                Download Brochure
                <Download size={16} />
              </button>
            </div>
            <div className="mobile-quick-facts">
              <span><Building2 /> 3 BHK-led homes</span>
              <span><ShieldCheck /> 1,585-2,740 sq ft</span>
              <span><Leaf /> Curated landscapes</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>01</span><i /> <small>/10</small></div>
          <button
            type="button"
            className="enquire-tab"
            onClick={() =>
              openLead({
                intent: "general_enquiry",
                ctaSource: "hero-enquire-tab",
                title: "Enquire now",
                description: "Tell us what you would like to know about Poulomi Florique.",
                selectedResidence,
              })
            }
          >
            <BotanicalMark />
            Enquire Now
          </button>
        </section>

        <section className="proof-ribbon" aria-label="Project proof points">
          <div className="proof-track">
            {proofFacts.map((fact) => (
              <article key={fact.label}>
                <Leaf />
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="editorial-section story-section">
          <SectionLabel index="02" eyebrow="The Florique Life" />
          <div className="story-copy">
            <h2>A world that blossoms around you.</h2>
            <p>
              Poulomi Florique is a sanctuary of green and light. Where modern architecture rises gently from landscaped gardens, and every space is designed to help you live well, every day.
            </p>
            <button type="button" className="text-cta" onClick={() => scrollTo("masterplan", "story-discover")}>
              Discover the Story <ArrowRight size={16} />
            </button>
          </div>
          <div className="story-media">
            <Image src={projectFacts.images.arrivalDesktop} alt="Poulomi Florique arrival landscape artistic impression" fill sizes="(min-width: 1024px) 54vw, 100vw" className="story-main" />
            <Image src={projectFacts.images.botanicalMacro} alt="" width={180} height={230} className="story-inset" aria-hidden="true" />
          </div>
        </section>

        <section id="residences" className="editorial-section residences-section">
          <SectionLabel index="03" eyebrow="Choose your home" />
          <div className="residence-intro">
            <h2>Residences, crafted to complement your life.</h2>
            <div className="residence-tabs" role="tablist" aria-label="Residence families">
              {residenceFamilies.map((family) => (
                <button
                  key={family.slug}
                  type="button"
                  role="tab"
                  aria-selected={family.slug === selectedResidence.slug}
                  className={family.slug === selectedResidence.slug ? "active" : ""}
                  onClick={() => {
                    setSelectedResidence(family);
                    trackEvent("residence_family_select", { residence: family.slug });
                  }}
                >
                  <strong>{family.label}</strong>
                  <span>{family.areaRange}</span>
                </button>
              ))}
            </div>
          </div>
          <article className="plan-card">
            <Image src="/florique/decorative/botanical-branch-vertical.svg" alt="" width={118} height={260} className="plan-botanical" aria-hidden="true" />
            <div>
              <p>{selectedResidence.label}</p>
              <h3>{selectedResidence.areaRange}</h3>
              <span>{selectedResidence.summary}</span>
              <button type="button" className="text-cta" onClick={() => setPlanOpen(true)}>
                View Plan Details <ArrowRight size={16} />
              </button>
            </div>
            <button type="button" className="plan-image-button" onClick={() => setPlanOpen(true)}>
              <Image src={selectedResidence.image} alt={`${selectedResidence.label} floor plan`} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain" />
            </button>
          </article>
        </section>

        <section id="amenities" className="editorial-section amenities-section">
          <SectionLabel index="04" eyebrow="Amenities bloomscape" />
          <div className="amenity-copy">
            <h2>Spaces that nourish every part of you.</h2>
          </div>
          <div className="amenity-track">
            {amenityHighlights.slice(0, 4).map((amenity) => (
              <article key={amenity.label} className="amenity-card">
                <Image src={amenity.image} alt={amenity.label} fill sizes="(min-width: 1024px) 22vw, 70vw" className="object-cover" />
                <div>
                  <strong>{amenity.label}</strong>
                  <span>{amenity.text}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="masterplan" className="editorial-section masterplan-section">
          <SectionLabel index="05" eyebrow="Master plan" />
          <div className="master-copy">
            <h2>Designed with green at the heart.</h2>
            <ul>
              {uspHighlights.map((item) => (
                <li key={item.title}><Check size={15} /> {item.title}</li>
              ))}
            </ul>
            <button type="button" className="text-cta" onClick={() => setMasterPlanOpen(true)}>
              Explore Master Plan <Download size={15} />
            </button>
          </div>
          <button type="button" className="master-image" onClick={() => setMasterPlanOpen(true)}>
            <Image src={projectFacts.images.masterPlan} alt="Poulomi Florique official master plan" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </button>
          <aside className="master-legend">
            {masterPlanPoints.map((point, index) => (
              <button key={point} type="button" onClick={() => trackEvent("masterplan_hotspot_select", { point })}>
                <span>{index + 1}</span>
                {point}
              </button>
            ))}
            <button type="button" className="legend-view" onClick={() => setMasterPlanOpen(true)}>View Legend <Eye size={14} /></button>
          </aside>
        </section>

        <section id="location" className="editorial-section location-section">
          <SectionLabel index="06" eyebrow="North Bengaluru" />
          <div className="location-copy">
            <h2>Well connected. Well placed.</h2>
            <p>Located in Thanisandra, close to major business hubs, schools, healthcare and everyday conveniences.</p>
          </div>
          <div className="location-map">
            <Image src={projectFacts.images.locationMobile} alt="Poulomi Florique location map" fill sizes="100vw" className="object-contain sm:hidden" />
            <Image src={projectFacts.images.locationTablet} alt="Poulomi Florique location map" fill sizes="100vw" className="hidden object-contain sm:block lg:hidden" />
            <Image src={projectFacts.images.locationDesktop} alt="Poulomi Florique location map" fill sizes="(min-width: 1024px) 46vw, 100vw" className="hidden object-contain lg:block" />
          </div>
          <aside className="commute-card">
            <p>Commute from Florique</p>
            <div className="commute-tabs">
              {locationClusters.map((cluster) => (
                <button
                  key={cluster.label}
                  type="button"
                  className={cluster.label === locationTab ? "active" : ""}
                  onClick={() => {
                    setLocationTab(cluster.label);
                    trackEvent("location_category_select", { category: cluster.label });
                  }}
                >
                  {cluster.label}
                </button>
              ))}
            </div>
            <div className="commute-list">
              {selectedLocation.items.map((item) => (
                <span key={item.name}>
                  {item.name}
                  <strong>{item.time}</strong>
                </span>
              ))}
            </div>
          </aside>
        </section>

        <section id="trust" className="trust-section">
          <SectionLabel index="07" eyebrow="Built on trust" />
          <div className="trust-brand">
            <BrandWordmark />
            <p>Poulomi is committed to crafting thoughtful communities defined by design, quality and trust.</p>
          </div>
          <div className="trust-icons">
            {trustItems.map((item) => (
              <span key={item}><Leaf /> {item}</span>
            ))}
          </div>
          <div className="rera-card">
            <p>RERA Reg. No.</p>
            <strong>{projectFacts.rera.registration}</strong>
            <Link href={projectFacts.rera.url} target="_blank" rel="noreferrer" onClick={() => trackEvent("rera_link_click", {})}>
              View RERA Details <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section id="private-viewing" className="faq-form-section">
          <SectionLabel index="08" eyebrow="Frequently asked questions" />
          <div className="faq-list">
            {faqItems.map((faq) => {
              const open = openFaq === faq.question;
              return (
                <article key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => {
                      setOpenFaq(open ? "" : faq.question);
                      trackEvent("faq_open", { question: faq.question });
                    }}
                  >
                    {faq.question}
                    <span>{open ? "-" : "+"}</span>
                  </button>
                  {open ? <p>{faq.answer}</p> : null}
                </article>
              );
            })}
          </div>
          <div className="green-quote">
            <Image src="/florique/decorative/botanical-cluster-large.svg" alt="" width={210} height={210} aria-hidden="true" />
            <h2>Homes that bloom with possibility.</h2>
            <p>Book your private viewing today.</p>
          </div>
          <aside className="final-form-card">
            <p>Book a Private Viewing</p>
            <LeadForm
              intent="site_visit"
              ctaSource="final-form"
              formName="private-viewing"
              selectedResidence={selectedResidence}
            />
          </aside>
        </section>
      </main>

      <footer className="footer">
        <div>
          <BrandWordmark light />
          <p>{projectFacts.locationShort}</p>
          <div className="social-line">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>YouTube</span>
            <span>LinkedIn</span>
          </div>
        </div>
        <nav>
          <button type="button" onClick={() => scrollTo("residences", "footer-residences")}>Residences</button>
          <button type="button" onClick={() => scrollTo("amenities", "footer-amenities")}>Amenities</button>
          <button type="button" onClick={() => scrollTo("location", "footer-location")}>Location</button>
          <button type="button" onClick={() => scrollTo("trust", "footer-about")}>About</button>
          <a href={`mailto:${projectFacts.contactEmail}`}>Contact</a>
        </nav>
        <div className="footer-actions">
          <button
            type="button"
            onClick={() =>
              openLead({
                intent: "site_visit",
                ctaSource: "footer-viewing",
                title: "Book a private viewing",
                description: "Share your details and preferred configuration.",
                selectedResidence,
              })
            }
          >
            Book a Private Viewing
          </button>
          <button
            type="button"
            onClick={() =>
              openLead({
                intent: "brochure",
                ctaSource: "footer-brochure",
                title: "Download brochure",
                description: "Share your details to receive the latest brochure.",
                selectedResidence,
              })
            }
          >
            Download Brochure <Download size={15} />
          </button>
        </div>
        <p className="footer-disclaimer">{micrositeDisclaimer}</p>
      </footer>

      <div className="mobile-action-bar">
        <button
          type="button"
          onClick={() =>
            openLead({
              intent: "general_enquiry",
              ctaSource: "mobile-sticky-enquire",
              title: "Enquire now",
              description: "Tell us what you would like to know about Poulomi Florique.",
              selectedResidence,
            })
          }
        >
          <Mail size={18} />
          Enquire
        </button>
        <a href={projectFacts.contactPhoneHref} onClick={() => trackEvent("call_click", { cta_source: "mobile-sticky-call" })}>
          <Phone size={18} />
          Call
        </a>
      </div>

      {menuOpen ? (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button>
          <BrandWordmark />
          {["residences", "amenities", "masterplan", "location", "trust"].map((id) => (
            <button key={id} type="button" onClick={() => scrollTo(id, `menu-${id}`)}>
              {id === "trust" ? "About Poulomi" : id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <button
            type="button"
            className="rose-cta"
            onClick={() =>
              openLead({
                intent: "brochure",
                ctaSource: "mobile-menu-brochure",
                title: "Download brochure",
                description: "Share your details to receive the latest brochure.",
                selectedResidence,
              })
            }
          >
            Download Brochure
          </button>
        </div>
      ) : null}

      {leadOverlay ? (
        <div className="lead-overlay" role="dialog" aria-modal="true" aria-labelledby="lead-title">
          <button type="button" className="overlay-backdrop" aria-label="Close enquiry form" onClick={() => setLeadOverlay(null)} />
          <aside className="lead-panel">
            <button type="button" className="panel-close" aria-label="Close enquiry form" onClick={() => setLeadOverlay(null)}><X size={18} /></button>
            <p>{projectFacts.name}</p>
            <h2 id="lead-title">{leadOverlay.title}</h2>
            <span>{leadOverlay.description}</span>
            <LeadForm
              intent={leadOverlay.intent}
              ctaSource={leadOverlay.ctaSource}
              formName="lead-overlay"
              selectedResidence={leadOverlay.selectedResidence}
              compact
            />
          </aside>
        </div>
      ) : null}

      {planOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Floor plan viewer">
          <button type="button" aria-label="Close floor plan" onClick={() => setPlanOpen(false)}><X /></button>
          <Image src={selectedResidence.image} alt={`${selectedResidence.label} floor plan enlarged`} fill sizes="100vw" className="object-contain" />
        </div>
      ) : null}

      {masterPlanOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Master plan viewer">
          <button type="button" aria-label="Close master plan" onClick={() => setMasterPlanOpen(false)}><X /></button>
          <Image src={projectFacts.images.masterPlan} alt="Poulomi Florique master plan enlarged" fill sizes="100vw" className="object-contain" />
        </div>
      ) : null}
    </div>
  );
}
