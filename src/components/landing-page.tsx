"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Hospital,
  Mail,
  Menu,
  Phone,
  RotateCcw,
  ShoppingBag,
  X,
  ZoomIn,
  ZoomOut,
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
  residencePlans,
  type ResidenceFamilyLabel,
  type ResidencePlan,
  trustItems,
} from "@/data/poulomi-florique";
import { getLeadMetadata, trackEvent } from "@/lib/analytics";

type LeadIntent = "site_visit" | "price_sheet" | "brochure" | "floor_plan" | "general_enquiry";

type LeadOverlay = {
  intent: LeadIntent;
  ctaSource: string;
  title: string;
  description: string;
  selectedPlan?: ResidencePlan;
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
  floor_plan: "Request Plan Details",
  general_enquiry: "Send Enquiry",
};

const masterPlanPoints = [
  { label: "Arrival Plaza", category: "Arrival", x: 12, y: 78, description: "A composed entry sequence that opens into the garden-led plan." },
  { label: "Clubhouse", category: "Clubhouse", x: 30, y: 28, description: "The social heart with indoor leisure, gathering and wellness amenities." },
  { label: "Central Greens", category: "Greens", x: 48, y: 48, description: "Landscape courts and open greens placed between residential clusters." },
  { label: "Pool & Deck", category: "Pool", x: 72, y: 58, description: "Pool, deck and pavilion spaces positioned within the amenity landscape." },
  { label: "Sports Zone", category: "Sports", x: 82, y: 34, description: "Outdoor active recreation planned as a dedicated sports precinct." },
  { label: "Children's Play Area", category: "Children", x: 66, y: 72, description: "Family-friendly play zones woven into the safer internal landscape." },
  { label: "Walking Trail", category: "Walking", x: 42, y: 82, description: "A connected walking experience through gardens and resident amenities." },
] as const;

const navItems = [
  { id: "residences", label: "Residences" },
  { id: "bloomscapes", label: "Bloomscapes" },
  { id: "bloomscapes", label: "Amenities" },
  { id: "masterplan", label: "Plans" },
  { id: "location", label: "Location" },
  { id: "trust", label: "About Poulomi" },
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

function ProjectLogo({ light = false, context = "default" }: { light?: boolean; context?: "default" | "footer" | "hero" }) {
  return (
    <Image
      className={`brand-logo brand-logo--${context}`}
      src={light ? projectFacts.images.logoWhite : projectFacts.images.logoRose}
      alt="Poulomi Florique"
      width={951}
      height={762}
    />
  );
}

function BotanicalMark() {
  return <span className="botanical-mask botanical-mask--flower" aria-hidden="true" />;
}

function BotanicalMask({ name, className = "" }: { name: "cornerTop" | "cornerBottom" | "corner" | "branch" | "cluster" | "divider" | "dividerAlt"; className?: string }) {
  return <span className={`botanical-mask botanical-mask--${name} ${className}`} aria-hidden="true" />;
}

function BrandIcon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`brand-icon brand-icon--${name} ${className}`} aria-hidden="true" />;
}

function ProofIcon({ label }: { label: string }) {
  const iconName =
    label === "Acres"
      ? "stat-acreage"
      : label === "Open space"
        ? "stat-open-space"
        : label === "Residences"
          ? "stat-residences"
          : label === "Clubhouse"
            ? "stat-clubhouse"
            : "stat-sports-zone";

  return <BrandIcon name={iconName} />;
}

function TrustIcon({ label }: { label: string }) {
  const iconName =
    label === "RERA registered project"
      ? "trust-quality-construction"
      : label === "Official project details"
        ? "trust-thoughtful-design"
        : label === "Poulomi Estates enquiry"
          ? "trust-customer-first"
          : "trust-sustainable-living";

  return <BrandIcon name={iconName} />;
}

function LocationIcon({ label }: { label: string }) {
  if (label === "Education") return <GraduationCap size={17} />;
  if (label === "Healthcare") return <Hospital size={17} />;
  if (label === "Lifestyle") return <ShoppingBag size={17} />;
  return <Briefcase size={17} />;
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

function ZoomControls({
  onClose,
  onZoomIn,
  onZoomOut,
  onReset,
  closeLabel,
}: {
  onClose: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  closeLabel: string;
}) {
  return (
    <div className="lightbox-controls">
      <button type="button" aria-label={closeLabel} onClick={onClose}><X /></button>
      <button type="button" aria-label="Zoom out" onClick={onZoomOut}><ZoomOut /></button>
      <button type="button" aria-label="Reset zoom" onClick={onReset}><RotateCcw /></button>
      <button type="button" aria-label="Zoom in" onClick={onZoomIn}><ZoomIn /></button>
    </div>
  );
}

function LeadForm({
  intent,
  ctaSource,
  formName,
  selectedPlan,
  compact = false,
  onSuccess,
}: {
  intent: LeadIntent;
  ctaSource: string;
  formName: string;
  selectedPlan?: ResidencePlan;
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
      configuration: selectedPlan ? `${selectedPlan.family} · ${selectedPlan.areaSqFt} sq ft ${selectedPlan.areaType}` : residencePlans[0].family,
      preferredDate: "",
      message: "",
      consent: true,
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      setValue("configuration", `${selectedPlan.family} · ${selectedPlan.areaSqFt} sq ft ${selectedPlan.areaType}`);
    }
  }, [selectedPlan, setValue]);

  const onFocus = () => {
    if (started) {
      return;
    }

    setStarted(true);
    trackEvent("lead_form_start", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: intent,
      configuration: selectedPlan?.id,
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
        lead_plan_id: selectedPlan?.id ?? "",
        lead_area_sqft: selectedPlan?.areaSqFt ?? "",
        lead_area_type: selectedPlan?.areaType ?? "",
        lead_blocks: selectedPlan?.blocks.join(",") ?? "",
        lead_unit_types: selectedPlan?.unitTypes.join(",") ?? "",
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
          planId: selectedPlan?.id,
          areaSqFt: selectedPlan?.areaSqFt,
        }),
      });

      trackEvent("lead_submit_success", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: intent,
        configuration: values.configuration,
        plan_id: selectedPlan?.id,
        area_sqft: selectedPlan?.areaSqFt,
      });

      setStatus("success");
      reset({
        name: "",
        phone: "",
        email: "",
        configuration: selectedPlan ? `${selectedPlan.family} · ${selectedPlan.areaSqFt} sq ft ${selectedPlan.areaType}` : residencePlans[0].family,
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
            {residencePlans.map((plan) => (
              <option key={plan.id} value={`${plan.family} · ${plan.areaSqFt} sq ft ${plan.areaType}`}>
                {plan.family} · {plan.areaSqFt} sq ft {plan.areaType}
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
        <span>
          {consentText} <a href="#legal">Privacy, terms and disclaimer</a>.
        </span>
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
  const [selectedFamily, setSelectedFamily] = useState<ResidenceFamilyLabel>("3 BHK");
  const [selectedPlan, setSelectedPlan] = useState<ResidencePlan>(residencePlans[0]);
  const [leadOverlay, setLeadOverlay] = useState<LeadOverlay | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [locationMapOpen, setLocationMapOpen] = useState(false);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [amenityIndex, setAmenityIndex] = useState(0);
  const [selectedMasterPoint, setSelectedMasterPoint] = useState<(typeof masterPlanPoints)[number]>(masterPlanPoints[2]);
  const [locationTab, setLocationTab] = useState<(typeof locationClusters)[number]["label"]>(
    locationClusters[0].label,
  );
  const [openFaq, setOpenFaq] = useState<string>(faqItems[0].question);

  const selectedLocation = useMemo(
    () => locationClusters.find((cluster) => cluster.label === locationTab) ?? locationClusters[0],
    [locationTab],
  );
  const filteredPlans = useMemo(
    () => residencePlans.filter((plan) => plan.family === selectedFamily),
    [selectedFamily],
  );
  const amenityTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen || leadOverlay || planOpen || masterPlanOpen || overviewOpen || locationMapOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [leadOverlay, locationMapOpen, masterPlanOpen, menuOpen, overviewOpen, planOpen]);

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
      plan_id: overlay.selectedPlan?.id,
      area_sqft: overlay.selectedPlan?.areaSqFt,
    });
    setLeadOverlay(overlay);
  };

  const resetViewer = () => setViewerZoom(1);
  const zoomIn = () => setViewerZoom((zoom) => Math.min(2.4, Number((zoom + 0.2).toFixed(2))));
  const zoomOut = () => setViewerZoom((zoom) => Math.max(0.8, Number((zoom - 0.2).toFixed(2))));
  const scrollAmenityTo = (index: number, source = "amenity-control") => {
    const track = amenityTrackRef.current;
    const cards = track ? Array.from(track.querySelectorAll<HTMLElement>(".amenity-card")) : [];
    const nextIndex = Math.max(0, Math.min(index, amenityHighlights.length - 1));

    setAmenityIndex(nextIndex);
    cards[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    trackEvent("amenity_carousel_select", { amenity: amenityHighlights[nextIndex]?.label, cta_source: source });
  };
  const syncAmenityIndex = () => {
    const track = amenityTrackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>(".amenity-card"));
    const current = cards.reduce(
      (closest, card, index) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
        return distance < closest.distance ? { distance, index } : closest;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );

    setAmenityIndex(current.index);
  };

  return (
    <div className="florique-page">
      <header className="florique-header">
        <div className="announcement">
          <span>Exclusive preview for a select few. Private appointments only.</span>
          <span>RERA Reg. No. {projectFacts.rera.registration}</span>
        </div>
        <div className="nav-shell">
          <button type="button" className="brand-button" aria-label="Poulomi Florique home" onClick={() => scrollTo("top", "brand")}>
            <ProjectLogo light />
          </button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button key={`${item.id}-${item.label}`} type="button" onClick={() => scrollTo(item.id, `nav-${item.label.toLowerCase()}`)}>
                {item.label}
              </button>
            ))}
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
                selectedPlan,
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
            <BotanicalMask name="cornerTop" className="card-botanical" />
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
                    selectedPlan,
                  })
                }
              >
                Download Brochure
                <Download size={16} />
              </button>
            </div>
            <div className="mobile-quick-facts">
              <span><BrandIcon name="proof-residence-led" /> 3 BHK-led homes</span>
              <span><FileText /> Private price sheet</span>
              <span><BrandIcon name="proof-curated-landscape" /> Curated landscapes</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>01</span><i /></div>
          <button
            type="button"
            className="enquire-tab"
            onClick={() =>
              openLead({
                intent: "general_enquiry",
                ctaSource: "hero-enquire-tab",
                title: "Enquire now",
                description: "Tell us what you would like to know about Poulomi Florique.",
                selectedPlan,
              })
            }
          >
            <BotanicalMark />
            Enquire Now
          </button>
        </section>

        <section className="proof-ribbon" aria-label="Project proof points">
          <BotanicalMask name="dividerAlt" className="proof-botanical" />
          <div className="proof-track">
            {proofFacts.map((fact) => (
              <article key={fact.label}>
                <ProofIcon label={fact.label} />
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="editorial-section story-section">
          <BotanicalMask name="branch" className="story-botanical" />
          <BotanicalMask name="cluster" className="story-cluster-botanical" />
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
            <Image src={projectFacts.images.arrivalDesktop} alt="Poulomi Florique landscaped arrival experience" fill sizes="(min-width: 1024px) 54vw, 100vw" className="story-main" />
            <Image src={projectFacts.images.botanicalMacro} alt="" width={180} height={230} className="story-inset" aria-hidden="true" />
          </div>
        </section>

        <section id="residences" className="editorial-section residences-section">
          <BotanicalMask name="cornerBottom" className="residence-botanical residence-botanical--lower" />
          <BotanicalMask name="branch" className="residence-botanical residence-botanical--upper" />
          <BotanicalMask name="divider" className="residence-divider-botanical" />
          <SectionLabel index="03" eyebrow="Choose your home" />
          <div className="residence-intro">
            <h2>Residences, crafted to complement your life.</h2>
            <p className="residence-note">Select from eleven approved plan variants. All areas below are shown as sq ft SBUA.</p>
            <div className="residence-tabs" role="tablist" aria-label="Residence families">
              {residenceFamilies.map((family) => (
                <button
                  key={family.slug}
                  type="button"
                  role="tab"
                  aria-selected={family.label === selectedFamily}
                  className={family.label === selectedFamily ? "active" : ""}
                  onClick={() => {
                    setSelectedFamily(family.label);
                    const nextPlan = residencePlans.find((plan) => plan.family === family.label) ?? residencePlans[0];
                    setSelectedPlan(nextPlan);
                    trackEvent("residence_family_select", { residence: family.label });
                  }}
                >
                  <strong>{family.label}</strong>
                  <span>{family.summary}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="area-tabs" aria-label="Plan areas">
            {filteredPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={plan.id === selectedPlan.id ? "active" : ""}
                onClick={() => {
                  setSelectedPlan(plan);
                  trackEvent("residence_variant_select", { plan_id: plan.id, area_sqft: plan.areaSqFt });
                }}
              >
                {plan.areaSqFt}
              </button>
            ))}
          </div>
          <div className="residence-browser">
            <article className="plan-stage">
              <BotanicalMask name="corner" className="plan-botanical" />
              <div className="plan-stage-copy">
                <p>{selectedPlan.family}{selectedPlan.qualifier ? ` with ${selectedPlan.qualifier}` : ""}</p>
                <h3>{selectedPlan.areaSqFt.toLocaleString("en-IN")} sq ft {selectedPlan.areaType}</h3>
                <span>Blocks {selectedPlan.blocks.join("/")} | Unit {selectedPlan.unitTypes.join(", ")} | {selectedPlan.status === "derived-from-approved-sheet" ? "Derived from approved overview sheet" : "Supplied individual plan"}</span>
                <div className="plan-stage-actions">
                  <button type="button" className="text-cta" onClick={() => { resetViewer(); setPlanOpen(true); }}>
                    View Full Plan <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="rose-cta"
                    onClick={() =>
                      openLead({
                        intent: "price_sheet",
                        ctaSource: `plan-${selectedPlan.id}`,
                        title: "Request current price",
                        description: `${selectedPlan.family}, ${selectedPlan.areaSqFt.toLocaleString("en-IN")} sq ft ${selectedPlan.areaType}. Share your details for the latest cost sheet.`,
                        selectedPlan,
                      })
                    }
                  >
                    Request Current Price
                  </button>
                </div>
              </div>
              <button type="button" className="plan-image-button" onClick={() => { resetViewer(); setPlanOpen(true); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPlan.src}
                  alt={`${selectedPlan.family} ${selectedPlan.areaSqFt} sq ft ${selectedPlan.areaType} floor plan`}
                  width={selectedPlan.width}
                  height={selectedPlan.height}
                  className="object-contain"
                  loading="eager"
                  decoding="async"
                  style={{ display: "block", width: "100%", maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
              </button>
              <button type="button" className="plan-overview-link" onClick={() => { resetViewer(); setOverviewOpen(true); }}>
                View typical floor overview <Eye size={16} />
              </button>
            </article>
          </div>
        </section>

        <section id="bloomscapes" className="editorial-section amenities-section">
          <BotanicalMask name="cornerBottom" className="amenity-botanical" />
          <BotanicalMask name="dividerAlt" className="amenity-divider-botanical" />
          <SectionLabel index="04" eyebrow="Amenities bloomscape" />
          <div className="amenity-copy">
            <h2>Spaces that nourish every part of you.</h2>
          </div>
          <div className="amenity-track" ref={amenityTrackRef} onScroll={syncAmenityIndex} aria-label="Amenity highlights">
            {amenityHighlights.map((amenity, index) => (
              <article key={amenity.label} className={index === amenityIndex ? "amenity-card active" : "amenity-card"}>
                <Image src={amenity.image} alt={amenity.label} fill sizes="(min-width: 1024px) 22vw, 70vw" className="object-cover" />
                <div>
                  <small>{String(index + 1).padStart(2, "0")} / {String(amenityHighlights.length).padStart(2, "0")}</small>
                  <strong>{amenity.label}</strong>
                  <span>{amenity.text}</span>
                  <ul>
                    {amenity.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="amenity-controls" aria-label="Amenity carousel controls">
            <div className="amenity-progress" aria-hidden="true">
              <span style={{ width: `${((amenityIndex + 1) / amenityHighlights.length) * 100}%` }} />
            </div>
            <div className="gallery-dots">
              {amenityHighlights.map((amenity, index) => (
                <button
                  key={amenity.label}
                  type="button"
                  aria-label={`Show ${amenity.label}`}
                  className={index === amenityIndex ? "active" : ""}
                  onClick={() => scrollAmenityTo(index, "amenity-dot")}
                />
              ))}
            </div>
            <div className="amenity-arrows">
              <button type="button" aria-label="Previous amenity" onClick={() => scrollAmenityTo(amenityIndex - 1, "amenity-prev")}>
                <ArrowLeft size={17} />
              </button>
              <button type="button" aria-label="Next amenity" onClick={() => scrollAmenityTo(amenityIndex + 1, "amenity-next")}>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        <section id="masterplan" className="editorial-section masterplan-section">
          <BotanicalMask name="branch" className="master-botanical" />
          <BotanicalMask name="cluster" className="master-cluster-botanical" />
          <SectionLabel index="05" eyebrow="Master plan" />
          <div className="master-copy">
            <h2>Designed with green at the heart.</h2>
            <button type="button" className="text-cta" onClick={() => { resetViewer(); setMasterPlanOpen(true); }}>
              View Full Master Plan <Download size={15} />
            </button>
          </div>
          <div className="master-image-wrap">
            <button type="button" className="master-image" onClick={() => { resetViewer(); setMasterPlanOpen(true); }}>
              <Image src={projectFacts.images.masterPlanLayout} alt="Poulomi Florique official master plan layout preview" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-contain" />
            </button>
          </div>
          <aside className="master-legend">
            {masterPlanPoints.map((point, index) => (
              <button
                key={point.label}
                type="button"
                className={selectedMasterPoint.label === point.label ? "active" : ""}
                onClick={() => {
                  setSelectedMasterPoint(point);
                  trackEvent("masterplan_hotspot_select", { point: point.label });
                }}
              >
                <span>{index + 1}</span>
                {point.label}
              </button>
            ))}
            <p className="master-detail">
              <strong>{selectedMasterPoint.category}</strong>
              {selectedMasterPoint.description}
            </p>
            <button type="button" className="legend-view" onClick={() => { resetViewer(); setMasterPlanOpen(true); }}>View Legend <Eye size={14} /></button>
          </aside>
        </section>

        <section id="location" className="editorial-section location-section">
          <BotanicalMask name="cornerTop" className="location-botanical" />
          <SectionLabel index="06" eyebrow="North Bengaluru" />
          <div className="location-copy">
            <h2>Well connected. Well placed.</h2>
            <p>Located in Thanisandra, close to major business hubs, schools, healthcare and everyday conveniences.</p>
          </div>
          <div className="location-visual" aria-label="Poulomi Florique landmark access summary">
            <div className="location-pin">
              <ProjectLogo light />
              <span>Thanisandra</span>
            </div>
            {locationClusters.map((cluster) => (
              <article key={cluster.label}>
                <strong>{cluster.label}</strong>
                <span>{cluster.items[0]?.name}</span>
              </article>
            ))}
            <button type="button" className="text-cta" onClick={() => { resetViewer(); setLocationMapOpen(true); }}>
              View official location map <Eye size={16} />
            </button>
          </div>
          <aside className="commute-card">
            <p>Indicative non-peak access</p>
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
                  <LocationIcon label={cluster.label} />
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
            <small>Shown for orientation only. Please verify current routes, distances and travel times on a live map before booking.</small>
          </aside>
        </section>

        <section id="trust" className="trust-section">
          <BotanicalMask name="divider" className="trust-divider-botanical" />
          <SectionLabel index="07" eyebrow="Built on trust" />
          <div className="trust-brand">
            <ProjectLogo />
            <p>Poulomi Florique enquiries should be cross-checked with official project material, legal documents and Karnataka RERA before any booking decision.</p>
          </div>
          <div className="trust-icons">
            {trustItems.map((item) => (
              <span key={item}><TrustIcon label={item} /> {item}</span>
            ))}
          </div>
          <div className="rera-card">
            <BotanicalMask name="cornerTop" className="rera-botanical" />
            <p>RERA Reg. No.</p>
            <strong>{projectFacts.rera.registration}</strong>
            <Link href={projectFacts.rera.url} target="_blank" rel="noreferrer" onClick={() => trackEvent("rera_link_click", {})}>
              View RERA Details <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section id="private-viewing" className="faq-form-section">
          <BotanicalMask name="cornerBottom" className="faq-botanical" />
          <SectionLabel index="08" eyebrow="Frequently asked questions" />
          <div className="faq-list">
            {faqItems.slice(0, 5).map((faq) => {
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
            <BotanicalMask name="cluster" />
            <ProjectLogo light context="hero" />
            <h2>Homes that bloom with possibility.</h2>
            <p>Book your private viewing today.</p>
          </div>
          <aside className="final-form-card">
            <p>Book a Private Viewing</p>
            <LeadForm
              intent="site_visit"
              ctaSource="final-form"
              formName="private-viewing"
              selectedPlan={selectedPlan}
            />
          </aside>
        </section>
      </main>

      <footer id="legal" className="footer">
        <div>
          <ProjectLogo light context="footer" />
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
          <button type="button" onClick={() => scrollTo("bloomscapes", "footer-bloomscapes")}>Bloomscapes</button>
          <button type="button" onClick={() => scrollTo("masterplan", "footer-plans")}>Plans</button>
          <button type="button" onClick={() => scrollTo("location", "footer-location")}>Location</button>
          <button type="button" onClick={() => scrollTo("trust", "footer-about")}>About</button>
          <a href={`mailto:${projectFacts.contactEmail}`}>Contact</a>
          <Link href={projectFacts.rera.url} target="_blank" rel="noreferrer">RERA</Link>
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
                selectedPlan,
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
                selectedPlan,
              })
            }
          >
            Download Brochure <Download size={15} />
          </button>
        </div>
        <p className="footer-disclaimer">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Disclaimer</span>
          {micrositeDisclaimer}
        </p>
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
              selectedPlan,
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
          <ProjectLogo />
          {navItems.map((item) => (
            <button key={`menu-${item.id}-${item.label}`} type="button" onClick={() => scrollTo(item.id, `menu-${item.label.toLowerCase()}`)}>
              {item.label}
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
                selectedPlan,
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
            <ProjectLogo context="hero" />
            <h2 id="lead-title">{leadOverlay.title}</h2>
            <span>{leadOverlay.description}</span>
            <LeadForm
              intent={leadOverlay.intent}
              ctaSource={leadOverlay.ctaSource}
              formName="lead-overlay"
              selectedPlan={leadOverlay.selectedPlan}
              compact
            />
          </aside>
        </div>
      ) : null}

      {planOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Floor plan viewer">
          <ZoomControls onClose={() => setPlanOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close floor plan" />
          <div className="lightbox-canvas">
            <Image
              src={selectedPlan.src}
              alt={`${selectedPlan.family} ${selectedPlan.areaSqFt} sq ft ${selectedPlan.areaType} floor plan enlarged`}
              width={selectedPlan.width}
              height={selectedPlan.height}
              sizes="100vw"
              className="object-contain"
              style={{ transform: `scale(${viewerZoom})` }}
            />
          </div>
        </div>
      ) : null}

      {overviewOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Typical floor overview viewer">
          <ZoomControls onClose={() => setOverviewOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close typical floor overview" />
          <div className="lightbox-canvas">
            <Image src={projectFacts.images.floorPlanOverview} alt="Poulomi Florique approved typical floor overview" width={2160} height={3840} sizes="100vw" className="object-contain" style={{ transform: `scale(${viewerZoom})` }} />
          </div>
        </div>
      ) : null}

      {masterPlanOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Master plan viewer">
          <ZoomControls onClose={() => setMasterPlanOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close master plan" />
          <div className="lightbox-canvas">
            <Image src={projectFacts.images.masterPlan} alt="Poulomi Florique master plan enlarged" width={2160} height={3840} sizes="100vw" className="object-contain" style={{ transform: `scale(${viewerZoom})` }} />
          </div>
        </div>
      ) : null}

      {locationMapOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Official location map viewer">
          <ZoomControls onClose={() => setLocationMapOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close location map" />
          <div className="lightbox-canvas">
            <Image src={projectFacts.images.locationDesktop} alt="Poulomi Florique official location map" width={2160} height={3840} sizes="100vw" className="object-contain" style={{ transform: `scale(${viewerZoom})` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
