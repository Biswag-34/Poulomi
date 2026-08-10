"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Baby,
  Building2,
  Cpu,
  Download,
  Droplets,
  Dumbbell,
  Flower2,
  Footprints,
  Laptop,
  Maximize2,
  Menu,
  Music2,
  PawPrint,
  PhoneCall,
  Quote,
  RotateCcw,
  School,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Trophy,
  Waves,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  consentText,
  faqItems,
  locationClusters,
  micrositeDisclaimer,
  projectFacts,
  residenceFamilies,
  residencePlans,
  type ResidenceFamilyLabel,
  type ResidencePlan,
} from "@/data/poulomi-florique";
import { getLeadMetadata, trackEvent } from "@/lib/analytics";

type LeadIntent = "site_visit" | "price_sheet" | "brochure" | "floor_plan" | "general_enquiry";

type LeadOverlay = {
  intent: LeadIntent;
  ctaSource: string;
  title: string;
  description: string;
  selectedPlan?: ResidencePlan;
  downloadUrl?: string;
  downloadFileName?: string;
};

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Use letters only for your name.");

const indianPhoneSchema = z
  .string()
  .trim()
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    const mobile = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;
    return /^[6-9]\d{9}$/.test(mobile);
  }, "Enter a valid 10-digit Indian mobile number.");

const emailSchema = z.string().trim().email("Enter a valid email address.");

const budgetSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter budget as a number only.");

const leadSchema = z.object({
  name: nameSchema,
  phone: indianPhoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  configuration: z.string().min(1, "Choose a configuration."),
  message: z.string().trim().max(400, "Keep the message under 400 characters.").optional(),
  consent: z.boolean().refine(Boolean, "Please confirm consent."),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const quickEnquirySchema = z.object({
  name: nameSchema,
  phone: indianPhoneSchema,
  email: emailSchema,
  budget: budgetSchema,
});

type QuickEnquiryValues = z.infer<typeof quickEnquirySchema>;

const actionLabels: Record<LeadIntent, string> = {
  site_visit: "Schedule My Visit",
  price_sheet: "Request Current Price",
  brochure: "Download Brochure",
  floor_plan: "Download Floor Plan",
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
  { id: "usp", label: "Why Florique" },
  { id: "bloomscapes", label: "Amenities" },
  { id: "florique-life", label: "Gallery" },
  { id: "residences", label: "Residences" },
  { id: "masterplan", label: "Plans" },
  { id: "location", label: "Location" },
] as const;

const familyCompactLabels: Record<ResidenceFamilyLabel, string> = {
  "3 BHK": "3BHK",
  "3 BHK + Maid": "3BHK+Maid",
  "3 BHK + Study + Maid": "3BHK+Study+Maid",
};

const whyChooseItems: readonly { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "No Common Walls",
    description: "Private residences planned to reduce neighbour disturbance and feel more independent.",
    Icon: ShieldCheck,
  },
  {
    title: "Spacious 3 BHK Homes",
    description: "Generous homes from about 1,585 to 2,740 sq. ft., including maid and study layouts.",
    Icon: Maximize2,
  },
  {
    title: "40+ Lifestyle Amenities",
    description: "Clubhouse, sports, wellness, gardens and family spaces for everyday recreation.",
    Icon: Sparkles,
  },
  {
    title: "Water-Sensitive Planning",
    description: "Rainwater capture, groundwater recharge and treated-water reuse support responsible living.",
    Icon: Droplets,
  },
  {
    title: "Vehicle-Free Podium",
    description: "Safer elevated outdoor spaces where children, families and seniors can relax comfortably.",
    Icon: Footprints,
  },
  {
    title: "Future-Ready Living",
    description: "IGBC Platinum pre-certification, power backup, EV provision and smart access control.",
    Icon: Cpu,
  },
] as const;

const amenityItems: readonly { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Grand Clubhouse",
    description: "37,800 sq. ft. hub for leisure, celebrations and community experiences.",
    Icon: Building2,
  },
  {
    title: "25m Lap Pool",
    description: "Lap pool with kids' pool, jacuzzi, bubbling pool, deck and pavilion.",
    Icon: Waves,
  },
  {
    title: "Sports Zone",
    description: "27,500 sq. ft. active zone with tennis, basketball, futsal, pickleball and cricket.",
    Icon: Trophy,
  },
  {
    title: "Indoor Sports",
    description: "Badminton and squash courts for all-weather recreation within the community.",
    Icon: Dumbbell,
  },
  {
    title: "Yoga Deck",
    description: "Open-air wellness space for yoga, mindful movement and daily renewal.",
    Icon: Flower2,
  },
  {
    title: "Co-working",
    description: "Clubhouse workspace for focused work, remote meetings and productivity.",
    Icon: Laptop,
  },
  {
    title: "Kids' Zone",
    description: "Creche, play areas, adventure playground and kids' pool for younger residents.",
    Icon: Baby,
  },
  {
    title: "Event Lawn",
    description: "Purpose-made spaces for performances, celebrations and community gatherings.",
    Icon: Music2,
  },
  {
    title: "Senior Garden",
    description: "Senior-friendly garden with reflexology features, seating and restorative landscape.",
    Icon: Footprints,
  },
  {
    title: "Pet Garden",
    description: "Dedicated pet-friendly garden and walking track for comfortable outdoor time.",
    Icon: PawPrint,
  },
] as const;

const getRepresentativePlan = (family: ResidenceFamilyLabel) =>
  residencePlans.find((plan) => plan.family === family) ?? residencePlans[0];

const leadPlanOptions = residenceFamilies.map((family) => getRepresentativePlan(family.label));

const formatPlanOption = (plan: ResidencePlan) =>
  `${plan.family} | ${plan.areaSqFt.toLocaleString("en-IN")} sq. ft. ${plan.areaType}`;

function normalisePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const number = digits.length > 10 ? digits.slice(-10) : digits;
  return `+91${number}`;
}

function formatIndianMobileInput(value: string) {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;
  return withoutCountryCode.slice(0, 10);
}

function formatBudgetInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, decimal = ""] = cleaned.split(".");
  return decimal ? `${whole}.${decimal.slice(0, 2)}` : whole;
}

function redirectToThankYou() {
  window.location.assign("/thank-you");
}

function downloadFile(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
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
      sizes="(max-width: 767px) 132px, (max-width: 1023px) 150px, 190px"
    />
  );
}

function BotanicalMark() {
  return <span className="botanical-mask botanical-mask--flower" aria-hidden="true" />;
}

function BotanicalMask({ name, className = "" }: { name: "cornerTop" | "cornerBottom" | "corner" | "branch" | "cluster" | "divider" | "dividerAlt"; className?: string }) {
  return <span className={`botanical-mask botanical-mask--${name} ${className}`} aria-hidden="true" />;
}

function LocationIcon({ label }: { label: string }) {
  if (label === "Education") return <School size={17} />;
  if (label === "Healthcare") return <Stethoscope size={17} />;
  if (label === "Lifestyle") return <ShoppingBag size={17} />;
  return <Building2 size={17} />;
}

function SectionLabel({ index, eyebrow }: { index: string; eyebrow: string }) {
  const hasLabel = Boolean(index || eyebrow);
  return <div className="section-label section-label--blank" aria-hidden={hasLabel} />;
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
  showMessage = true,
  showConsent = true,
  submitLabel,
  downloadOnSuccess,
  onSuccess,
}: {
  intent: LeadIntent;
  ctaSource: string;
  formName: string;
  selectedPlan?: ResidencePlan;
  compact?: boolean;
  showMessage?: boolean;
  showConsent?: boolean;
  submitLabel?: string;
  downloadOnSuccess?: { url: string; fileName: string };
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      configuration: selectedPlan ? formatPlanOption(selectedPlan) : formatPlanOption(leadPlanOptions[0]),
      message: "",
      consent: true,
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      setValue("configuration", formatPlanOption(selectedPlan));
    }
  }, [selectedPlan, setValue]);

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timer = window.setTimeout(() => setStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

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
      const activePlan = leadPlanOptions.find((plan) => formatPlanOption(plan) === values.configuration) ?? selectedPlan;
      await submitLead({
        ...captureAttribution(ctaSource, formName),
        lead_action: intent,
        lead_name: values.name,
        lead_phone: phone,
        lead_unit_type: values.configuration,
        lead_plan_id: activePlan?.id ?? "",
        lead_area_sqft: activePlan?.areaSqFt ?? "",
        lead_area_type: activePlan?.areaType ?? "",
        lead_blocks: activePlan?.blocks.join(",") ?? "",
        lead_unit_types: activePlan?.unitTypes.join(",") ?? "",
        lead_callback_time: "",
        name: values.name,
        phone,
        email: values.email,
        interestedIn: values.configuration,
        preferredAction: intent,
        callbackTime: "",
        note: values.message,
        source: ctaSource,
        consent: values.consent,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: intent,
          unitSelected: values.configuration,
          planId: activePlan?.id,
          areaSqFt: activePlan?.areaSqFt,
        }),
      });

      trackEvent("lead_submit_success", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: intent,
        configuration: values.configuration,
        plan_id: activePlan?.id,
        area_sqft: activePlan?.areaSqFt,
      });
      trackEvent("generate_lead", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: intent,
        plan_id: activePlan?.id,
        area_sqft: activePlan?.areaSqFt,
      });

      setStatus("success");
      onSuccess?.();
      if (downloadOnSuccess) {
        downloadFile(downloadOnSuccess.url, downloadOnSuccess.fileName);
      }
      redirectToThankYou();
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
    <form className={`visit-form ${compact ? "visit-form--compact" : ""}`} method="post" onFocus={onFocus} onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <label>
          <span>Full Name</span>
          <input aria-label="Full name" autoComplete="name" placeholder="Your full name" required {...register("name")} />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>
        <label>
          <span>Phone Number</span>
          <span className="phone-input">
            <b>+91</b>
            <input
              autoComplete="tel"
              aria-label="Phone number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile"
              required
              type="tel"
              {...register("phone")}
              onInput={(event) => {
                event.currentTarget.value = formatIndianMobileInput(event.currentTarget.value);
              }}
            />
          </span>
          {errors.phone ? <small>{errors.phone.message}</small> : null}
        </label>
        <label>
          <span>Email Address</span>
          <input aria-label="Email address" autoComplete="email" inputMode="email" placeholder="name@example.com" type="email" {...register("email")} />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>
      </div>

      <div className="form-grid form-grid--wide">
        <label>
          <span>I&apos;m interested in</span>
          <select aria-label="Interested in" required {...register("configuration")}>
            {leadPlanOptions.map((plan) => (
              <option key={plan.id} value={formatPlanOption(plan)}>
                {formatPlanOption(plan)}
              </option>
            ))}
          </select>
          {errors.configuration ? <small>{errors.configuration.message}</small> : null}
        </label>
        {showMessage ? (
          <label>
            <span>Message (Optional)</span>
            <input aria-label="Message" {...register("message")} />
            {errors.message ? <small>{errors.message.message}</small> : null}
          </label>
        ) : null}
      </div>

      {showConsent ? (
        <>
          <label className="consent-line">
            <input type="checkbox" required {...register("consent")} aria-label="Consent to receive project updates" />
            <span>
              {consentText} <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-and-conditions">Terms & Conditions</a>.
            </span>
          </label>
          {errors.consent ? <small className="form-error">{errors.consent.message}</small> : null}
        </>
      ) : null}

      <button type="submit" className="rose-cta" disabled={isSubmitting}>
        <BotanicalMark />
        {isSubmitting ? "Submitting..." : submitLabel ?? actionLabels[intent]}
      </button>

      {status === "success" ? (
        <p className="lead-toast lead-toast--success form-success" role="status">
          Thank you. Your request has been received.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="lead-toast lead-toast--error" role="alert">
          We could not submit your request. Please check your details and try again.
        </p>
      ) : null}
    </form>
  );
}

function QuickEnquiryForm({ selectedPlan }: { selectedPlan: ResidencePlan }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<QuickEnquiryValues>({
    resolver: zodResolver(quickEnquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      budget: "",
    },
  });

  const formName = "banner-quick-enquiry";
  const ctaSource = "hero-enquiry-form";

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timer = window.setTimeout(() => setStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const onFocus = () => {
    if (started) {
      return;
    }

    setStarted(true);
    trackEvent("lead_form_start", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: "general_enquiry",
      configuration: selectedPlan.id,
    });
  };

  const onSubmit = async (values: QuickEnquiryValues) => {
    setStatus("idle");

    try {
      const phone = normalisePhone(values.phone);
      const selectedUnit = `${selectedPlan.family} | ${selectedPlan.areaSqFt} sq. ft. ${selectedPlan.areaType}`;
      const budgetWithSuffix = `${values.budget} Cr`;

      await submitLead({
        ...captureAttribution(ctaSource, formName),
        lead_action: "general_enquiry",
        lead_name: values.name,
        lead_phone: phone,
        lead_unit_type: selectedUnit,
        lead_plan_id: selectedPlan.id,
        lead_area_sqft: selectedPlan.areaSqFt,
        lead_area_type: selectedPlan.areaType,
        lead_budget: budgetWithSuffix,
        name: values.name,
        phone,
        email: values.email,
        budget: budgetWithSuffix,
        interestedIn: selectedUnit,
        interest: "banner_quick_enquiry",
        preferredAction: "general_enquiry",
        source: ctaSource,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: "general_enquiry",
          unitSelected: selectedUnit,
          planId: selectedPlan.id,
          areaSqFt: selectedPlan.areaSqFt,
          budget: budgetWithSuffix,
        }),
      });

      trackEvent("lead_submit_success", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: "general_enquiry",
        budget: budgetWithSuffix,
        plan_id: selectedPlan.id,
        area_sqft: selectedPlan.areaSqFt,
      });
      trackEvent("generate_lead", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: "general_enquiry",
        plan_id: selectedPlan.id,
        area_sqft: selectedPlan.areaSqFt,
      });

      setStatus("success");
      reset();
      redirectToThankYou();
    } catch {
      trackEvent("lead_submit_error", {
        form_name: formName,
        cta_source: ctaSource,
        lead_action: "general_enquiry",
      });
      setStatus("error");
    }
  };

  return (
    <aside className="hero-enquiry-card" aria-label="Quick enquiry form">
      <BotanicalMask name="dividerAlt" className="hero-enquiry-botanical" />
      <div className="hero-enquiry-copy">
        <h2>Enquire About the Project</h2>
        <span>Share your details below, and our team will get in touch with the complete project details.</span>
      </div>
      <form className="quick-enquiry-form" method="post" onFocus={onFocus} onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Name</span>
          <input aria-label="Name" autoComplete="name" placeholder="Your name" required {...register("name")} />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>
        <label>
          <span>Mobile Number</span>
          <span className="phone-input">
            <b>+91</b>
            <input
              autoComplete="tel"
              aria-label="Mobile number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile"
              required
              type="tel"
              {...register("phone")}
              onInput={(event) => {
                event.currentTarget.value = formatIndianMobileInput(event.currentTarget.value);
              }}
            />
          </span>
          {errors.phone ? <small>{errors.phone.message}</small> : null}
        </label>
        <label>
          <span>Email Address</span>
          <input aria-label="Email address" autoComplete="email" inputMode="email" placeholder="name@example.com" required type="email" {...register("email")} />
          {errors.email ? <small>{errors.email.message}</small> : null}
        </label>
        <label>
          <span>Budget</span>
          <span className="budget-input">
            <input
              autoComplete="off"
              aria-label="Budget in crores"
              inputMode="decimal"
              placeholder="2.5"
              required
              {...register("budget")}
              onInput={(event) => {
                event.currentTarget.value = formatBudgetInput(event.currentTarget.value);
              }}
            />
            <b>Cr</b>
          </span>
          {errors.budget ? <small>{errors.budget.message}</small> : null}
        </label>
        <button type="submit" className="rose-cta" disabled={isSubmitting}>
          <BotanicalMark />
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
        {status === "success" ? <p className="lead-toast lead-toast--success form-success" role="status">Thank you. Your enquiry has been received.</p> : null}
        {status === "error" ? (
          <p className="lead-toast lead-toast--error" role="alert">
            We could not submit your enquiry. Please check your details and try again.
          </p>
        ) : null}
      </form>
    </aside>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [mobileCtaCompact, setMobileCtaCompact] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<ResidenceFamilyLabel>("3 BHK");
  const [selectedPlan, setSelectedPlan] = useState<ResidencePlan>(residencePlans[0]);
  const [leadOverlay, setLeadOverlay] = useState<LeadOverlay | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  const [locationMapOpen, setLocationMapOpen] = useState(false);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [selectedMasterPoint, setSelectedMasterPoint] = useState<(typeof masterPlanPoints)[number]>(masterPlanPoints[2]);
  const [locationTab, setLocationTab] = useState<(typeof locationClusters)[number]["label"]>(
    locationClusters[0].label,
  );
  const [openFaq, setOpenFaq] = useState<string>(faqItems[0].question);
  const [storyVideoReady, setStoryVideoReady] = useState(false);
  const menuCloseTimerRef = useRef<number | null>(null);
  const mobileCtaIdleTimerRef = useRef<number | null>(null);
  const mobileCtaOpenTimerRef = useRef<number | null>(null);
  const storySectionRef = useRef<HTMLElement | null>(null);

  const selectedLocation = useMemo(
    () => locationClusters.find((cluster) => cluster.label === locationTab) ?? locationClusters[0],
    [locationTab],
  );

  useEffect(() => {
    document.body.style.overflow = menuOpen || leadOverlay || planOpen || masterPlanOpen || locationMapOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [leadOverlay, locationMapOpen, masterPlanOpen, menuOpen, planOpen]);

  useEffect(() => {
    const section = storySectionRef.current;

    if (!section || storyVideoReady) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStoryVideoReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [storyVideoReady]);

  useEffect(() => {
    const clearIdleTimer = () => {
      if (mobileCtaIdleTimerRef.current) {
        window.clearTimeout(mobileCtaIdleTimerRef.current);
        mobileCtaIdleTimerRef.current = null;
      }
    };

    const showFullAfterIdle = () => {
      clearIdleTimer();
      mobileCtaIdleTimerRef.current = window.setTimeout(() => {
        setMobileCtaCompact(false);
      }, 4000);
    };

    const syncMobileCta = () => {
      if (window.scrollY <= 18) {
        clearIdleTimer();
        setMobileCtaCompact(false);
        return;
      }

      setMobileCtaCompact(true);
      showFullAfterIdle();
    };

    syncMobileCta();
    window.addEventListener("scroll", syncMobileCta, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncMobileCta);
      clearIdleTimer();
      if (mobileCtaOpenTimerRef.current) {
        window.clearTimeout(mobileCtaOpenTimerRef.current);
      }
    };
  }, []);

  useEffect(() => () => {
    if (menuCloseTimerRef.current) {
      window.clearTimeout(menuCloseTimerRef.current);
    }
  }, []);

  const openMenu = () => {
    if (menuCloseTimerRef.current) {
      window.clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setMenuClosing(false);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    if (!menuOpen) {
      return;
    }

    setMenuClosing(true);
    if (menuCloseTimerRef.current) {
      window.clearTimeout(menuCloseTimerRef.current);
    }
    menuCloseTimerRef.current = window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
      menuCloseTimerRef.current = null;
    }, 280);
  };

  const scrollTo = (id: string, source: string) => {
    closeMenu();
    trackEvent("navigation_click", { target_section: id, cta_source: source });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string, source: string) => {
    event.preventDefault();
    scrollTo(id, source);
    window.history.pushState(null, "", `#${id}`);
  };

  const openLead = (overlay: LeadOverlay) => {
    setMenuOpen(false);
    setMenuClosing(false);
    trackEvent("lead_sheet_open", {
      lead_action: overlay.intent,
      cta_source: overlay.ctaSource,
      plan_id: overlay.selectedPlan?.id,
      area_sqft: overlay.selectedPlan?.areaSqFt,
    });
    setLeadOverlay(overlay);
  };

  const openMobileEnquiry = () => {
    const overlay: LeadOverlay = {
      intent: "general_enquiry",
      ctaSource: "mobile-sticky-enquire",
      title: "Enquire now",
      description: "Tell us what you would like to know about Poulomi Florique.",
      selectedPlan,
    };

    if (mobileCtaCompact) {
      setMobileCtaCompact(false);
      if (mobileCtaOpenTimerRef.current) {
        window.clearTimeout(mobileCtaOpenTimerRef.current);
      }
      mobileCtaOpenTimerRef.current = window.setTimeout(() => {
        openLead(overlay);
        mobileCtaOpenTimerRef.current = null;
      }, 420);
      return;
    }

    openLead(overlay);
  };

  const resetViewer = () => setViewerZoom(1);
  const zoomIn = () => setViewerZoom((zoom) => Math.min(2.4, Number((zoom + 0.2).toFixed(2))));
  const zoomOut = () => setViewerZoom((zoom) => Math.max(0.8, Number((zoom - 0.2).toFixed(2))));

  return (
    <div className="florique-page">
      <header className="florique-header">
        <div className="nav-shell">
          <a href="#top" className="brand-button" aria-label="Poulomi Florique home" onClick={(event) => handleNavLinkClick(event, "top", "brand")}>
            <ProjectLogo light />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={`${item.id}-${item.label}`} href={`#${item.id}`} onClick={(event) => handleNavLinkClick(event, item.id, `nav-${item.label.toLowerCase()}`)}>
                {item.label}
              </a>
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
          <button type="button" className="menu-button" aria-label="Open menu" onClick={openMenu}>
            <Menu />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <picture>
            <source media="(min-width: 768px)" srcSet={projectFacts.images.heroDesktopAvif} type="image/avif" />
            <source media="(min-width: 768px)" srcSet={projectFacts.images.heroDesktopWebp} type="image/webp" />
            <source srcSet={projectFacts.images.heroMobileAvif} type="image/avif" />
            <source srcSet={projectFacts.images.heroMobileWebp} type="image/webp" />
            <img
              src={projectFacts.images.heroMobile}
              alt="Poulomi Florique landscaped residential tower at dusk"
              width={1220}
              height={1520}
              sizes="100vw"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="hero-card">
            <h1 className="hero-seo-title">Poulomi Florique</h1>
            <span className="hero-tagline">Where Architecture Blooms</span>
            <Image
              className="hero-card-mobile-image"
              src={projectFacts.images.heroCardMobileWebp}
              alt="Poulomi Florique project highlights"
              width={2400}
              height={1800}
              sizes="(max-width: 767px) calc(100vw - 40px), 1px"
              loading="lazy"
            />
          </div>
          <QuickEnquiryForm selectedPlan={selectedPlan} />
        </section>

        <section id="usp" className="usp-section" aria-labelledby="usp-title">
          <BotanicalMask name="cornerTop" className="usp-botanical usp-botanical--corner" />
          <BotanicalMask name="divider" className="usp-botanical usp-botanical--divider" />
          <div className="usp-copy">
            <h2 id="usp-title">Why Choose Poulomi Florique?</h2>
            <p>Thoughtful planning, privacy and everyday wellness come together in a green North Bengaluru community.</p>
          </div>
          <div className="usp-grid">
            {whyChooseItems.map(({ title, description, Icon }) => (
              <article key={title}>
                <span className="usp-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="bloomscapes" className="editorial-section amenities-section">
          <BotanicalMask name="cornerBottom" className="amenity-botanical" />
          <BotanicalMask name="dividerAlt" className="amenity-divider-botanical" />
          <SectionLabel index="03" eyebrow="Core amenities" />
          <div className="amenity-copy">
            <h2>Amenities Designed Around Your Life</h2>
            <p>Ten carefully placed amenity experiences for fitness, work, family, celebration and quiet restoration.</p>
          </div>
          <div className="amenity-grid" aria-label="Core amenity highlights">
            {amenityItems.map(({ title, description, Icon }) => (
              <article key={title} className="amenity-tile">
                <span className="amenity-icon"><Icon /></span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="florique-life" className="editorial-section story-section" ref={storySectionRef}>
          <BotanicalMask name="branch" className="story-botanical" />
          <BotanicalMask name="cluster" className="story-cluster-botanical" />
          <SectionLabel index="04" eyebrow="The Florique Life" />
          <div className="story-copy">
            <h2>
              <span className="story-heading story-heading--large">
                <span>A world that</span>
                <span>blossoms around</span>
                <span>you.</span>
              </span>
              <span className="story-heading story-heading--small">
                <span>A world that blossoms</span>
                <span>around you.</span>
              </span>
            </h2>
            <p>
              Poulomi Florique is a sanctuary of green and light. Where modern architecture rises gently from landscaped gardens, and every space is designed to help you live well, every day.
            </p>
            <a href="#masterplan" className="text-cta" onClick={(event) => handleNavLinkClick(event, "masterplan", "story-discover")}>
              Discover the Story <ArrowRight size={16} />
            </a>
          </div>
          <div className="story-media">
            <video className="story-main" autoPlay muted loop playsInline preload={storyVideoReady ? "metadata" : "none"} poster={projectFacts.images.elevation} aria-label="Poulomi Florique landscaped residential experience video">
              {storyVideoReady ? (
                <>
                  <source media="(min-width: 768px)" src={projectFacts.videos.storyDesktop} type="video/mp4" />
                  <source src={projectFacts.videos.storyMobile} type="video/mp4" />
                </>
              ) : null}
            </video>
            <Image src={projectFacts.images.botanicalMacro} alt="" width={180} height={230} className="story-inset" aria-hidden="true" />
          </div>
        </section>

        <section id="residences" className="editorial-section residences-section">
          <BotanicalMask name="cornerBottom" className="residence-botanical residence-botanical--lower" />
          <BotanicalMask name="branch" className="residence-botanical residence-botanical--upper" />
          <BotanicalMask name="divider" className="residence-divider-botanical" />
          <SectionLabel index="05" eyebrow="Choose your home" />
          <div className="residence-intro">
            <h2>Three 3 BHK Home Formats</h2>
            <p className="residence-note">Choose the core format that fits your lifestyle. Areas shown in sq. ft. SBUA.</p>
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
                    const nextPlan = getRepresentativePlan(family.label);
                    setSelectedPlan(nextPlan);
                    trackEvent("residence_family_select", { residence: family.label });
                  }}
                >
                  <strong>
                    <span className="family-label-full">{family.label}</span>
                    <span className="family-label-compact">{familyCompactLabels[family.label]}</span>
                  </strong>
                  <span>{family.summary} | {getRepresentativePlan(family.label).areaSqFt.toLocaleString("en-IN")} sq. ft.</span>
                </button>
              ))}
            </div>
          </div>
          <div className="residence-browser">
            <article className="plan-stage">
              <BotanicalMask name="corner" className="plan-botanical" />
              <div className="plan-stage-copy">
                <p>{selectedPlan.family}{selectedPlan.qualifier ? ` with ${selectedPlan.qualifier}` : ""}</p>
                <h3>{selectedPlan.areaSqFt.toLocaleString("en-IN")} sq. ft. {selectedPlan.areaType}</h3>
                <span>Blocks {selectedPlan.blocks.join("/")} | Unit {selectedPlan.unitTypes.join(", ")} | {selectedPlan.status === "derived-from-approved-sheet" ? "Derived from approved overview sheet" : "Supplied individual plan"}</span>
              </div>
              <button type="button" className="plan-image-button" aria-label={`View ${selectedPlan.family} ${selectedPlan.areaSqFt.toLocaleString("en-IN")} sq. ft. floor plan`} onClick={() => { resetViewer(); setPlanOpen(true); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPlan.src}
                  alt={`${selectedPlan.family} ${selectedPlan.areaSqFt} sq. ft. ${selectedPlan.areaType} floor plan`}
                  width={selectedPlan.width}
                  height={selectedPlan.height}
                  className="object-contain"
                  loading="lazy"
                  decoding="async"
                  style={{ display: "block", width: "100%", maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
              </button>
              <div className="plan-stage-actions">
                <button
                  type="button"
                  className="rose-cta"
                  onClick={() =>
                    openLead({
                      intent: "floor_plan",
                      ctaSource: `floor-plan-${selectedPlan.id}`,
                      title: "Download Floor Plan",
                      description: `${selectedPlan.family}, ${selectedPlan.areaSqFt.toLocaleString("en-IN")} sq. ft. ${selectedPlan.areaType}. Share your details to download the floor plan.`,
                      selectedPlan,
                      downloadUrl: selectedPlan.src,
                      downloadFileName: `poulomi-florique-${selectedPlan.id}-floor-plan.${selectedPlan.src.split(".").pop() ?? "webp"}`,
                    })
                  }
                >
                  Download Floor Plan
                </button>
              </div>
            </article>
          </div>
        </section>

        <section id="masterplan" className="editorial-section masterplan-section">
          <BotanicalMask name="branch" className="master-botanical" />
          <BotanicalMask name="cluster" className="master-cluster-botanical" />
          <SectionLabel index="06" eyebrow="Master plan" />
          <div className="master-copy">
            <h2>Designed with green at the heart.</h2>
            <button type="button" className="text-cta" onClick={() => { resetViewer(); setMasterPlanOpen(true); }}>
              View Full Master Plan <Download size={15} />
            </button>
          </div>
          <div className="master-image-wrap">
            <button type="button" className="master-image" aria-label="View full Poulomi Florique master plan" onClick={() => { resetViewer(); setMasterPlanOpen(true); }}>
              <picture>
                <source media="(min-width: 1024px)" srcSet={projectFacts.images.masterPlanAvif} type="image/avif" />
                <source media="(min-width: 1024px)" srcSet={projectFacts.images.masterPlanWebp} type="image/webp" />
                <source srcSet={projectFacts.images.masterPlanLayoutAvif} type="image/avif" />
                <source srcSet={projectFacts.images.masterPlanLayoutWebp} type="image/webp" />
                <img
                  src={projectFacts.images.masterPlanLayout}
                  alt="Poulomi Florique horizontal master plan layout preview"
                  width={2048}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
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
          </aside>
        </section>

        <section id="location" className="editorial-section location-section">
          <BotanicalMask name="cornerTop" className="location-botanical" />
          <SectionLabel index="07" eyebrow="North Bengaluru" />
          <div className="location-copy">
            <h2>Well connected. Well placed.</h2>
            <p>Located in Thanisandra, close to major business hubs, schools, healthcare and everyday conveniences.</p>
          </div>
          <button type="button" className="location-visual location-map-card" aria-label="View Poulomi Florique location map" onClick={() => { resetViewer(); setLocationMapOpen(true); }}>
            <picture>
              <source media="(min-width: 768px)" srcSet={projectFacts.images.locationMapDesktopAvif} type="image/avif" />
              <source media="(min-width: 768px)" srcSet={projectFacts.images.locationMapDesktopWebp} type="image/webp" />
              <source srcSet={projectFacts.images.locationMapMobileAvif} type="image/avif" />
              <source srcSet={projectFacts.images.locationMapMobileWebp} type="image/webp" />
              <img
                src={projectFacts.images.locationMapMobile}
                alt="Poulomi Florique actual neighbourhood map connectivity view"
                width={1200}
                height={1200}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </button>
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

        <section id="faqs" className="faq-section">
          <BotanicalMask name="cornerBottom" className="faq-botanical" />
          <SectionLabel index="08" eyebrow="Frequently asked questions" />
          <div className="faq-copy">
            <h2>Frequently Asked Questions About Poulomi Florique</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((faq) => {
              const open = openFaq === faq.question;
              return (
                <article key={faq.question} className={open ? "open" : ""}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => {
                      setOpenFaq(open ? "" : faq.question);
                      trackEvent("faq_open", { question: faq.question });
                    }}
                  >
                    {faq.question}
                    <span aria-hidden="true">{open ? "-" : "+"}</span>
                  </button>
                  <div className="faq-answer" aria-hidden={!open}>
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="private-viewing" className="enquiry-section">
          <BotanicalMask name="cornerBottom" className="faq-botanical enquiry-botanical" />
          <div className="green-quote">
            <BotanicalMask name="cluster" />
            <ProjectLogo light context="hero" />
            <Quote className="quote-mark" size={34} />
            <h2><span>Homes that bloom</span><span>with possibility.</span></h2>
            <p>Book your private viewing today.</p>
          </div>
          <aside className="final-form-card">
            <p>Ready to Experience Poulomi Florique?</p>
            <span className="final-form-subcopy">Please provide your details so our team can coordinate and schedule your project site visit.</span>
            <LeadForm
              intent="site_visit"
              ctaSource="final-form"
              formName="private-viewing"
              selectedPlan={selectedPlan}
              showMessage={false}
              showConsent={false}
            />
          </aside>
        </section>
      </main>

      <footer id="legal" className="footer">
        <div className="footer-brand">
          <ProjectLogo light context="footer" />
          <p>{projectFacts.locationShort}</p>
          <small>RERA Reg. No. {projectFacts.rera.registration}</small>
        </div>
        <nav className="footer-links" aria-label="Legal pages">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-and-conditions">Terms & Conditions</a>
        </nav>
        <p className="footer-disclaimer">
          {micrositeDisclaimer}
        </p>
      </footer>

      <div className={`mobile-action-bar ${mobileCtaCompact ? "is-compact" : ""}`}>
        <button
          type="button"
          aria-label="Open enquiry form"
          onClick={openMobileEnquiry}
        >
          <PhoneCall size={18} />
          Enquire
        </button>
      </div>

      {menuOpen ? (
        <div className={`menu-overlay ${menuClosing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" className="menu-close" aria-label="Close menu" onClick={closeMenu}><X /></button>
          <div className="menu-logo"><ProjectLogo /></div>
          {navItems.map((item) => (
            <a key={`menu-${item.id}-${item.label}`} href={`#${item.id}`} onClick={(event) => handleNavLinkClick(event, item.id, `menu-${item.label.toLowerCase()}`)}>
              {item.label}
            </a>
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
          <aside className={`lead-panel ${leadOverlay.intent === "floor_plan" ? "lead-panel--floor-plan" : ""}`}>
            <button type="button" className="panel-close" aria-label="Close enquiry form" onClick={() => setLeadOverlay(null)}><X size={18} /></button>
            <ProjectLogo context="hero" />
            <h2 id="lead-title">{leadOverlay.title}</h2>
            <span>{leadOverlay.description}</span>
            <LeadForm
              intent={leadOverlay.intent}
              ctaSource={leadOverlay.ctaSource}
              formName="lead-overlay"
              selectedPlan={leadOverlay.selectedPlan}
              downloadOnSuccess={
                leadOverlay.downloadUrl
                  ? {
                      url: leadOverlay.downloadUrl,
                      fileName: leadOverlay.downloadFileName ?? "poulomi-florique-floor-plan.webp",
                    }
                  : undefined
              }
              showMessage={leadOverlay.intent !== "floor_plan"}
              showConsent={leadOverlay.intent !== "floor_plan"}
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
              alt={`${selectedPlan.family} ${selectedPlan.areaSqFt} sq. ft. ${selectedPlan.areaType} floor plan enlarged`}
              width={selectedPlan.width}
              height={selectedPlan.height}
              sizes="100vw"
              className="object-contain"
              style={{ transform: `scale(${viewerZoom})` }}
            />
          </div>
        </div>
      ) : null}

      {masterPlanOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Master plan viewer">
          <ZoomControls onClose={() => setMasterPlanOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close master plan" />
          <div className="lightbox-canvas">
            <Image src={projectFacts.images.masterPlanWebp} alt="Poulomi Florique horizontal master plan enlarged" width={2048} height={1152} sizes="100vw" className="object-contain" style={{ transform: `scale(${viewerZoom})` }} />
          </div>
        </div>
      ) : null}

      {locationMapOpen ? (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Official location map viewer">
          <ZoomControls onClose={() => setLocationMapOpen(false)} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetViewer} closeLabel="Close location map" />
          <div className="lightbox-canvas">
            <Image src={projectFacts.images.locationMapDesktopWebp} alt="Poulomi Florique actual neighbourhood map connectivity view enlarged" width={2400} height={2400} sizes="100vw" className="object-contain" style={{ transform: `scale(${viewerZoom})` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
