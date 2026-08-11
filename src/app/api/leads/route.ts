type LeadPayload = {
  [key: string]: unknown;
  budget?: string;
  callbackTime?: string;
  email?: string;
  interestedIn?: string;
  interest?: string;
  lead_action?: string;
  lead_area_sqft?: number | string;
  lead_area_type?: string;
  lead_blocks?: string;
  lead_budget?: string;
  lead_callback_time?: string;
  lead_name?: string;
  lead_plan_id?: string;
  lead_phone?: string;
  lead_unit_type?: string;
  lead_unit_types?: string;
  metadata?: Record<string, unknown>;
  name?: string;
  note?: string;
  phone?: string;
  preferredAction?: string;
  source?: string;
};

const ROUTE_VERSION = "2026-08-11-leadrat-crm-v1";
const LEADRAT_DEFAULT_WEBHOOK_URL = "https://connect.leadrat.com/api/v1/integration/Website";
const PROJECT_NAME = "Poulomi Florique";
const PROJECT_CITY = "Bengaluru";
const PROJECT_STATE = "Karnataka";
const PROJECT_LOCATION = "Thanisandra";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: Record<string, unknown>, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Leads-Route-Version", ROUTE_VERSION);

  return Response.json(body, {
    ...init,
    headers,
  });
}

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function getWebhookConfig() {
  const sheetsUrl = getEnvValue("GOOGLE_SHEETS_WEBAPP_URL");
  const crmApiKey = getEnvValue("LEADRAT_API_KEY", "CRM_API_KEY");
  const configuredCrmUrl = getEnvValue("LEADRAT_WEBHOOK_URL", "CRM_WEBHOOK_URL");
  const crmUrl = configuredCrmUrl || (crmApiKey ? LEADRAT_DEFAULT_WEBHOOK_URL : "");

  return {
    destination: crmUrl ? "leadrat_crm" : sheetsUrl ? "google_sheets" : "none",
    crmApiKey,
    crmUrl,
    sheetsUrl,
    webhookUrl: crmUrl || sheetsUrl,
  };
}

function shouldWriteLocalBackup() {
  if (process.env.LEAD_LOCAL_BACKUP_ENABLED === "true") {
    return true;
  }

  return !process.env.VERCEL && process.env.NODE_ENV !== "production";
}

function normaliseIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const mobile = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;

  return mobile.length === 10 ? `+91${mobile}` : value.trim();
}

function getIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  const mobile = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;

  return mobile.slice(-10);
}

function getIndiaDateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
    year: "2-digit",
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    date: `${byType.day}-${byType.month}-${byType.year}`,
    time: `${byType.hour}:${byType.minute}:${byType.second}`,
  };
}

function normaliseBudgetToRupees(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const croreMatch = trimmed.match(/^(\d+(?:\.\d{1,2})?)\s*cr$/i);

  if (croreMatch) {
    return String(Math.round(Number(croreMatch[1]) * 10000000));
  }

  return trimmed.replace(/[^\d.]/g, "");
}

function getLeadRatStatus(action: string) {
  return action === "site_visit" ? "Schedule Site Visit" : "Schedule Meeting";
}

function getNoOfBhk(unitType: string) {
  const match = unitType.match(/(\d+)\s*BHK/i);

  return match?.[1] ?? "";
}

function getLeadRatPayload(payload: LeadPayload & { createdAt: string }) {
  const submitted = getIndiaDateTimeParts(new Date(payload.createdAt));
  const action = String(payload.lead_action ?? payload.preferredAction ?? payload.interest ?? "general_enquiry");
  const unitType = String(payload.lead_unit_type ?? payload.interestedIn ?? "");
  const budget = normaliseBudgetToRupees(String(payload.lead_budget ?? payload.budget ?? ""));
  const metadata = payload.metadata ?? {};

  return [
    {
      name: String(payload.name ?? payload.lead_name ?? "").trim(),
      state: PROJECT_STATE,
      city: PROJECT_CITY,
      location: PROJECT_LOCATION,
      budget,
      notes: String(payload.note ?? ""),
      email: String(payload.email ?? "").trim(),
      countryCode: "91",
      mobile: getIndianMobile(String(payload.phone ?? payload.lead_phone ?? "")),
      project: PROJECT_NAME,
      property: unitType || "3 BHK",
      leadExpectedBudget: budget,
      propertyType: "Flat",
      submittedDate: submitted.date,
      submittedTime: submitted.time,
      source: String(payload.utm_source ?? payload.source ?? "website"),
      subSource: String(payload.utm_medium ?? payload.cta_source ?? ""),
      agencyName: String(payload.agencyName ?? ""),
      leadScheduledDate: "",
      leadScheduleTime: "",
      leadStatus: getLeadRatStatus(action),
      leadBookedDate: "",
      leadBookedTime: "",
      additionalProperties: {
        EnquiredFor: "Buy",
        BHKType: unitType,
        NoOfBHK: getNoOfBhk(unitType),
        Action: action,
        FormName: String(payload.form_name ?? ""),
        CtaSource: String(payload.cta_source ?? payload.source ?? ""),
        UnitType: unitType,
        PlanId: String(payload.lead_plan_id ?? ""),
        AreaSqFt: String(payload.lead_area_sqft ?? ""),
        AreaType: String(payload.lead_area_type ?? ""),
        Blocks: String(payload.lead_blocks ?? ""),
        UnitNumbers: String(payload.lead_unit_types ?? ""),
        LandingPage: String(payload.landing_page ?? ""),
        Referrer: String(payload.referrer ?? ""),
        DeviceType: String(payload.device_type ?? ""),
        UtmCampaign: String(payload.utm_campaign ?? ""),
        UtmTerm: String(payload.utm_term ?? ""),
        UtmContent: String(payload.utm_content ?? ""),
        Gclid: String(payload.gclid ?? ""),
        Fbclid: String(payload.fbclid ?? ""),
        Msclkid: String(payload.msclkid ?? ""),
        Metadata: JSON.stringify(metadata),
      },
      primaryUser: "",
      secondaryUser: "",
      CampaignName: String(payload.utm_campaign ?? ""),
      AgencyName: "",
      ChannelPartnerName: "",
    },
  ];
}

function validateLeadPayload(payload: LeadPayload) {
  const name = String(payload.name ?? payload.lead_name ?? "").trim();
  const phone = normaliseIndianPhone(String(payload.phone ?? payload.lead_phone ?? ""));
  const email = String(payload.email ?? "").trim();
  const budget = String(payload.budget ?? payload.lead_budget ?? "").trim();

  if (!/^[A-Za-z][A-Za-z .'-]{1,79}$/.test(name)) {
    return { ok: false as const, error: "Enter a valid full name." };
  }

  if (!/^\+91[6-9]\d{9}$/.test(phone)) {
    return { ok: false as const, error: "Enter a valid Indian mobile number." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Enter a valid email address." };
  }

  if (budget && !/^\d+(\.\d{1,2})?\s*cr$/i.test(budget)) {
    return { ok: false as const, error: "Enter budget as a number with Cr suffix." };
  }

  return { ok: true as const, name, phone, email };
}

async function sendLeadWebhook(
  webhookUrl: string,
  destination: "google_sheets" | "leadrat_crm",
  crmApiKey: string,
  payload: LeadPayload & { createdAt: string },
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (destination === "leadrat_crm" && crmApiKey) {
    headers["API-Key"] = crmApiKey;
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(destination === "leadrat_crm" ? getLeadRatPayload(payload) : payload),
    redirect: "follow",
  });

  const responseText = await webhookResponse.text();

  if (!webhookResponse.ok) {
    throw new Error(
      `Lead webhook failed with ${webhookResponse.status}: ${responseText.slice(0, 500)}`,
    );
  }

  if (destination !== "google_sheets") {
    return;
  }

  try {
    const result = JSON.parse(responseText) as { ok?: boolean; error?: string };

    if (result.ok === false) {
      throw new Error(result.error ?? "Google Sheets Apps Script returned ok:false");
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Google Sheets Apps Script did not return JSON. Check Web App access/deployment. Response: ${responseText.slice(0, 500)}`,
      );
    }

    throw error;
  }
}

async function writeLocalBackup(payload: LeadPayload & { createdAt: string }) {
  if (!shouldWriteLocalBackup()) {
    return false;
  }

  const [{ mkdir, readFile, writeFile }, { join }] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const submissionsDir = join(process.cwd(), "content", "submissions");
  const submissionsFile = join(submissionsDir, "leads.json");

  await mkdir(submissionsDir, { recursive: true });

  let existing: LeadPayload[] = [];

  try {
    const raw = await readFile(submissionsFile, "utf8");
    existing = JSON.parse(raw) as LeadPayload[];
  } catch {
    existing = [];
  }

  existing.unshift(payload);

  await writeFile(submissionsFile, JSON.stringify(existing, null, 2), "utf8");

  return true;
}

export async function POST(request: Request) {
  try {
    return await handlePost(request);
  } catch (error) {
    console.error("Unhandled lead route failure", error);

    return json({ error: "Lead submission failed." }, { status: 500 });
  }
}

async function handlePost(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return json({ error: "Invalid lead payload." }, { status: 400 });
  }

  const validation = validateLeadPayload(payload);

  if (!validation.ok) {
    return json(
      { error: validation.error },
      { status: 400 },
    );
  }

  const savedPayload = {
    ...payload,
    name: validation.name,
    phone: validation.phone,
    email: validation.email || payload.email,
    source: payload.source ?? "website",
    interest:
      payload.interest ??
      payload.preferredAction ??
      payload.lead_action ??
      "general",
    createdAt: new Date().toISOString(),
  } as LeadPayload & { createdAt: string };

  const { crmApiKey, crmUrl, destination, sheetsUrl, webhookUrl } = getWebhookConfig();

  if (destination === "leadrat_crm" && !crmApiKey) {
    return json(
      { error: "CRM API key is not configured." },
      { status: 503 },
    );
  }

  if (webhookUrl) {
    try {
      await sendLeadWebhook(
        webhookUrl,
        destination === "google_sheets" ? "google_sheets" : "leadrat_crm",
        crmApiKey,
        savedPayload,
      );
    } catch (error) {
      console.error("Lead webhook failed", error);

      return json(
        { error: "Lead webhook failed." },
        { status: 502 },
      );
    }
  }

  let localBackupSaved = false;

  try {
    localBackupSaved = await writeLocalBackup(savedPayload);
  } catch (error) {
    console.warn("Lead local backup failed", error);
  }

  if (!webhookUrl && !localBackupSaved) {
    return json(
      { error: "No lead destination configured." },
      { status: 503 },
    );
  }

  return json({
    ok: true,
    routeVersion: ROUTE_VERSION,
    crmConfigured: Boolean(crmUrl),
    sheetsConfigured: Boolean(sheetsUrl),
    webhookConfigured: Boolean(webhookUrl),
    localBackupSaved,
  });
}

export function GET() {
  const { crmApiKey, crmUrl, sheetsUrl, webhookUrl } = getWebhookConfig();

  return json({
    ok: true,
    routeVersion: ROUTE_VERSION,
    crmConfigured: Boolean(crmUrl),
    crmApiKeyConfigured: Boolean(crmApiKey),
    sheetsConfigured: Boolean(sheetsUrl),
    webhookConfigured: Boolean(webhookUrl),
    localBackupEnabled: shouldWriteLocalBackup(),
  });
}
