export const projectFacts = {
  name: "Poulomi Florique",
  publicTitle: "Poulomi Florique Thanisandra",
  developer: "Poulomi Estates",
  locationShort: "Thanisandra, North Bengaluru",
  enquiryLabel: "Private Viewing",
  rera: {
    registration: "PRM/KA/RERA/1251/446/PR/180326/008539",
    url: "https://rera.karnataka.gov.in/",
  },
  images: {
    logoRose: "/florique/brand/poulomi-florique-logo-rose.png",
    logoWhite: "/florique/brand/poulomi-florique-logo-white.png",
    heroDesktop: "/florique/hero/poulomi-florique-hero-desktop.png",
    heroTablet: "/florique/hero/poulomi-florique-hero-desktop.png",
    heroMobile: "/florique/hero/poulomi-florique-hero-mobile.png",
    heroCardMobile: "/florique/hero/poulomi-florique-hero-card-mobile.png",
    elevation: "/florique/optimized/tower-elevation-official.webp",
    botanicalMacro: "/florique/optimized/botanical-macro-mobile.webp",
    masterPlan: "/florique/masterplan/poulomi-florique-masterplan-horizontal-16x9.png",
    masterPlanLayout: "/florique/masterplan/poulomi-florique-masterplan-horizontal-4x3.png",
  },
  videos: {
    storyDesktop: "/florique/videos/poulomi-florique-website-desktop-16x9-hd-compressed.mp4",
    storyMobile: "/florique/videos/poulomi-florique-website-mobile-4x3-hd-compressed.mp4",
  },
} as const;

export const micrositeDisclaimer =
  "This promotional microsite is operated for project enquiries. RERA, pricing, inventory, views, approvals, timelines, area statements and specifications must be verified with Poulomi Estates and the official Karnataka RERA portal before booking.";

export const consentText =
  "I agree to receive updates about Poulomi Florique and understand the";

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
  },
  {
    label: "27,500 sq ft Sports Zone",
    text: "Dedicated courts for futsal, pickleball, basketball, tennis and cricket practice.",
  },
  {
    label: "Resort-style Pool",
    text: "Pool deck, pool pavilion, kids' pool, bubbling pool and 25M lap pool.",
  },
  {
    label: "Wellness & Mindful Spaces",
    text: "Calmer spaces for yoga, reflection, co-working and everyday reset.",
  },
  {
    label: "Children & Family",
    text: "Adventure playground, children's play areas and creche spaces for younger residents.",
  },
  {
    label: "Signature Gardens",
    text: "Butterfly, fragrant, pebble, ginger, herb and reflexology gardens.",
  },
  {
    label: "Landscaped Amenities",
    text: "Arrival garden, gathering courtyard, event lawn and quieter sit-out decks.",
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

export const faqItems = [
  {
    question: "Where is Poulomi Florique located in Bengaluru?",
    answer:
      "Poulomi Florique is located in Kannuru, off Thanisandra Main Road in North Bengaluru. It is close to Bhartiya City and offers convenient access to Manyata Tech Park, Hebbal and the airport corridor.",
  },
  {
    question: "What apartment configurations are available at Poulomi Florique?",
    answer:
      "Poulomi Florique offers spacious 3 BHK homes ranging from approximately 1,585 to 2,740 sq. ft. Select layouts include a maid's room or an additional study for larger and multigenerational families.",
  },
  {
    question: "What makes Poulomi Florique unique?",
    answer:
      "The project combines no-common-wall residences, 100% Vastu-compliant planning, a vehicle-free podium, water-sensitive landscaping and more than 40 lifestyle amenities within an 8.66-acre community.",
  },
  {
    question: "What are the main amenities at Poulomi Florique?",
    answer:
      "Key amenities include a grand clubhouse, 25-metre lap pool, sports and wellness zone, co-working lounge, amphitheatre, children's activity areas, landscaped gardens and dedicated senior and pet spaces.",
  },
  {
    question: "Is Poulomi Florique suitable for families?",
    answer:
      "Yes. Spacious homes, a vehicle-free podium, creche, children's play areas, sports facilities, senior-friendly gardens and co-working spaces make Poulomi Florique suitable for families across generations.",
  },
  {
    question: "Is Poulomi Florique a sustainable development?",
    answer:
      "Poulomi Florique is IGBC Platinum pre-certified and incorporates rainwater capture, groundwater recharge, treated-water reuse, efficient common-area lighting, waste management and EV-charging provision.",
  },
  {
    question: "How well connected is Poulomi Florique?",
    answer:
      "The project is well positioned near Bhartiya City, educational institutions, healthcare facilities and North Bengaluru's major employment hubs. Manyata Tech Park, Hebbal and Kempegowda International Airport are accessible through the surrounding road network.",
  },
  {
    question: "Is Poulomi Florique RERA registered?",
    answer:
      "Yes. Poulomi Florique is registered with Karnataka RERA under registration number PRM/KA/RERA/1251/446/PR/180326/008539. Buyers should verify the latest approvals, possession schedule and project details on the Karnataka RERA portal before purchasing.",
  },
] as const;
