"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AfricanTree,
  Brain,
  Community,
  Flower,
  HomeAltSlim,
  Leaf,
  Stroller,
  TennisBallAlt,
  Walking,
} from "iconoir-react";
import type { IconType } from "react-icons";
import {
  PiAirplaneTakeoffDuotone,
  PiArrowRightDuotone,
  PiBabyDuotone,
  PiBrainDuotone,
  PiBuildingsDuotone,
  PiCalendarDotsDuotone,
  PiDownloadSimpleDuotone,
  PiEnvelopeSimpleDuotone,
  PiFlowerLotusDuotone,
  PiGraduationCapDuotone,
  PiHouseLineDuotone,
  PiMapPinAreaDuotone,
  PiParkDuotone,
  PiPlantDuotone,
  PiTennisBallDuotone,
} from "react-icons/pi";
import { TbChevronDown, TbMenu2, TbX } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  amenityHighlights,
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

type LeadAction = "price_sheet" | "brochure" | "floor_plan" | "site_visit";
type ModalKind = LeadAction;
type Unit = (typeof units)[number];

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
  kind: ModalKind;
  ctaSource: string;
  title: string;
  description: string;
  unit: Unit;
};

const mainLeadFormSchema = z.object({
  lead_name: z.string().trim().min(2, "Please enter your name."),
  lead_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Use numbers only."),
  lead_unit_type: z.string().min(1, "Please choose an apartment option."),
});

const secondaryLeadFormSchema = z.object({
  lead_name: z.string().trim().min(2, "Please enter your name."),
  lead_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Use numbers only."),
});

type MainLeadFormValues = z.infer<typeof mainLeadFormSchema>;
type SecondaryLeadFormValues = z.infer<typeof secondaryLeadFormSchema>;

const blankHiddenFields: HiddenLeadFields = {
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

const primaryUnit = units.find((unit) => unit.primary) ?? units[0];

const navItems = [
  ["Why Florique", "overview"],
  ["Floor Plans", "floorplans"],
  ["Amenities", "amenities"],
  ["Location", "location"],
  ["Enquire", "final-enquiry"],
] as const;

const heroHighlights = [
  "3 BHK and 3.5 BHK residences from 1,585 to 2,740 sq ft",
  "720 apartments across 8.66 acres with 85% open spaces",
  "37,800 sq ft clubhouse plus 27,500 sq ft sports and wellness zone",
] as const;

const heroImages = {
  desktop: "/florique/hero/official-desktop.jpg",
  tablet: "/florique/hero/official-tablet.jpg",
  mobileLarge: "/florique/hero/official-mobile.jpg",
  mobile: "/florique/hero/official-mobile.jpg",
} as const;

const locationMapImages = {
  desktop: "/florique/location/map-desktop.jpg",
  tablet: "/florique/location/map-tablet.jpg",
  mobile: "/florique/location/map-mobile.jpg",
} as const;

const amenityIcons: Record<string, IconType> = {
  "37,800 sq ft Clubhouse": PiBuildingsDuotone,
  "27,500 sq ft Sports Zone": PiTennisBallDuotone,
  "25M Lap Pool": PiFlowerLotusDuotone,
  "Outdoor Yoga Deck": PiBrainDuotone,
  "Co-working Lounge": PiHouseLineDuotone,
  "Indoor Games & AV Room": PiTennisBallDuotone,
  "Children's Play & Creche": PiBabyDuotone,
  "Butterfly Garden": PiPlantDuotone,
  "Reflexology Garden": PiBrainDuotone,
  "Pet Garden": PiParkDuotone,
  "Event Lawn": PiFlowerLotusDuotone,
  "Vehicle-Free Podium": PiParkDuotone,
};

const uspIcons: Record<string, IconType> = {
  "8.66 Acres": PiParkDuotone,
  "3 BHK Homes": PiHouseLineDuotone,
  "37,800 sq ft Clubhouse": PiBuildingsDuotone,
  "27,500 sq ft Sports Zone": PiTennisBallDuotone,
  "Water-Sensitive Design": PiPlantDuotone,
  "Privacy & Vastu": PiHouseLineDuotone,
};

const locationIcons: Record<string, IconType> = {
  Education: PiGraduationCapDuotone,
  Healthcare: PiBuildingsDuotone,
  Lifestyle: PiFlowerLotusDuotone,
  "Tech Parks": PiBuildingsDuotone,
  Transit: PiAirplaneTakeoffDuotone,
};

const uspDesktopIcons = {
  "8.66 Acres": Leaf,
  "3 BHK Homes": HomeAltSlim,
  "37,800 sq ft Clubhouse": Community,
  "27,500 sq ft Sports Zone": TennisBallAlt,
  "Water-Sensitive Design": AfricanTree,
  "Privacy & Vastu": HomeAltSlim,
} as const;

const amenityDesktopIcons = {
  "37,800 sq ft Clubhouse": Community,
  "27,500 sq ft Sports Zone": TennisBallAlt,
  "25M Lap Pool": Flower,
  "Outdoor Yoga Deck": Brain,
  "Co-working Lounge": HomeAltSlim,
  "Indoor Games & AV Room": TennisBallAlt,
  "Children's Play & Creche": Stroller,
  "Butterfly Garden": Leaf,
  "Reflexology Garden": Brain,
  "Pet Garden": Walking,
  "Event Lawn": Flower,
  "Vehicle-Free Podium": Leaf,
} as const;

const actionLabels: Record<LeadAction, string> = {
  price_sheet: "Enquiry",
  brochure: "Get Brochure",
  floor_plan: "Get Floor Plan",
  site_visit: "Book Site Visit",
};

function BrandLogo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <div
      className={`flex shrink-0 items-center gap-2.5 ${
        isLight ? "text-white" : "text-[var(--foreground)]"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 46 67"
        className={`h-10 w-auto shrink-0 ${isLight ? "text-white" : "text-[var(--brand-red)]"}`}
        fill="currentColor"
      >
        <path d="M22.0498 25.88C21.5706 25.88 21.0914 25.88 20.6122 25.8267C17.4442 25.6404 13.1048 24.7086 10.5491 21.3809C8.55246 18.7985 7.62069 15.1513 7.72718 10.5989C7.80705 7.4043 8.25962 6.95172 8.44597 6.79199L8.8453 6.41928H9.40437C17.1247 6.97834 20.7986 10.2262 22.4225 12.4359C24.1263 10.1464 27.8534 6.79199 35.3608 6.4459H35.9731L36.4257 6.89848C37.4107 8.0166 36.7452 15.0448 36.7452 15.0981C35.8933 20.3692 32.6986 23.9366 27.8002 25.1612C25.9899 25.6138 23.9932 25.8533 22.0498 25.8533V25.88ZM10.3894 9.08148C10.3361 9.72041 10.2829 10.4658 10.2563 10.6522C10.1498 14.6189 10.9218 17.707 12.5458 19.8368C14.6223 22.5522 18.589 23.1645 20.7453 23.2976C22.8751 23.4307 25.1646 23.2178 27.1612 22.7386C31.1013 21.7536 33.5239 18.9849 34.2427 14.6987C34.3226 14.1663 34.4557 10.732 34.4024 9.05486C25.8301 9.85352 23.6738 15.2045 23.5673 15.4441L22.2894 18.7985L21.1979 15.3909C21.1181 15.1779 19.3078 10.0931 10.3894 9.1081V9.08148Z" />
        <path d="M20.9821 32.8025L19.9173 32.7492C13.7942 32.483 9.13535 30.513 6.10044 26.919C1.46821 21.4349 2.34674 14.2469 2.37336 13.9275L2.50647 12.9691L3.46486 12.836C9.98725 12.0107 14.8857 13.2886 17.9739 16.6429C23.1119 22.2069 21.3016 31.3649 21.2217 31.7376L21.0088 32.7759L20.9821 32.8025ZM4.79596 15.232C4.74272 17.202 5.03556 21.781 8.01722 25.2951C10.4132 28.117 14.0604 29.741 18.879 30.1403C19.1718 27.7443 19.4381 21.9673 16.0837 18.3467C13.7143 15.791 9.90739 14.7528 4.79596 15.232Z" />
        <path d="M24.2286 32.8008L24.0156 31.7625C23.9358 31.3632 22.0988 22.2318 27.2635 16.6678C30.3783 13.3135 35.2501 12.009 41.7725 12.8609L42.7309 12.994L42.864 13.9524C42.8906 14.2452 43.7692 21.4598 39.1369 26.9439C36.102 30.5645 31.4432 32.5079 25.3201 32.7741L24.2552 32.8274L24.2286 32.8008ZM38.0987 15.1237C34.1054 15.1237 31.0971 16.2153 29.1004 18.3716C25.7461 21.9922 26.0389 27.7958 26.3051 30.1652C31.1237 29.7659 34.7709 28.1419 37.1669 25.32C40.1486 21.7793 40.4414 17.2269 40.3882 15.2569C39.5895 15.177 38.8175 15.1504 38.072 15.1504L38.0987 15.1237Z" />
        <path d="M25.3775 2.95834L23.0611 0.641904C22.7066 0.287389 22.137 0.282225 21.7888 0.630366L19.514 2.90517C19.1659 3.25331 19.171 3.82292 19.5256 4.17744L21.842 6.49388C22.1965 6.84839 22.7661 6.85356 23.1143 6.50542L25.3891 4.23062C25.7372 3.88248 25.732 3.31286 25.3775 2.95834Z" />
        <path d="M27.0034 66.5057H24.1282V53.6739C24.1282 48.2164 24.421 42.4926 27.9351 37.9137C31.2895 33.521 37.8918 31.2049 43.1097 34.9586C45.1596 36.4228 46.1712 38.313 45.8517 40.1233L43.0032 39.6441C43.1629 38.6324 41.8318 37.5942 41.4325 37.3013C37.6255 34.5859 32.7537 36.3696 30.2246 39.6441C27.2696 43.5043 27.03 48.6956 27.03 53.6473V66.4791L27.0034 66.5057Z" />
        <path d="M27.0034 58.2266H24.1282C24.1282 53.1685 27.7488 48.8557 32.7271 47.9772L37.1463 47.2051L37.6521 50.0537L33.2329 50.8257C29.6389 51.4647 27.03 54.5794 27.03 58.2266H27.0034Z" />
        <path d="M21.755 66.5048H18.8798V53.673C18.8798 48.6947 18.6402 43.53 15.6851 39.6698C13.1561 36.3687 8.28422 34.585 4.47727 37.3271C4.07794 37.6199 2.72022 38.6582 2.90657 39.6698L0.0580198 40.149C-0.261444 38.3387 0.750194 36.4485 2.80009 34.9843C8.04462 31.2306 14.6203 33.5467 17.9746 37.9394C21.4887 42.5184 21.7816 48.2421 21.7816 53.6996V66.5314L21.755 66.5048Z" />
        <path d="M21.7549 58.2255H18.8798C18.8798 54.5782 16.2708 51.4635 12.6768 50.8245L8.23096 50.0525L8.73678 47.2039L13.1827 47.976C18.161 48.8545 21.7816 53.1673 21.7816 58.2255H21.7549Z" />
      </svg>
      <span className="grid leading-none">
        <span className="font-[family-name:var(--font-display)] text-[0.92rem] uppercase tracking-[0.12em]">
          Poulomi
        </span>
        <span
          className={`font-[family-name:var(--font-display)] text-[0.82rem] uppercase tracking-[0.34em] ${
            isLight ? "text-white/88" : "text-[var(--brand-red)]"
          }`}
        >
          Florique
        </span>
      </span>
    </div>
  );
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

function SectionHeader({
  title,
  body,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <h2 className="display-title text-[2.05rem] leading-[0.96] tracking-normal md:text-[3.15rem]">
        {title}
      </h2>
      {body ? (
        <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)] md:text-base md:leading-7">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function MainLeadForm({
  hiddenBase,
  formName,
  ctaSource,
  selectedUnit,
  submitLabel,
  compact = false,
  showUnitField = true,
  onSuccess,
}: {
  hiddenBase: HiddenLeadFields;
  formName: string;
  ctaSource: string;
  selectedUnit: Unit;
  submitLabel: string;
  compact?: boolean;
  showUnitField?: boolean;
  onSuccess?: (values: MainLeadFormValues) => void;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [started, setStarted] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<MainLeadFormValues>({
    resolver: zodResolver(mainLeadFormSchema),
    defaultValues: {
      lead_name: "",
      lead_phone: "",
      lead_unit_type: selectedUnit.label,
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
      unit_type: selectedUnit.label,
    });
  };

  const onSubmit = async (values: MainLeadFormValues) => {
    setStatus("idle");
    trackEvent("lead_form_submit", {
      form_name: formName,
      cta_source: ctaSource,
      lead_action: "price_sheet",
      unit_type: values.lead_unit_type,
    });

    try {
      await submitLead({
        ...hiddenBase,
        cta_source: ctaSource,
        form_name: formName,
        timestamp: new Date().toISOString(),
        lead_action: "price_sheet",
        lead_name: values.lead_name,
        lead_phone: values.lead_phone,
        lead_unit_type: values.lead_unit_type,
        name: values.lead_name,
        phone: values.lead_phone,
        interestedIn: values.lead_unit_type,
        preferredAction: "price_sheet",
        source: ctaSource,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: "price_sheet",
          unitSelected: values.lead_unit_type,
        }),
      });
      setStatus("success");
      reset({
        lead_name: "",
        lead_phone: "",
        lead_unit_type: selectedUnit.label,
      });
      onSuccess?.(values);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      className={`mt-4 grid ${compact ? "gap-2.5" : "gap-3"}`}
      onFocus={onFocus}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-2.5 md:grid-cols-2">
        <div>
          <label className="form-label text-[var(--foreground)]" htmlFor={`${formName}-name`}>
            Name
          </label>
          <input id={`${formName}-name`} className="compact-input" autoComplete="name" {...register("lead_name")} />
          {errors.lead_name ? <p className="form-error">{errors.lead_name.message}</p> : null}
        </div>
        <div>
          <label className="form-label text-[var(--foreground)]" htmlFor={`${formName}-phone`}>
            Number
          </label>
          <input
            id={`${formName}-phone`}
            className="compact-input"
            autoComplete="tel"
            inputMode="tel"
            type="tel"
            {...register("lead_phone")}
          />
          {errors.lead_phone ? <p className="form-error">{errors.lead_phone.message}</p> : null}
        </div>
      </div>

      {showUnitField ? (
        <div>
          <div>
            <label className="form-label text-[var(--foreground)]" htmlFor={`${formName}-unit`}>
              Interested in
            </label>
            <div className="relative">
              <select id={`${formName}-unit`} className="compact-input select-input" {...register("lead_unit_type")}>
                {units.map((unit) => (
                  <option key={unit.slug} value={unit.label}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <TbChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[1.1rem] text-[var(--brand-red)]" />
            </div>
            {errors.lead_unit_type ? <p className="form-error">{errors.lead_unit_type.message}</p> : null}
          </div>
        </div>
      ) : (
        <input type="hidden" {...register("lead_unit_type")} />
      )}

      <Button
        type="submit"
        className={`cta-button-red w-full ${compact ? "min-h-11" : "min-h-12"}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : submitLabel}
      </Button>

      {!compact ? (
        <p className="text-[0.72rem] leading-5 text-[var(--foreground-muted)]">
          Your details are used only to share project information and brochure access.
        </p>
      ) : null}

      {status === "success" && !onSuccess ? (
        <p className="text-sm font-semibold text-[var(--brand-red)]">
          Thank you. We have your request and will connect shortly.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          We could not submit right now. Please try again in a moment.
        </p>
      ) : null}
    </form>
  );
}

function SecondaryLeadForm({
  hiddenBase,
  formName,
  ctaSource,
  selectedUnit,
  action,
  submitLabel,
}: {
  hiddenBase: HiddenLeadFields;
  formName: string;
  ctaSource: string;
  selectedUnit: Unit;
  action: LeadAction;
  submitLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<SecondaryLeadFormValues>({
    resolver: zodResolver(secondaryLeadFormSchema),
    defaultValues: {
      lead_name: "",
      lead_phone: "",
    },
  });

  useEffect(() => {
    reset({
      lead_name: "",
      lead_phone: "",
    });
  }, [reset, selectedUnit.slug]);

  const onSubmit = async (values: SecondaryLeadFormValues) => {
    setStatus("idle");

    try {
      await submitLead({
        ...hiddenBase,
        cta_source: ctaSource,
        form_name: formName,
        timestamp: new Date().toISOString(),
        lead_action: action,
        lead_name: values.lead_name,
        lead_phone: values.lead_phone,
        lead_unit_type: selectedUnit.label,
        name: values.lead_name,
        phone: values.lead_phone,
        interestedIn: selectedUnit.label,
        preferredAction: action,
        source: ctaSource,
        metadata: getLeadMetadata({
          ctaSource,
          pageSection: formName,
          preferredAction: action,
          unitSelected: selectedUnit.label,
        }),
      });
      setStatus("success");
      reset({
        lead_name: "",
        lead_phone: "",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="form-label" htmlFor={`${formName}-name`}>
          Name
        </label>
        <input id={`${formName}-name`} className="compact-input" autoComplete="name" {...register("lead_name")} />
        {errors.lead_name ? <p className="form-error">{errors.lead_name.message}</p> : null}
      </div>
      <div>
        <label className="form-label" htmlFor={`${formName}-phone`}>
          Number
        </label>
        <input
          id={`${formName}-phone`}
          className="compact-input"
          autoComplete="tel"
          inputMode="tel"
          type="tel"
          {...register("lead_phone")}
        />
        {errors.lead_phone ? <p className="form-error">{errors.lead_phone.message}</p> : null}
      </div>
      <Button
        type="submit"
        className="cta-button-red min-h-11 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : submitLabel}
      </Button>
      {status === "success" ? (
        <p className="text-sm font-semibold text-[var(--brand-red)]">
          Thank you. We have your request and will connect shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          Submission failed just now. Please try again in a moment.
        </p>
      ) : null}
    </form>
  );
}

export function LandingPage() {
  const shellRef = useRef<HTMLDivElement>(null);
  const heroTopRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(primaryUnit);
  const [leadModal, setLeadModal] = useState<LeadModal | null>(null);
  const [activeLocationCategory, setActiveLocationCategory] = useState<
    (typeof locationClusters)[number]["label"]
  >(locationClusters[0]?.label ?? "Landmarks");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolledHeader, setHasScrolledHeader] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLocationMapOpen, setIsLocationMapOpen] = useState(false);

  const hiddenBase = useMemo<HiddenLeadFields>(() => {
    if (typeof window === "undefined") {
      return blankHiddenFields;
    }

    const params = new URLSearchParams(window.location.search);
    const deviceType = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";

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
      cta_source: "",
      form_name: "",
      device_type: deviceType,
      timestamp: new Date().toISOString(),
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-card"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const scrollResetStorageKey = "__florique_force_scroll_top";

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navigationEntries =
      typeof window.performance.getEntriesByType === "function"
        ? window.performance.getEntriesByType("navigation")
        : [];
    const navigation = navigationEntries[0] as PerformanceNavigationTiming | undefined;

    const resetScrollPosition = () => {
      if (window.location.hash) {
        return;
      }

      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
      window.setTimeout(() => window.scrollTo(0, 0), 220);
    };

    const shouldResetScroll =
      !window.location.hash ||
      window.sessionStorage.getItem(scrollResetStorageKey) === "1" ||
      navigation?.type === "reload";

    if (shouldResetScroll) {
      window.sessionStorage.removeItem(scrollResetStorageKey);
      resetScrollPosition();
    }

    const updateHeaderState = () => setHasScrolledHeader(window.scrollY > 24);
    const markScrollReset = () => window.sessionStorage.setItem(scrollResetStorageKey, "1");

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("beforeunload", markScrollReset);

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("beforeunload", markScrollReset);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !heroTopRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasScrolledHeader(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-24px 0px 0px 0px",
      },
    );

    observer.observe(heroTopRef.current);

    return () => observer.disconnect();
  }, []);

  const modalLeadAction: LeadAction = leadModal?.kind ?? "price_sheet";

  const openLeadModal = (
    kind: ModalKind,
    ctaSource: string,
    title: string,
    description: string,
    unit = selectedUnit,
  ) => {
    setLeadModal({
      kind,
      ctaSource,
      title,
      description,
      unit,
    });
  };

  const showSuccessToast = () => {
    setToastMessage("Thank you. Your enquiry has been received.");
  };

  const redirectToThankYou = () => {
    window.location.assign("/thank-you");
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 3600);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const scrollToSection = (sectionId: string, source: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    setIsMobileMenuOpen(false);
    trackEvent("cta_section_jump", {
      cta_source: source,
      target_section: sectionId,
      unit_type: selectedUnit.label,
    });

    const headerOffset = window.matchMedia("(max-width: 1023px)").matches ? 88 : 104;
    const nextTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(nextTop, 0),
      behavior: "smooth",
    });
  };

  return (
    <div ref={shellRef} className="bg-[var(--background)] text-[var(--foreground)]">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          hasScrolledHeader || isMobileMenuOpen
            ? "bg-white/95 shadow-[0_16px_34px_rgba(22,18,20,0.1)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="section-shell py-2 md:py-3">
          <div
            className={`site-nav-shell flex items-center justify-between gap-3 px-0 py-1 transition-all duration-300 md:rounded-full md:px-3 md:py-2 ${
              hasScrolledHeader || isMobileMenuOpen
                ? "text-[var(--foreground)] md:bg-white/85"
                : "text-white"
            }`}
          >
            <a href="#hero" className="flex min-w-0 items-center gap-3" aria-label="Poulomi Florique home">
              <BrandLogo tone={hasScrolledHeader || isMobileMenuOpen ? "dark" : "light"} />
              <div className="hidden min-w-0 lg:block">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              hasScrolledHeader || isMobileMenuOpen ? "text-[var(--brand-red)]" : "text-white/88"
                  }`}
                >
                  Poulomi Estates
                </p>
                <p
                  className={`truncate text-sm ${
                    hasScrolledHeader || isMobileMenuOpen ? "text-[var(--foreground-muted)]" : "text-white/78"
                  }`}
                >
                  Thanisandra, North Bengaluru
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-1 text-sm font-semibold lg:flex" aria-label="Main navigation">
              {navItems.map(([label, sectionId]) => (
                <button
                  key={sectionId}
                  type="button"
                  onClick={() => scrollToSection(sectionId, `desktop-nav-${sectionId}`)}
                  className={`rounded-full px-4 py-2 transition ${
                    hasScrolledHeader || isMobileMenuOpen
                      ? "text-[var(--foreground-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]"
                      : "text-white/80 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                className="cta-button-red hidden lg:inline-flex"
                size="sm"
                onClick={() =>
                  openLeadModal(
                    "price_sheet",
                    "header-enquire",
                    "Request price details",
                    "Share your details and we will send the current price guidance for your preferred apartment option.",
                  )
                }
              >
                Enquire
              </Button>
              <button
                type="button"
                className={`flex size-11 items-center justify-center rounded-full transition lg:hidden ${
                  hasScrolledHeader || isMobileMenuOpen
                    ? "bg-[var(--surface-alt)] text-[var(--foreground)]"
                    : "bg-black/18 text-white hover:bg-black/26"
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                {isMobileMenuOpen ? <TbX className="text-[1.35rem]" /> : <TbMenu2 className="text-[1.35rem]" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div className="mt-2 rounded-[1.4rem] bg-white p-3 shadow-[0_24px_50px_rgba(14,8,10,0.12)] lg:hidden">
              <nav className="grid gap-2" aria-label="Mobile navigation">
                {navItems.map(([label, sectionId]) => (
                  <button
                    key={sectionId}
                    type="button"
                    onClick={() => scrollToSection(sectionId, `mobile-nav-${sectionId}`)}
                    className="flex items-center justify-between rounded-[1rem] bg-[var(--surface-alt)] px-4 py-3 text-left text-sm font-semibold text-[var(--foreground)]"
                  >
                    <span>{label}</span>
                    <PiArrowRightDuotone className="text-xl" />
                  </button>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </header>

      <main className="pb-24 lg:pb-10">
        <section id="hero" className="relative overflow-hidden bg-white">
          <div ref={heroTopRef} className="absolute top-0 h-px w-px" aria-hidden="true" />
          <div className="hero-entry lg:hidden">
            <Image
              src={heroImages.mobile}
              alt="Poulomi Florique landscaped courtyard and pool"
              width={941}
              height={1672}
              sizes="100vw"
              className="block h-auto w-full sm:hidden"
              priority
            />
            <Image
              src={heroImages.mobileLarge}
              alt="Poulomi Florique tower elevation"
              width={941}
              height={1672}
              sizes="100vw"
              className="hidden h-auto w-full sm:block md:hidden"
              priority
            />
            <Image
              src={heroImages.tablet}
              alt="Poulomi Florique tower elevation"
              width={1086}
              height={1448}
              sizes="100vw"
              className="hidden h-auto w-full md:block"
              priority
            />
          </div>

          <div className="absolute inset-0 hidden lg:block">
            <Image
              src={heroImages.desktop}
              alt="Poulomi Florique tower and clubhouse elevation"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,32,31,0.84)_0%,rgba(10,32,31,0.5)_48%,rgba(10,32,31,0.22)_100%)]" />
          </div>

          <div className="section-shell relative hidden lg:block">
            <div className="grid min-h-[calc(100svh-8rem)] gap-4 pb-6 pt-0 md:min-h-[82svh] md:gap-8 md:pb-10 md:pt-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="hero-entry text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.52)] md:max-w-[42rem] lg:pt-2">
                <p className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,5.4vw,5.9rem)] font-semibold leading-[0.92] tracking-normal text-white">
                  A World that
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.35rem,4.8vw,5.1rem)] font-semibold leading-[0.92] tracking-normal text-white/90">
                  Blossoms Around You.
                </p>
                <div className="mt-8 flex max-w-[36rem] flex-col gap-4 text-white/90">
                  {heroHighlights.map((item, index) => (
                    <div key={item} className="flex items-start gap-4">
                      <span className="pt-0.5 text-[0.72rem] font-black uppercase text-[var(--brand-red)]">
                        0{index + 1}
                      </span>
                      <span className="mt-3 h-px w-12 shrink-0 bg-[var(--brand-red)]/75" />
                      <p className="max-w-[32rem] text-[1.02rem] font-semibold leading-7 text-white/90">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-entry hidden w-full rounded-[1.9rem] bg-[var(--surface)] p-4 shadow-[0_28px_80px_rgba(71,8,13,0.18)] md:p-5 lg:ml-auto lg:block lg:max-w-[23rem]">
                <div className="rounded-[1.3rem] bg-[var(--brand-red)] px-4 py-3 text-[var(--ink-inverse)]">
                  <h2 className="text-[1.15rem] font-semibold leading-tight text-[var(--ink-inverse)]">
                    Enquire About the Project
                  </h2>
                  <p className="mt-2 text-sm leading-5 text-[var(--brand-cream)]">
                    Share your details below, and our team will get in touch with the complete project details.
                  </p>
                </div>
                <MainLeadForm
                  hiddenBase={hiddenBase}
                  formName="hero"
                  ctaSource="hero-main-form"
                  selectedUnit={selectedUnit}
                  submitLabel="Enquire Now"
                  compact
                  onSuccess={showSuccessToast}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="main-enquiry-form" className="bg-[var(--background)] lg:hidden">
          <div className="section-shell py-6">
            <div className="rounded-[2rem] bg-[var(--surface)] p-4 shadow-[0_24px_70px_rgba(71,8,13,0.08)]">
              <div className="rounded-[1.3rem] bg-[var(--surface-alt)] px-4 py-4">
                <h2 className="display-title text-[1.6rem] leading-[1] tracking-normal">
                  Enquire About the Project
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                  Share your details below, and our team will get in touch with the complete project details.
                </p>
              </div>
              <MainLeadForm
                hiddenBase={hiddenBase}
                formName="mobile-hero"
                ctaSource="mobile-hero-main-form"
                selectedUnit={selectedUnit}
                submitLabel="Enquire Now"
                onSuccess={showSuccessToast}
              />
            </div>
          </div>
        </section>

        <section id="overview" className="bg-[var(--background)]">
          <div className="section-shell py-12 md:py-16">
            <SectionHeader
              eyebrow="Why choose Florique"
              title="Why Choose Poulomi Florique"
              body="Designed for the way life unfolds, Florique blends expansive open spaces, premium 3 BHK homes, water-sensitive planning and city connectivity in Thanisandra."
            />

            <div className="relative mt-8 md:hidden">
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--line)] md:block" />
              <div className="grid gap-5 md:gap-6">
                {uspHighlights.map((item, index) => {
                  const Icon = uspIcons[item.title];
                  const alignsLeft = index % 2 === 0;

                  return (
                    <article
                      key={item.title}
                      data-reveal={alignsLeft ? "left" : "right"}
                      className={`reveal-card relative md:w-[calc(50%-1.5rem)] ${
                        alignsLeft ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      <div className="relative rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_48px_rgba(71,8,13,0.08)] md:p-6">
                        <span
                          className={`absolute top-6 hidden size-14 items-center justify-center rounded-[1.2rem] bg-[var(--surface-alt)] text-[var(--brand-red)] shadow-[0_18px_38px_rgba(71,8,13,0.08)] md:flex ${
                            alignsLeft ? "-right-7" : "-left-7"
                          }`}
                        >
                          <Icon className="text-[1.9rem]" />
                        </span>

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[1.35rem] font-semibold tracking-normal text-[var(--foreground)] md:text-[1.55rem]">
                              {item.title}
                            </h3>
                          </div>
                          <span className="flex size-12 items-center justify-center rounded-[1rem] bg-[var(--surface-alt)] text-[var(--brand-red)] md:hidden">
                            <Icon className="text-[1.75rem]" />
                          </span>
                        </div>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--foreground-muted)] md:text-base md:leading-7">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 hidden md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:gap-x-16">
              {uspHighlights.map((item) => {
                const Icon = uspDesktopIcons[item.title as keyof typeof uspDesktopIcons];

                return (
                  <article
                    key={item.title}
                    className="flex items-start gap-5 border-b border-[var(--line)] pb-10 last:border-b md:last:border-b lg:pb-12"
                  >
                    <div className="shrink-0 pt-1 text-[var(--brand-red)]">
                      <Icon width={44} height={44} strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="text-[1.45rem] font-semibold tracking-normal text-[var(--foreground)] lg:text-[1.7rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[34ch] text-[0.98rem] leading-7 text-[var(--foreground-muted)] lg:text-base">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="floorplans" className="bg-[var(--surface-alt)]">
          <div className="section-shell py-12 md:py-16">
            <SectionHeader eyebrow="Floor plans" title="Choose Apartment Option" />

            <div className="mt-6 rounded-[2rem] bg-[var(--surface)] p-4 shadow-[0_24px_70px_rgba(71,8,13,0.08)] md:p-6">
              <div className="rounded-[1.5rem] bg-[var(--surface-alt)] p-4 md:p-5">
                <label className="form-label text-[var(--foreground)]" htmlFor="floorplan-selector">
                  Choose Apartment option
                </label>
                <div className="relative">
                  <select
                    id="floorplan-selector"
                    value={selectedUnit.slug}
                    onChange={(event) =>
                      setSelectedUnit(units.find((unit) => unit.slug === event.target.value) ?? primaryUnit)
                    }
                    className="compact-input select-input min-h-12 pr-11 text-base font-semibold"
                  >
                    {units.map((unit) => (
                      <option key={unit.slug} value={unit.slug}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <TbChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[1.1rem] text-[var(--brand-red)]" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                <div className="rounded-[1.6rem] bg-[var(--surface-alt)] p-4 md:p-5">
                  <div className="hidden md:block">
                    <h3 className="display-title text-[1.45rem] leading-[1] tracking-normal">
                      Download Floor Plan & Brochure
                    </h3>
                    <MainLeadForm
                      hiddenBase={hiddenBase}
                      formName="floorplans"
                      ctaSource="floorplan-basic-form"
                      selectedUnit={selectedUnit}
                      submitLabel="Get Brochure"
                      compact
                      showUnitField={false}
                    />
                  </div>
                </div>

                <div className="rounded-[1.6rem] bg-white p-4 md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display-title text-[1.55rem] leading-[1] tracking-normal">
                        {selectedUnit.label}
                      </h3>
                    </div>
                    <div className="rounded-full bg-[var(--surface-alt)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-red)]">
                      {selectedUnit.saleableArea} sq ft
                    </div>
                  </div>

                  <div className="relative mt-4 flex min-h-[16rem] items-center justify-center overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-white">
                    <Image
                      key={`${selectedUnit.slug}-image`}
                      src={selectedUnit.image}
                      alt={`${selectedUnit.label} floor plan`}
                      width={1400}
                      height={1050}
                      className="h-full max-h-[22rem] w-full animate-[fade-in_220ms_ease] object-contain p-3 md:p-5"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 md:hidden">
                <Button
                  className="cta-button-red min-h-12 w-full"
                  onClick={() =>
                    openLeadModal(
                      "floor_plan",
                      "floorplan-enquire",
                      `Download ${selectedUnit.label} Floor Plan & Brochure`,
                      "Share your details and we will send the selected apartment plan and brochure.",
                      selectedUnit,
                    )
                  }
                >
                  <PiArrowRightDuotone className="text-xl" />
                  Download Floor Plan & Brochure
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="amenities" className="bg-[var(--background)]">
          <div className="section-shell py-12 md:py-16">
            <SectionHeader
              eyebrow="Amenities"
              title="40+ Amenities for Balance, Energy and Calm"
              body="A 37,800 sq ft clubhouse, 27,500 sq ft sports zone, pool landscapes, co-working spaces and themed gardens create room to recharge, connect and belong."
              align="center"
            />

            <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
              {amenityHighlights.map((item, index) => {
                const Icon = amenityIcons[item.label] ?? PiFlowerLotusDuotone;

                return (
                  <article
                    key={item.label}
                    data-reveal="up"
                    className="reveal-card rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_18px_46px_rgba(71,8,13,0.07)] md:p-5"
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="flex justify-center text-[var(--brand-red)]">
                      <Icon className="text-[2.85rem] md:text-[3.35rem]" />
                    </div>
                    <h3 className="mt-3 text-center text-[1.05rem] font-semibold tracking-normal text-[var(--foreground)] md:text-[1.28rem]">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-center text-sm leading-6 text-[var(--foreground-muted)] md:px-2">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 hidden overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] md:grid md:grid-cols-4">
              {amenityHighlights.map((item, index) => {
                const Icon = amenityDesktopIcons[item.label as keyof typeof amenityDesktopIcons] ?? Community;
                const isLastCol = (index + 1) % 4 === 0;
                const isNotLastRow = index < amenityHighlights.length - 4;

                return (
                  <article
                    key={item.label}
                    className={`relative min-h-[17rem] overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eef1e5_100%)] px-6 py-7 ${
                      !isLastCol ? "border-r border-[var(--line)]" : ""
                    } ${isNotLastRow ? "border-b border-[var(--line)]" : ""}`}
                  >
                    <span className="absolute inset-x-5 top-4 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]" />
                    <span className="absolute inset-x-5 bottom-4 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]" />
                    <div className="relative z-10 flex h-full flex-col items-start">
                      <div className="rounded-[1rem] border border-[rgba(19,50,49,0.16)] bg-white/90 p-3 text-[var(--brand-red)]">
                        <Icon width={38} height={38} strokeWidth={1.6} />
                      </div>
                      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-normal text-[var(--foreground)]">
                        {item.label}
                      </h3>
                      <p className="mt-3 max-w-[18rem] text-sm leading-6 text-[var(--foreground-muted)]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="location" className="bg-[var(--background)]">
          <div className="section-shell py-12 md:py-16">
            <div className="rounded-[2rem] bg-[var(--surface)] p-4 shadow-[0_28px_80px_rgba(71,8,13,0.08)] md:p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.96fr] lg:items-start">
                <div>
                  <SectionHeader
                    eyebrow="Location"
                    title="Connectivity to key schools, tech parks, malls, hospitals and travel hubs."
                    body="Travel times are based on the supplied Poulomi Florique brochure location sheet."
                  />
                  <div className="mt-6 overflow-hidden rounded-[1.7rem] shadow-[0_18px_48px_rgba(71,8,13,0.1)]">
                    <div className="relative h-[22rem] bg-[var(--surface-alt)]">
                      <Image
                        src={locationMapImages.mobile}
                        alt="Poulomi Florique approximate location map"
                        fill
                        sizes="100vw"
                        className="object-contain sm:hidden"
                      />
                      <Image
                        src={locationMapImages.tablet}
                        alt="Poulomi Florique approximate location map"
                        fill
                        sizes="100vw"
                        className="hidden object-contain sm:block lg:hidden"
                      />
                      <Image
                        src={locationMapImages.desktop}
                        alt="Poulomi Florique approximate location map"
                        fill
                        sizes="100vw"
                        className="hidden object-contain lg:block"
                      />
                      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
                        <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-red)] shadow-[0_14px_30px_rgba(71,8,13,0.08)]">
                          Thanisandra, Bengaluru
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsLocationMapOpen(true)}
                          className="cta-button-red pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                        >
                          <PiMapPinAreaDuotone className="text-base" />
                          See approx location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.7rem] bg-[var(--surface-soft)] p-3 md:p-4">
                  <div className="space-y-3">
                    {locationClusters.map((cluster) => {
                      const Icon = locationIcons[cluster.label];
                      const isOpen = activeLocationCategory === cluster.label;

                      return (
                        <div
                          key={cluster.label}
                          className="overflow-hidden rounded-[1.2rem] bg-[var(--surface)] shadow-[0_10px_30px_rgba(71,8,13,0.05)]"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveLocationCategory(cluster.label)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="text-[1.45rem] text-[var(--brand-red)]" />
                              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">
                                {cluster.label}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                              {cluster.items.length} places
                            </span>
                          </button>
                          {isOpen ? (
                            <div className="grid gap-3 px-4 pb-4 animate-[fade-in_220ms_ease]">
                              {cluster.items.map((item) => (
                                <div
                                  key={item.name}
                                  className="flex items-center justify-between gap-3 rounded-[1rem] bg-white/78 px-4 py-3"
                                >
                                  <span className="text-sm font-medium text-[var(--foreground)]">{item.name}</span>
                                  <span className="rounded-full bg-[var(--brand-red)] px-3 py-1 text-xs font-semibold text-white">
                                    {item.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="final-enquiry" className="bg-[var(--surface-alt)]">
          <div className="section-shell pt-12 md:pt-16">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <SectionHeader
                title="Frequently Asked Questions"
                body="Quick answers about location, amenities, brochure and floor plan requests."
              />

              <div className="grid gap-3">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-[1.25rem] border border-[var(--line)] bg-white px-4 py-3 shadow-[0_14px_34px_rgba(71,8,13,0.05)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                      <span>{item.question}</span>
                      <TbChevronDown className="shrink-0 text-[1.25rem] text-[var(--brand-red)] transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="section-shell py-12 md:py-16">
            <div className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-5 shadow-[0_24px_70px_rgba(71,8,13,0.08)] lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
              <div className="relative pl-4">
                <span className="absolute left-0 top-1 h-24 w-1 rounded-full bg-[var(--brand-red)]" />
                <h2 className="display-title max-w-[13ch] text-[2rem] leading-[0.96] tracking-normal md:text-[3rem]">
                  Schedule project site visit
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--foreground-muted)] md:text-base md:leading-7">
                  Please provide your details so our team can coordinate and schedule your project site visit.
                </p>
              </div>

              <div className="rounded-[1.6rem] bg-[var(--surface-alt)] p-4 md:p-5">
                <div className="flex items-center gap-4">
                  <BrandLogo />
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand-red)]">
                      Poulomi Florique
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">Main project enquiry form</p>
                  </div>
                </div>
                <MainLeadForm
                  hiddenBase={hiddenBase}
                  formName="final"
                  ctaSource="final-main-form"
                  selectedUnit={selectedUnit}
                  submitLabel="Schedule Site Visit"
                  onSuccess={redirectToThankYou}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--background)] py-8 text-[var(--foreground)]">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="flex items-center gap-4">
                <BrandLogo />
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-red)]">
                    Poulomi Estates
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">Poulomi Florique</p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
                Poulomi Florique in {projectFacts.locationShort} offers premium 3 BHK residences with a clubhouse, sports zone, open landscapes and strong North Bengaluru connectivity. Request brochure, pricing and site visit support from the project enquiry desk.
              </p>
            </div>

            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--brand-red)]">RERA</p>
              <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">{projectFacts.rera.registration}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">Available at rera.karnataka.gov.in</p>
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-[var(--foreground-muted)]">{micrositeDisclaimer}</p>
        </div>
      </footer>

      <div className="mobile-sticky-actions fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="grid min-h-16 grid-cols-2 overflow-hidden border-t border-[rgba(19,50,49,0.18)] bg-white/96 shadow-[0_-12px_34px_rgba(19,50,49,0.12)] backdrop-blur-xl">
          <button
            type="button"
            aria-label="Enquire Now"
            onClick={() => scrollToSection("main-enquiry-form", "mobile-sticky-enquiry")}
            className="flex min-h-16 items-center justify-center gap-2 border-r border-[rgba(19,50,49,0.16)] px-3 text-[var(--brand-red)] transition active:bg-[var(--surface-alt)]"
          >
            <PiEnvelopeSimpleDuotone className="shrink-0 text-[1.55rem]" />
            <span className="text-sm font-extrabold uppercase tracking-[0.08em]">Enquire Now</span>
          </button>
          <button
            type="button"
            aria-label="Get Brochure"
            onClick={() =>
              openLeadModal(
                "brochure",
                "mobile-sticky-brochure",
                "Get Brochure",
                "Share your details to receive the Poulomi Florique brochure.",
              )
            }
            className="flex min-h-16 items-center justify-center gap-2 px-3 text-[var(--brand-red)] transition active:bg-[var(--surface-alt)]"
          >
            <PiDownloadSimpleDuotone className="shrink-0 text-[1.55rem]" />
            <span className="text-sm font-extrabold uppercase tracking-[0.08em]">Get Brochure</span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50 hidden flex-col gap-3 lg:flex">
        <button
          type="button"
          aria-label="Request brochure"
          onClick={() =>
            openLeadModal(
              "brochure",
              "desktop-sticky-brochure",
              "Request brochure",
              "Share your details to receive the brochure link for Poulomi Florique.",
            )
          }
          className="flex size-14 items-center justify-center rounded-full bg-[rgba(255,255,255,0.94)] text-[var(--brand-red)] shadow-[0_18px_40px_rgba(19,50,49,0.16)]"
        >
          <PiDownloadSimpleDuotone className="text-[1.7rem]" />
        </button>
        <button
          type="button"
          aria-label="Book site visit"
          onClick={() =>
            openLeadModal(
              "site_visit",
              "desktop-sticky-visit",
              "Book a site visit",
              "Tell us how to reach you and we will coordinate a guided site visit.",
            )
          }
          className="flex size-14 items-center justify-center rounded-full bg-[rgba(255,255,255,0.94)] text-[var(--brand-red)] shadow-[0_18px_40px_rgba(19,50,49,0.16)]"
        >
          <PiCalendarDotsDuotone className="text-[1.7rem]" />
        </button>
      </div>

      {isLocationMapOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Approximate location map"
          className="fixed inset-0 z-[70] bg-[rgba(18,7,9,0.94)] p-3 backdrop-blur-md md:p-6"
        >
          <button
            type="button"
            aria-label="Close location map"
            onClick={() => setIsLocationMapOpen(false)}
            className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-white/45 bg-white text-[var(--brand-red)] shadow-[0_18px_42px_rgba(0,0,0,0.24)] transition hover:bg-[var(--surface-alt)] md:right-6 md:top-6"
          >
            <TbX className="text-2xl" />
          </button>
          <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-[var(--surface-soft)] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
            <Image
              src={locationMapImages.mobile}
              alt="Poulomi Florique approximate location map"
              fill
              sizes="100vw"
              className="object-contain sm:hidden"
            />
            <Image
              src={locationMapImages.tablet}
              alt="Poulomi Florique approximate location map"
              fill
              sizes="100vw"
              className="hidden object-contain sm:block lg:hidden"
            />
            <Image
              src={locationMapImages.desktop}
              alt="Poulomi Florique approximate location map"
              fill
              sizes="100vw"
              className="hidden object-contain lg:block"
            />
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="toast-message fixed left-1/2 top-5 z-[60] w-[min(calc(100vw-1.5rem),34rem)] -translate-x-1/2 rounded-[1.6rem] border border-white/70 px-5 py-5 text-center text-base font-bold text-white shadow-[0_30px_90px_rgba(71,8,13,0.28)] backdrop-blur-xl md:px-7 md:py-6 md:text-lg"
        >
          <span className="mx-auto mb-3 block h-1.5 w-20 rounded-full bg-white/90 shadow-[0_0_22px_rgba(255,255,255,0.55)]" />
          {toastMessage}
          <span className="mt-2 block text-sm font-medium text-white/82">
            Our team will connect with you shortly.
          </span>
        </div>
      ) : null}

      <Dialog open={Boolean(leadModal)} onOpenChange={(open) => !open && setLeadModal(null)}>
        <DialogContent>
          {leadModal ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <BrandLogo />
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand-red)]">
                      Poulomi Florique
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">Project enquiry desk</p>
                  </div>
                </div>
                <DialogTitle className="mt-2">{leadModal.title}</DialogTitle>
                <DialogDescription>{leadModal.description}</DialogDescription>
              </DialogHeader>

              <div className="mt-3 rounded-[1.15rem] bg-[var(--surface)] p-3 md:p-4">
                <SecondaryLeadForm
                  hiddenBase={hiddenBase}
                  formName="modal"
                  ctaSource={leadModal.ctaSource}
                  selectedUnit={leadModal.unit}
                  action={modalLeadAction}
                  submitLabel={actionLabels[modalLeadAction]}
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
