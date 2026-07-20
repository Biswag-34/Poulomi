export const projectFacts = {
  name: "Poulomi Florique",
  publicTitle: "Poulomi Florique Thanisandra",
  developer: "Poulomi Estates",
  locationShort: "Thanisandra, North Bengaluru",
  locationLong: "Sy No. 16, Kannur Village, Bidarahalli Hobli, Bengaluru 560077",
  totalUnits: "720 residences",
  towerStack: "4 towers with 2B + G + 27 floors",
  enquiryLabel: "Private Viewing",
  enquiryHref: "#private-viewing",
  contactPhone: "+91 91192 39119",
  contactPhoneHref: "tel:+919119239119",
  contactEmail: "floriquesales@poulomi.in",
  socials: {
    facebook: "https://www.facebook.com/poulomiestates/",
    instagram: "https://www.instagram.com/poulomiestates/",
  },
  possession: "Verify with Karnataka RERA",
  rera: {
    registration: "PRM/KA/RERA/1251/446/PR/180326/008539",
    url: "https://rera.karnataka.gov.in/",
  },
  mapUrl: "https://www.google.com/maps/search/Poulomi+Florique+Thanisandra+Bengaluru",
  images: {
    logoRose: "/florique/brand/poulomi-florique-logo-rose.png",
    logoWhite: "/florique/brand/poulomi-florique-logo-white.png",
    heroDesktop: "/florique/optimized/arrival-entrance-desktop.webp",
    heroTablet: "/florique/optimized/arrival-entrance-desktop.webp",
    heroMobile: "/florique/optimized/arrival-entrance-mobile.webp",
    elevation: "/florique/optimized/tower-elevation-official.webp",
    arrivalDesktop: "/florique/optimized/arrival-entrance-desktop.webp",
    botanicalMacro: "/florique/optimized/botanical-macro-mobile.webp",
    masterPlan: "/florique/official/masterplan-official.jpg",
    masterPlanLayout: "/florique/optimized/masterplan-layout-only.webp",
    locationDesktop: "/florique/official/location-map-official-desktop.jpg",
    locationTablet: "/florique/official/location-map-official-tablet.jpg",
    locationMobile: "/florique/official/location-map-official-mobile.jpg",
    floorPlanOverview: "/florique/official/floor-plan-blossom-cascade-official.jpg",
  },
} as const;

export const micrositeDisclaimer =
  "This promotional microsite is operated for project enquiries. RERA, pricing, inventory, views, approvals, timelines, area statements and specifications must be verified with Poulomi Estates and the official Karnataka RERA portal before booking.";

export const consentText =
  "I agree to receive updates about Poulomi Florique and understand the";

export const proofFacts = [
  { value: "8.66", label: "Acres", sourceLabel: "Official project material", verifiedAt: "2026-07-19", status: "needs-confirmation" },
  { value: "85%", label: "Open space", sourceLabel: "Official project material", verifiedAt: "2026-07-19", status: "needs-confirmation" },
  { value: "720", label: "Residences", sourceLabel: "Official project material", verifiedAt: "2026-07-19", status: "needs-confirmation" },
  { value: "37,800 sq ft", label: "Clubhouse", sourceLabel: "Official project material", verifiedAt: "2026-07-19", status: "needs-confirmation" },
  { value: "27,500 sq ft", label: "Sports zone", sourceLabel: "Official project material", verifiedAt: "2026-07-19", status: "needs-confirmation" },
] as const;

export type ResidenceFamilyLabel = "3 BHK" | "3 BHK + Maid" | "3 BHK + Study + Maid";

export type ResidencePlan = {
  id: string;
  family: ResidenceFamilyLabel;
  qualifier?: "2 toilets";
  areaSqFt: number;
  areaType: "SBUA";
  blocks: readonly ("A" | "B" | "C" | "D")[];
  unitTypes: readonly string[];
  src: string;
  width: number;
  height: number;
  status: "approved-source" | "derived-from-approved-sheet";
};

export const residencePlans: readonly ResidencePlan[] = [
  {
    id: "3bhk-1585",
    family: "3 BHK",
    qualifier: "2 toilets",
    areaSqFt: 1585,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["03", "05"],
    src: "/florique/plans/units/3bhk-2-toilets-1585-sqft.webp",
    width: 760,
    height: 640,
    status: "derived-from-approved-sheet",
  },
  {
    id: "3bhk-1780",
    family: "3 BHK",
    areaSqFt: 1780,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["04", "06"],
    src: "/florique/plans/units/3bhk-1780-sqft.webp",
    width: 682,
    height: 654,
    status: "approved-source",
  },
  {
    id: "3bhk-1830",
    family: "3 BHK",
    areaSqFt: 1830,
    areaType: "SBUA",
    blocks: ["A", "D"],
    unitTypes: ["03", "04"],
    src: "/florique/plans/units/3bhk-1830-sqft.jpg",
    width: 729,
    height: 713,
    status: "approved-source",
  },
  {
    id: "3bhk-1890",
    family: "3 BHK",
    areaSqFt: 1890,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["08"],
    src: "/florique/plans/units/3bhk-1890-sqft.webp",
    width: 691,
    height: 700,
    status: "approved-source",
  },
  {
    id: "3bhk-1905",
    family: "3 BHK",
    areaSqFt: 1905,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["01"],
    src: "/florique/plans/units/3bhk-1905-sqft.jpg",
    width: 708,
    height: 697,
    status: "approved-source",
  },
  {
    id: "3bhk-2000",
    family: "3 BHK",
    areaSqFt: 2000,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["02"],
    src: "/florique/plans/units/3bhk-2000-sqft.webp",
    width: 695,
    height: 725,
    status: "approved-source",
  },
  {
    id: "3bhk-2030",
    family: "3 BHK",
    areaSqFt: 2030,
    areaType: "SBUA",
    blocks: ["B", "C"],
    unitTypes: ["07"],
    src: "/florique/plans/units/3bhk-2030-sqft.jpg",
    width: 698,
    height: 726,
    status: "approved-source",
  },
  {
    id: "3bhk-maid-2210",
    family: "3 BHK + Maid",
    areaSqFt: 2210,
    areaType: "SBUA",
    blocks: ["A", "D"],
    unitTypes: ["05"],
    src: "/florique/plans/units/3bhk-maid-2210-sqft.jpg",
    width: 729,
    height: 882,
    status: "approved-source",
  },
  {
    id: "3bhk-maid-2380",
    family: "3 BHK + Maid",
    areaSqFt: 2380,
    areaType: "SBUA",
    blocks: ["A", "D"],
    unitTypes: ["06"],
    src: "/florique/plans/units/3bhk-maid-2380-sqft.jpg",
    width: 800,
    height: 739,
    status: "approved-source",
  },
  {
    id: "3bhk-maid-2535",
    family: "3 BHK + Maid",
    areaSqFt: 2535,
    areaType: "SBUA",
    blocks: ["A", "D"],
    unitTypes: ["01"],
    src: "/florique/plans/units/3bhk-maid-2535-sqft.jpg",
    width: 800,
    height: 748,
    status: "approved-source",
  },
  {
    id: "3bhk-study-maid-2740",
    family: "3 BHK + Study + Maid",
    areaSqFt: 2740,
    areaType: "SBUA",
    blocks: ["A", "D"],
    unitTypes: ["02"],
    src: "/florique/plans/units/3bhk-study-maid-2740-sqft.jpg",
    width: 815,
    height: 900,
    status: "approved-source",
  },
];

export const residenceFamilies = [
  {
    slug: "3-bhk",
    label: "3 BHK",
    summary: "Seven exact 3 BHK plan variants from 1,585 to 2,030 sq ft SBUA.",
  },
  {
    slug: "3-bhk-maid",
    label: "3 BHK + Maid",
    summary: "Three larger family homes with staff-room convenience.",
  },
  {
    slug: "3-bhk-study-maid",
    label: "3 BHK + Study + Maid",
    summary: "A signature 2,740 sq ft SBUA plan with study and maid room.",
  },
] as const;

export const amenityHighlights = [
  {
    label: "37,800 sq ft Clubhouse",
    text: "Multipurpose hall, party lounge, co-working spaces, indoor games, badminton and squash.",
    features: ["Multipurpose hall", "Indoor games", "Badminton & squash"],
    image: "/florique/optimized/clubhouse-exterior-mobile.webp",
  },
  {
    label: "27,500 sq ft Sports Zone",
    text: "Dedicated courts for futsal, pickleball, basketball, tennis and cricket practice.",
    features: ["Tennis", "Pickleball", "Cricket practice"],
    image: "/florique/optimized/sports-zone-mobile.webp",
  },
  {
    label: "Resort-style Pool",
    text: "Pool deck, pool pavilion, kids' pool, bubbling pool and 25M lap pool.",
    features: ["Lap pool", "Kids' pool", "Pool pavilion"],
    image: "/florique/official/pool-deck-official.jpg",
  },
  {
    label: "Wellness & Mindful Spaces",
    text: "Calmer spaces for yoga, reflection, co-working and everyday reset.",
    features: ["Yoga deck", "Reflection zones", "Co-working"],
    image: "/florique/optimized/wellness-coworking-mobile.webp",
  },
  {
    label: "Children & Family",
    text: "Adventure playground, children's play areas and creche spaces for younger residents.",
    features: ["Adventure play", "Creche", "Family lawns"],
    image: "/florique/optimized/childrens-nature-play-mobile.webp",
  },
  {
    label: "Signature Gardens",
    text: "Butterfly, fragrant, pebble, ginger, herb and reflexology gardens.",
    features: ["Butterfly garden", "Herb garden", "Reflexology trail"],
    image: "/florique/optimized/signature-garden-mobile.webp",
  },
  {
    label: "Landscaped Amenities",
    text: "Arrival garden, gathering courtyard, event lawn and quieter sit-out decks.",
    features: ["Arrival garden", "Event lawn", "Sit-out decks"],
    image: "/florique/official/landscape-highlights-official.jpg",
  },
] as const;

export const locationClusters = [
  {
    label: "Work",
    items: [
      { name: "Manyata Tech Park", time: "10 min" },
      { name: "Elements Mall", time: "12 min" },
      { name: "Hebbal", time: "15 min" },
      { name: "Bangalore Intl. Airport", time: "25 min" },
      { name: "MG Road", time: "30 min" },
    ],
  },
  {
    label: "Education",
    items: [
      { name: "Chaman Bhartiya School", time: "5 min" },
      { name: "Delhi Public School Bangalore North", time: "10 min" },
      { name: "REVA University", time: "10 min" },
      { name: "Orchids The International School", time: "10 min" },
    ],
  },
  {
    label: "Healthcare",
    items: [
      { name: "Kriyashila Hospitals, Kothanur", time: "15 min" },
      { name: "North Bangalore Hospital", time: "20 min" },
      { name: "Aster CMI Hospital", time: "30 min" },
    ],
  },
  {
    label: "Lifestyle",
    items: [
      { name: "Leela Hotel & Residences", time: "10 min" },
      { name: "Elements Mall", time: "15 min" },
      { name: "Bhartiya Mall of Bengaluru", time: "30 min" },
    ],
  },
] as const;

export const trustItems = [
  "RERA registered project",
  "Official project details",
  "Poulomi Estates enquiry",
  "Verify approvals before booking",
] as const;

export const faqItems = [
  {
    question: "Where is Poulomi Florique located?",
    answer:
      "Poulomi Florique is presented for Thanisandra, North Bengaluru. The registered project address and survey details should be checked against Karnataka RERA before booking.",
  },
  {
    question: "What residence configurations are available?",
    answer:
      "The current working presentation is for 3 BHK-led homes, including 3 BHK, 3 BHK + Maid and 3 BHK + Study + Maid families. Exact inventory should be reconfirmed with the sales team.",
  },
  {
    question: "What are the available apartment sizes?",
    answer:
      "Area ranges are shared through the official area sheet and approved floor-plan material. Request the latest sheet before comparing plans.",
  },
  {
    question: "Is Poulomi Florique RERA registered?",
    answer:
      "The displayed RERA registration number is PRM/KA/RERA/1251/446/PR/180326/008539. Verify the latest project details directly on Karnataka RERA.",
  },
  {
    question: "How can I receive the current price sheet?",
    answer:
      "Submit the enquiry form with your preferred configuration. Current pricing is shared on request so floor-wise charges and applicable costs remain up to date.",
  },
  {
    question: "How can I schedule a private site visit?",
    answer:
      "Submit the private-viewing form or call the enquiry number. The project team will coordinate brochure, floor-plan and site-visit details.",
  },
  {
    question: "What additional charges should a buyer verify?",
    answer:
      "Buyers should verify floor-rise, parking, maintenance, statutory charges, taxes, corpus, registration and any other applicable charges in the official cost sheet.",
  },
  {
    question: "Where can I obtain approved floor plans and the brochure?",
    answer:
      "Use the brochure or plan CTAs to request the latest official material. Do not rely on cropped images or third-party reposts for booking decisions.",
  },
] as const;
