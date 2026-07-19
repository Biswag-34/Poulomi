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
    heroDesktop: "/florique/optimized/arrival-entrance-desktop.webp",
    heroTablet: "/florique/optimized/arrival-entrance-desktop.webp",
    heroMobile: "/florique/optimized/arrival-entrance-mobile.webp",
    elevation: "/florique/optimized/tower-elevation-official.webp",
    arrivalDesktop: "/florique/optimized/arrival-entrance-desktop.webp",
    arrivalMobile: "/florique/optimized/arrival-entrance-mobile.webp",
    botanicalMacro: "/florique/optimized/botanical-macro-mobile.webp",
    masterPlan: "/florique/official/masterplan-official.jpg",
    locationDesktop: "/florique/official/location-map-official-desktop.jpg",
    locationTablet: "/florique/official/location-map-official-tablet.jpg",
    locationMobile: "/florique/official/location-map-official-mobile.jpg",
    floorPlan: "/florique/optimized/floor-plan-blossom-cascade-official.webp",
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

export const residenceFamilies = [
  {
    slug: "3-bhk",
    label: "3 BHK",
    areaRange: "Request official area sheet",
    summary: "Elegant 3 BHK-led homes planned for private family living.",
    variants: ["3 BHK + 2T", "3 BHK + 3T"],
    image: projectFacts.images.floorPlan,
  },
  {
    slug: "3-bhk-maid",
    label: "3 BHK + Maid",
    areaRange: "Request official area sheet",
    summary: "Larger residences with staff-room convenience and practical zoning.",
    variants: ["3 BHK + Maid", "Select east and west variants"],
    image: projectFacts.images.floorPlan,
  },
  {
    slug: "3-5-bhk-study-maid",
    label: "3.5 BHK + Study + Maid",
    areaRange: "Request official area sheet",
    summary: "Signature work-from-home family residences with added flexibility.",
    variants: ["3.5 BHK", "Study", "Maid room"],
    image: projectFacts.images.floorPlan,
  },
] as const;

export const units = [
  {
    slug: "3bhk-2t-east-1585",
    label: "3 BHK + 2T (East)",
    saleableArea: 1585,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Efficient premium family home",
    image: projectFacts.images.floorPlan,
    primary: true,
  },
  {
    slug: "3bhk-3t-west-1780",
    label: "3 BHK + 3T (West)",
    saleableArea: 1780,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Balanced three-bedroom layout",
    image: projectFacts.images.floorPlan,
    primary: false,
  },
  {
    slug: "3bhk-3t-east-1830",
    label: "3 BHK + 3T (East)",
    saleableArea: 1830,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Spacious family residence",
    image: projectFacts.images.floorPlan,
    primary: true,
  },
  {
    slug: "3bhk-3t-west-2000",
    label: "3 BHK + 3T (West)",
    saleableArea: 2000,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Roomier three-bedroom plan",
    image: projectFacts.images.floorPlan,
    primary: false,
  },
  {
    slug: "3bhk-maid-east-2210",
    label: "3 BHK + Maid (East)",
    saleableArea: 2210,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Family home with staff room",
    image: projectFacts.images.floorPlan,
    primary: true,
  },
  {
    slug: "3bhk-maid-west-2380",
    label: "3 BHK + Maid (West)",
    saleableArea: 2380,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Premium 3 BHK plus staff",
    image: projectFacts.images.floorPlan,
    primary: false,
  },
  {
    slug: "35bhk-study-maid-west-2740",
    label: "3.5 BHK + Study + Maid",
    saleableArea: 2740,
    carpetArea: null,
    price: "Request current price",
    buyerFit: "Signature work-from-home plan",
    image: projectFacts.images.floorPlan,
    primary: true,
  },
] as const;

export const uspHighlights = [
  {
    title: "Lush central greens",
    text: "A landscape-led master plan with themed gardens and quiet outdoor rooms.",
  },
  {
    title: "Private clusters",
    text: "Residential planning shaped for privacy, daily movement and calmer shared spaces.",
  },
  {
    title: "Walking trails",
    text: "A garden-first experience with trails, nature pockets and seamless amenity access.",
  },
  {
    title: "Curated landscapes",
    text: "Botanical spaces, pool decks, play zones and community lawns across the podium.",
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
      "The current working presentation is for 3 BHK-led homes, including 3 BHK, 3 BHK + Maid and 3.5 BHK + Study + Maid families. Exact inventory should be reconfirmed with the sales team.",
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
