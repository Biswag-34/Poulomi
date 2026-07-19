# Poulomi Florique Landing Page — Codex Design & Implementation Masterplan

Version: 1.0  
Prepared: 19 July 2026  
Project: Poulomi Florique lead-generation landing page  
Primary goal: Generate qualified brochure, pricing and private site-visit enquiries  
Selected visual direction: **Botanical Editorial Luxury**

---

## 1. Non-negotiable project brief

Build a high-conversion, mobile-first landing page for **Poulomi Florique**, a premium residential project in Thanisandra/Kannur, North Bengaluru. The result must feel like a private luxury-property presentation—not a crowded listing portal or generic real-estate template.

The page should combine:

- Project-accurate architectural imagery
- Editorial luxury typography
- A restrained botanical visual language
- Clear, verified project facts
- Frictionless brochure, pricing and site-visit enquiries
- Smooth but controlled motion
- Excellent mobile usability and performance

The conversion narrative is:

> **Emotion → immediate proof → residence fit → lifestyle → location confidence → developer/regulatory trust → enquiry**

The design must never sacrifice clarity, performance or accessibility for decoration.

### Four mandatory principles

1. **Mobile first:** Design and implement the 360–430 px experience first. Tablet and desktop are progressive enhancements.
2. **Premium and luxurious:** Luxury must come from restraint, art direction, typography, space, image quality and interaction polish—not excessive gold, glass effects or animation.
3. **Smooth UX:** Motion should explain hierarchy and state changes. All interactions must remain fast, predictable and touch-friendly.
4. **Accurate content:** No price, possession, distance, configuration, inventory, RERA or amenity claim may be invented or copied blindly from portals.

---

## 2. Source-of-truth and content governance

### Required source priority

Codex must apply facts in this order:

1. Karnataka RERA registration and approved documents
2. Official Poulomi Florique project website and Poulomi Estates project page
3. Latest official brochure, approved plans and current cost sheet supplied by the sales team
4. The existing LP only where it matches the sources above
5. Third-party portals for context only—never for legal, inventory or possession facts

Official references:

- `https://www.poulomi.in/project/poulomi-florique`
- `https://poulomiflorique.com/`
- `https://www.poulomi.in/`
- `https://rera.karnataka.gov.in/`

### Working fact table

| Field | Approved working value | Implementation rule |
|---|---|---|
| Project name | Poulomi Florique | Always spell exactly; never “Polumi” |
| Location display | Thanisandra · North Bengaluru | Registered address belongs in legal details |
| Project type | Premium residential apartments | Safe high-level wording |
| RERA number | `PRM/KA/RERA/1251/446/PR/180326/008539` | Display exactly and link to Karnataka RERA |
| Official narrative | “A World that Blossoms Around You.” | Use as the official brand-story heading |
| Design campaign heading | “Where architecture blooms.” | Use for hero H1 |
| Configuration family | 3 BHK-led residences | Exact variants must come from approved inventory |
| Working configurations | 3 BHK; 3 BHK + Maid; 3.5 BHK + Study + Maid | Reconfirm nomenclature before launch |
| Working size range | 1,585–2,740 sq ft | Confirm whether saleable or super built-up area |
| Published apartment count | 720 residences | Reconfirm against RERA/brochure before launch |
| Working land area | 8.66 acres | Verify before publishing |
| Working open-space claim | 85% | Verify definition and approved source |
| Working clubhouse | 37,800 sq ft | Verify latest brochure |
| Working sports zone | 27,500 sq ft | Some sources differ; verify latest brochure |
| Price | Dynamic / price on request | Never hard-code unless dated and actively maintained |
| Possession | RERA date only | Do not use portal dates |
| Drive times | Do not treat as guaranteed | Prefer measured distance; qualify time estimates |

### Accuracy architecture

Store all facts in one typed content source. Do not repeat literal facts across components.

```ts
export type VerifiedFact = {
  value: string;
  label: string;
  sourceLabel: string;
  sourceUrl?: string;
  verifiedAt: string;
  status: "verified" | "needs-confirmation";
};
```

Suggested file: `content/project.ts`.

Before production deployment, every record with `needs-confirmation` must either become `verified` or be hidden. Add `NEXT_PUBLIC_CONTENT_VERIFIED_AT` or a CMS field to track the last review.

### Forbidden content

Do not publish:

- Guaranteed appreciation or return claims
- Fake inventory scarcity or countdown timers
- Unverified awards, reviews or delivery records
- Portal-derived possession dates
- Prices without a date/source and maintenance owner
- “Only X units left” unless connected to verified live inventory
- Unrealistic commute promises
- Generated floor plans, master plans or maps

---

## 3. Asset system and exact file mapping

Asset root in the supplied package: `poulomi-florique-assets/`.

### Official/factual imagery

| Website use | Asset |
|---|---|
| Desktop hero | `official/hero-official-desktop.jpg` |
| Tablet hero | `official/hero-official-tablet.jpg` |
| Mobile hero | `official/hero-official-mobile.jpg` |
| Architecture/tower story | `optimized/tower-elevation-official.webp` |
| Pool amenity | `official/pool-deck-official.jpg` |
| Landscape amenity | `official/landscape-highlights-official.jpg` |
| Master plan explorer | `optimized/masterplan-official.webp` and original JPG |
| Desktop location map | `official/location-map-official-desktop.jpg` |
| Tablet location map | `official/location-map-official-tablet.jpg` |
| Mobile location map | `official/location-map-official-mobile.jpg` |
| Available official floor plan | `optimized/floor-plan-blossom-cascade-official.webp` |

### Supporting marketing imagery

These are artistic visualizations and should not be described as exact project representations.

| Website use | Desktop | Mobile/card |
|---|---|---|
| Arrival story | `optimized/arrival-entrance-desktop.webp` | `optimized/arrival-entrance-mobile.webp` |
| Residence interior | `optimized/residence-interior-desktop.webp` | `optimized/residence-interior-mobile.webp` |
| Clubhouse | Full-resolution master if required | `optimized/clubhouse-exterior-mobile.webp` |
| Sports zone | Full-resolution master if required | `optimized/sports-zone-mobile.webp` |
| Wellness/co-working | Full-resolution master if required | `optimized/wellness-coworking-mobile.webp` |
| Children’s play | Full-resolution master if required | `optimized/childrens-nature-play-mobile.webp` |
| Signature garden | Full-resolution master if required | `optimized/signature-garden-mobile.webp` |
| Botanical inset | Generated master | `optimized/botanical-macro-mobile.webp` |

Use the original files from `generated/` only when a larger crop is necessary. Production should normally serve `optimized/` WebP assets.

### Floral SVG system

| Pattern | Intended placement |
|---|---|
| `decorative/botanical-corner-top-right.svg` | Hero content sheet and ivory feature cards |
| `decorative/botanical-corner-bottom-left.svg` | Form, FAQ and selected-residence cards |
| `decorative/botanical-divider-horizontal.svg` | Major section transitions |
| `decorative/botanical-branch-vertical.svg` | Story, residences and master-plan side ornament |
| `decorative/florique-flower-outline.svg` | CTA icon, confirmation and small brand moments |
| `decorative/botanical-cluster-large.svg` | Very low-opacity editorial backgrounds |

All new SVGs use `currentColor`. Import them as React components or inline SVGs when CSS colour/animation is required. Treat them as decorative with `aria-hidden="true"`.

### Official assets still required

Do not fabricate these:

- Poulomi/Florique official logo in light and dark SVG
- Every approved floor-plan variant
- Approved master-plan PDF
- Official brochure PDF and current cost sheet
- Developer legal identity/logo
- Any required RERA QR or artwork
- Approved artistic-impression and legal disclaimers

If they are unavailable during development, create clearly labelled placeholders with `TODO: replace with official asset`; do not ship placeholders.

---

## 4. Visual design system

### Core concept

**Botanical Editorial Luxury:** warm ivory editorial surfaces placed against immersive architecture and landscape photography, with deep forest navigation and muted rose conversion accents.

### Colour tokens

```css
:root {
  --florique-ivory: #F5F0E7;
  --florique-ivory-soft: #FBF8F2;
  --florique-forest: #173C31;
  --florique-forest-deep: #0C2921;
  --florique-rose: #B56F78;
  --florique-rose-dark: #985A64;
  --florique-stone: #C9BBA8;
  --florique-ink: #20241F;
  --florique-white: #FFFDFC;
  --florique-success: #476F5E;
  --florique-error: #A44242;
}
```

Do not introduce bright gold, pure black, neon green, multiple accent colours or high-saturation gradients.

### Typography

- Display: Canela if legally licensed; fallback `Cormorant Garamond`.
- Body/UI: `Manrope`.
- Display font weight: 400.
- Body weight: 400; UI/CTA: 500–600.

```css
--text-hero-mobile: clamp(2.875rem, 13vw, 3.875rem);
--text-hero-desktop: clamp(4rem, 6.5vw, 6.5rem);
--text-section: clamp(2.5rem, 5vw, 4.75rem);
--text-body: clamp(1rem, 1.2vw, 1.125rem);
```

- Hero line-height: `0.92–0.98`.
- Section-heading line-height: `0.98–1.05`.
- Body line-height: `1.55–1.7`.
- Eyebrow: 11–13 px, uppercase, `0.16–0.2em` tracking.

### Spacing

Mobile side padding:

- 320–374 px: 18–20 px
- 375–430 px: 22–24 px
- Tablet: 32–48 px
- Desktop: `clamp(48px, 6vw, 96px)`

Section vertical space:

- Mobile: 72–96 px
- Tablet: 96–128 px
- Desktop: 128–176 px

Use generous empty space. Avoid placing multiple cards merely to fill an area.

### Surfaces and borders

- Ivory panels: 16–20 px radius on mobile; 16–18 px desktop.
- CTA radius: 2–6 px for a more editorial character.
- Borders: 1 px warm stone with 35–65% opacity.
- Shadows: large, soft and low-opacity only.
- Avoid repeated glassmorphism. A subtle sticky-nav blur is sufficient.

### Floral pattern rules

- Hero sheet: top-right branch at 12–18% opacity.
- Brand story: vertical branch at 18–25% opacity.
- Residence card: bottom-left corner at 10–14% opacity.
- Master plan: large cluster at 5–8% opacity.
- Form: small flower or corner branch at 8–12% opacity.
- Divider: use between only 2–3 major sections, never every section.

The patterns should feel discovered, not repeated. Excessive floral decoration will make the project feel ornamental rather than architectural.

---

## 5. Mobile-first global layout

Codex must implement and verify mobile layout before introducing desktop grids.

### Breakpoints

```text
Base:       320–767 px
Tablet:     768–1023 px
Desktop:    1024–1439 px
Wide:       1440 px+
```

Do not create device-specific logic in JavaScript when responsive CSS can handle it.

### Mobile navigation

- Height: 64 px.
- Deep forest background.
- Official wordmark left.
- Circular 44 px menu button right.
- Menu opens as a full-height ivory drawer or forest overlay.
- Menu items: Residences, Bloomscapes, Amenities, Plans, Location, About Poulomi.
- Secondary actions: Download Brochure, RERA details.
- Trap focus, lock body scroll and close with Escape/back action.

### Desktop navigation

- Announcement/RERA strip: 30–34 px.
- Main navigation: 82–92 px.
- Wordmark left, navigation centre, outlined **Book a Private Viewing** right.
- After scroll, reduce height and apply a subtle translucent forest/ivory backdrop.
- Do not cause a layout jump when nav compacts.

### Persistent mobile conversion bar

- Fixed to viewport bottom.
- Respect `env(safe-area-inset-bottom)`.
- Two equal actions: **Enquire** and **Call**.
- Minimum action height: 52 px.
- Hide when the full lead form is focused if it obstructs fields.
- Ensure it does not cover footer or accordion content; add corresponding page-bottom padding.

---

## 6. Page architecture and detailed component specification

### Section 01 — Header and hero

#### Mobile composition

1. 64 px forest navigation.
2. Hero image occupies approximately 48–54svh.
3. Use `official/hero-official-mobile.jpg`.
4. Keep the project/landscape focal point centred; never put text directly over complex foliage.
5. Ivory content sheet overlaps image by 22 px with 18 px top corners.
6. Add `botanical-corner-top-right.svg` at low opacity within the sheet.
7. Content order:
   - `THANISANDRA · NORTH BENGALURU`
   - H1: `Where architecture blooms.`
   - Support: `Botanical living, thoughtfully designed. Homes that feel private. Spaces that inspire.`
   - Full-width rose CTA: **Explore Residences**
   - Full-width outlined/text CTA: **Download Brochure**
   - Three compact proof items
8. Do not put a multi-field form in the hero.

Proof items:

- `3 BHK-led homes`
- `1,585–2,740 sq ft`
- `Curated landscapes`

Only show the first two if the size/configuration data is verified at launch.

#### Tablet

- Use `official/hero-official-tablet.jpg`.
- Image remains full-height or 72–84svh.
- Ivory panel occupies approximately 58–64% width and aligns lower-left.

#### Desktop

- Use `official/hero-official-desktop.jpg`.
- Minimum 100svh including nav.
- Architecture/landscape full bleed.
- Ivory panel width: `min(43vw, 650px)`.
- Panel left margin: `clamp(32px, 4vw, 64px)`.
- Right-edge vertical enquiry tab opens the lead drawer.
- Bottom slide/progress treatment is allowed only when at least two approved hero images exist.

#### Hero interactions

- Explore Residences scrolls to the residence explorer.
- Download Brochure opens a short lead sheet if brochure gating is required.
- Enquire opens a right drawer on desktop and bottom sheet on mobile.

### Section 02 — Verified proof ribbon

Purpose: establish scale immediately without clutter.

Working facts, each controlled by verification status:

- 8.66 acres
- 85% open space
- 720 residences
- 37,800 sq ft clubhouse
- 27,500 sq ft sports zone

Mobile:

- Horizontal snap row with 1.6–2.2 cards visible.
- Swipe is primary; arrows optional.
- No auto-scroll.

Desktop:

- One elegant five-column strip with fine separators.

### Section 03 — Florique brand story

Heading: **A World that Blossoms Around You.**

Purpose: explain the botanical proposition through architecture, light, privacy and landscape.

Assets:

- `arrival-entrance-desktop.webp` / `arrival-entrance-mobile.webp`
- `botanical-macro-mobile.webp`
- `botanical-branch-vertical.svg`

Mobile layout:

- Eyebrow and heading.
- 70–100 word editorial description.
- One portrait/4:5 arrival image.
- Botanical macro image overlaps the main image edge by 12–16 px.
- Keep overlap decorative and pointer-events disabled.

Desktop layout:

- 5/7 or 4/8 asymmetric text-image grid.
- Botanical inset floats near the image’s lower-left edge.

Suggested copy:

> Designed for the way life unfolds, Florique brings spacious homes, flowering landscapes and everyday amenities together in North Bengaluru. Architecture rises gently from gardens and open spaces, creating a home that feels composed, private and connected.

### Section 04 — Residence explorer

Heading: **Residences, crafted to complement your life.**

Do not show twelve equal buttons on initial view. First group inventory into:

1. 3 BHK
2. 3 BHK + Maid
3. 3.5 BHK + Study + Maid

Exact unit variants live inside the selected family.

Mobile:

- Scrollable or equal-width tabs with minimum 44 px height.
- Selected family displays one card:
  - Configuration name
  - Verified area or range
  - Orientation/variant dropdown when available
  - Floor-plan preview
  - **View Plan Details**
  - **Request Current Price**
- Floor plan opens in a zoomable full-screen viewer.
- Use official plans only.

Desktop:

- Left: configuration family navigation.
- Right: large selected-plan card and relevant details.
- Optionally use `residence-interior-desktop.webp` as a secondary contextual image, clearly labelled as artistic impression where needed.

State should be URL-optional, e.g. `?residence=3bhk-maid`, without forcing a reload.

### Section 05 — Amenity bloomscape

Heading: **Spaces that nourish every part of you.**

Primary experience: horizontally swipeable editorial image gallery.

Cards:

1. Clubhouse — `clubhouse-exterior-mobile.webp`
2. Sports zone — `sports-zone-mobile.webp`
3. Pool and leisure — `pool-deck-official.jpg`
4. Wellness/co-working — `wellness-coworking-mobile.webp`
5. Children and family — `childrens-nature-play-mobile.webp`
6. Signature gardens — `signature-garden-mobile.webp`
7. Landscaped amenities — `landscape-highlights-official.jpg`

Each card contains:

- Image
- Short title
- One benefit-led sentence
- Maximum three supporting features

Mobile:

- 78–86vw card width.
- CSS scroll snap.
- Visible position dots or `01 / 07` indicator.
- Drag/swipe; no tiny arrow dependency.

Desktop:

- 3.2–4 cards visible.
- Arrow controls and drag support.
- Cards may expand subtly on hover but must not shift surrounding layout.

### Section 06 — Master plan explorer

Heading: **Designed with green at the heart.**

Asset: `masterplan-official.webp`.

Rules:

- Master-plan image must remain unaltered except responsive scaling.
- Do not embed generated hotspot labels into the image.
- Overlay interactive accessible hotspot buttons using verified coordinates.
- Categories: Arrival, Clubhouse, Greens, Pool, Sports, Children, Walking.

Mobile:

- Image shown edge-to-edge within a rounded panel.
- User can open full-screen zoom viewer.
- Selected hotspot’s description appears below the image.

Desktop:

- Large plan left; legend/detail rail right.
- Hover can preview, but click/focus controls selected state.

### Section 07 — Location confidence

Heading: **Well connected. Well placed.**

Use responsive official map through `<picture>`.

Categories:

- Work
- Education
- Healthcare
- Lifestyle
- Transit

Mobile:

- Map first.
- Horizontal category tabs.
- Selected category shows 3–5 destinations in a clean list.
- Use distances where possible.

Desktop:

- Map occupies 60–66% width.
- Category/detail panel occupies the remainder.

Do not edit geographic positions using generated artwork. Location information must come from verified map data or official project material.

### Section 08 — Developer and RERA trust

Purpose: answer “Why should I trust this project?” without unsupported claims.

Content:

- Poulomi Estates introduction
- Official RERA number and link
- Project/legal identity
- Verified approvals/status only
- Link to official project page

Do not display generated “on-time delivery”, “quality construction” or review badges unless evidence has been supplied.

Mobile: stacked trust details with RERA link as a 48 px action.  
Desktop: restrained horizontal strip or two-column editorial block.

### Section 09 — FAQ

Suggested visible questions:

1. Where is Poulomi Florique located?
2. What residence configurations are available?
3. What are the available apartment sizes?
4. Is Poulomi Florique RERA registered?
5. How can I receive the current price sheet?
6. How can I schedule a private site visit?
7. What additional charges should a buyer verify?
8. Where can I obtain approved floor plans and the brochure?

Use one-column accordion on mobile and optional two-column grouping on desktop. Only one item needs to remain open at a time. Preserve standard button semantics and `aria-expanded`.

### Section 10 — Final private-viewing conversion

Heading: **Homes that bloom with possibility.**

Mobile:

- Forest editorial statement card.
- Form directly below.
- Single column.

Desktop:

- 35/65 or 40/60 brand statement and form split.

Recommended fields:

- Full name
- Indian mobile number
- Email, optional
- Configuration interest
- Preferred visit date/time, optional
- Message, optional
- Consent checkbox with privacy-policy link

Submit: **Schedule My Private Visit**.

Success state:

- Replace the form with a calm inline confirmation.
- Show expected contact timeline only if operationally true.
- Offer call/WhatsApp action.
- Do not redirect to an empty thank-you page.

### Section 11 — Footer

- Deep forest background.
- Project name/location.
- Residences, Amenities, Location, About and Contact links.
- Phone and official email.
- RERA link.
- Privacy, terms and disclaimer.
- Approved company/legal identity.
- Add bottom padding for the mobile fixed conversion bar.

---

## 7. Motion and interaction specification

### Motion philosophy

Motion should feel calm, expensive and nearly invisible. Avoid effects that make the page feel like a technology demo.

### Timing tokens

```ts
export const motion = {
  fast: 180,
  base: 300,
  slow: 600,
  hero: 900,
  easeLuxury: [0.22, 1, 0.36, 1],
};
```

### Hero entrance

Total duration: no more than 900 ms.

- Hero image: `scale(1.035) → scale(1)`.
- Ivory sheet: opacity 0→1 and translateY 18→0.
- Eyebrow, H1, support and CTAs stagger by 60–70 ms.
- Content and CTA must still render immediately server-side.

### Scroll reveals

- Use opacity 0→1 and translateY 12–18 px.
- Trigger once per section.
- Do not animate every paragraph independently.
- Never animate layout dimensions where opacity/transform works.

### CTAs

- Hover: rose to rose-dark, icon translateX 3 px, 180 ms.
- Press: scale to 0.985 for 80–120 ms.
- Focus: 2 px visible ring with offset.

### Carousels

- Touch drag and CSS scroll snap are preferred on mobile.
- If auto-advance is used for hero imagery, use 7 seconds minimum and pause on hover, focus or interaction.
- Amenity gallery must not auto-advance.

### Drawers and sheets

- Mobile bottom sheet: 300–420 ms, enters from bottom, rounded top corners.
- Desktop lead drawer: 400–440 px, enters from right.
- Background overlay 25–40%, not fully black.
- Focus trap, Escape close, visible close button.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Disable transforms and automatic carousels.
- Use instant state changes or simple 120 ms opacity.
- Preserve all content and functionality.

### Explicitly prohibited

- Scroll-jacking
- Long loading intro/logo animation
- Aggressive parallax
- Cursor followers
- Mobile hover-dependent functionality
- Repeated looping floral animations
- Motion that delays lead submission

---

## 8. Lead-generation functionality

### Primary conversions

1. Schedule private site visit
2. Request current price sheet
3. Download brochure
4. Call sales team
5. WhatsApp enquiry, if approved

### Lead drawer/sheet variants

Use the same validated form component with different intent metadata:

```ts
type LeadIntent =
  | "site_visit"
  | "price_sheet"
  | "brochure"
  | "floor_plan"
  | "general_enquiry";
```

The opening CTA supplies `intent`, `ctaLocation` and selected configuration. Do not ask users to repeat information already selected on the page.

### Validation

- Name: 2–80 meaningful characters.
- Indian mobile: validated and normalized to E.164.
- Email: optional but validated when present.
- Consent: required when used for marketing follow-up.
- Validate on blur and submit, not every keypress.
- Preserve entered data after a server error.
- Announce errors accessibly.

### Backend requirements

- Server-side schema validation.
- Rate limiting.
- Spam/honeypot protection.
- Idempotency or duplicate protection.
- UTM and referrer capture.
- CRM/Google Sheet integration with reliable error handling.
- Server logs without exposing personal data.
- Never return implementation secrets to the browser.

### Analytics event plan

```text
hero_explore_residences
lead_sheet_open
brochure_request_submit
price_request_submit
site_visit_submit
call_click
whatsapp_click
residence_family_select
residence_variant_select
floor_plan_open
masterplan_hotspot_select
location_category_select
faq_open
rera_link_click
form_validation_error
lead_submit_error
lead_submit_success
```

Event properties may include CTA location, lead intent, selected configuration and UTM data. Do not send names, telephone numbers, email addresses or messages to GA4/GTM.

---

## 9. Technical architecture

Recommended baseline:

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- `next/image`
- React Hook Form + Zod
- Framer Motion only for choreography that CSS cannot handle cleanly
- GA4/GTM through a consent-aware implementation

Suggested structure:

```text
app/
  layout.tsx
  page.tsx
  api/
    leads/route.ts
components/florique/
  Header.tsx
  MobileMenu.tsx
  Hero.tsx
  ProofRibbon.tsx
  BrandStory.tsx
  ResidenceExplorer.tsx
  FloorPlanViewer.tsx
  AmenityGallery.tsx
  MasterPlanExplorer.tsx
  LocationExplorer.tsx
  TrustSection.tsx
  FAQ.tsx
  LeadDrawer.tsx
  LeadBottomSheet.tsx
  SiteVisitForm.tsx
  MobileActionBar.tsx
  Footer.tsx
content/
  project.ts
  residences.ts
  amenities.ts
  location.ts
  faq.ts
lib/
  analytics.ts
  lead-schema.ts
  submit-lead.ts
  rate-limit.ts
public/florique/
  official/
  optimized/
  decorative/
```

### Component rules

- Server Components by default.
- Client Components only for tabs, galleries, viewers, drawers, forms and analytics interaction.
- Keep project data out of JSX.
- One lead form implementation reused across surfaces.
- One modal/drawer state manager; avoid multiple independent overlays.
- Use URL-safe state for residence selection only when useful.

### Responsive image implementation

Hero example:

```tsx
<picture>
  <source media="(min-width: 1024px)" srcSet="/florique/official/hero-official-desktop.jpg" />
  <source media="(min-width: 768px)" srcSet="/florique/official/hero-official-tablet.jpg" />
  <img
    src="/florique/official/hero-official-mobile.jpg"
    alt="Poulomi Florique landscaped residential courtyard"
    fetchPriority="high"
  />
</picture>
```

Do not preload all three hero files. Let responsive media selection determine the requested asset.

---

## 10. Performance requirements

Targets under representative production conditions:

| Metric | Target |
|---|---:|
| Mobile Lighthouse performance | 90+ |
| LCP | <2.5 s |
| CLS | <0.1 |
| INP | <200 ms |
| Initial JS | Keep minimal; justify large libraries |
| Hero payload | Approximately ≤300 KB where visually acceptable |

Rules:

- Preload only the selected first hero.
- Lazy-load below-fold imagery.
- Reserve explicit image aspect ratios.
- Use WebP/AVIF and `sizes`.
- Avoid rendering desktop and mobile images simultaneously with CSS hiding.
- Self-host fonts when licensing permits.
- Subset font files.
- Use SVG for floral linework, not large PNGs.
- Avoid video background unless an approved, optimized asset and poster exist.

---

## 11. Accessibility requirements

Target WCAG 2.2 AA.

- Semantic header, nav, main, sections and footer.
- One H1.
- Logical heading levels.
- Visible keyboard focus.
- Minimum 44×44 px touch targets.
- Text contrast of at least 4.5:1 where applicable.
- All tabs use proper tab semantics or clearly accessible buttons.
- Carousel controls have labels and keyboard support.
- Modal/drawer focus trapping and focus restoration.
- Floor-plan/master-plan viewers have close, zoom-in, zoom-out and reset controls.
- Decorative SVGs use empty alternative treatment.
- Form labels remain visible; placeholders are not labels.
- Error messages are programmatically connected to fields.
- Do not rely on colour alone for selection or error states.

---

## 12. SEO, metadata and compliance

Suggested metadata:

- Title: `Poulomi Florique Thanisandra | 3 BHK Residences & Site Visit`
- Description: `Explore Poulomi Florique in Thanisandra, North Bengaluru—premium 3 BHK-led residences, landscaped amenities, floor plans, brochure access and private site visits.`

Requirements:

- Canonical URL.
- Open Graph image derived from approved project imagery.
- Descriptive image alt text.
- FAQ structured data must match visible FAQ exactly.
- Use residential/listing schema only with verified eligible fields.
- RERA number and direct link.
- Privacy policy, terms and disclaimer.
- Consent language adjacent to forms.
- Clearly identify artistic impressions where legally required.
- No doorway pages or hidden keyword blocks.

---

## 13. Implementation sequence for Codex

### Phase 0 — Audit and freeze content

1. Inspect the existing repository and preserve working integrations.
2. Identify framework/version, styling system, analytics, lead endpoint and deployment constraints.
3. Import the supplied asset directory.
4. Build the typed source-of-truth content files.
5. Mark every unverified field.
6. Confirm official logo, remaining floor plans, brochure and legal copy status.

### Phase 1 — Mobile foundation

1. Add fonts and design tokens.
2. Build mobile header/menu.
3. Build the mobile hero with overlapping ivory sheet.
4. Add the mobile fixed Enquire/Call bar.
5. Build mobile lead bottom sheet.
6. Verify at 320, 360, 375, 390, 414 and 430 px.

Do not proceed to desktop enhancement until the complete mobile page is usable.

### Phase 2 — Mobile content journey

1. Proof ribbon.
2. Brand story.
3. Residence explorer and floor-plan viewer.
4. Amenity gallery.
5. Master-plan viewer/hotspots.
6. Location explorer.
7. Trust/RERA.
8. FAQ.
9. Final lead form and footer.

### Phase 3 — Tablet and desktop enhancement

1. Desktop navigation and announcement bar.
2. Desktop hero overlay panel and enquiry drawer.
3. Expand story into editorial grid.
4. Expand residence explorer into split layout.
5. Expand amenity carousel viewport.
6. Add desktop master-plan legend rail.
7. Add location side panel.
8. Enhance final form to two-column layout.

### Phase 4 — Motion and polish

1. Add hero entrance choreography.
2. Add restrained section reveals.
3. Add gallery drag/progress.
4. Add tab/plan transitions.
5. Add drawer/sheet motion.
6. Implement reduced-motion behavior.

Motion comes after layout and functionality—not before.

### Phase 5 — Lead and analytics integration

1. Connect form validation and API.
2. Add rate limiting/spam controls.
3. Connect CRM/Sheet destination.
4. Capture attribution.
5. Add analytics events.
6. Test success, duplicate, validation and server-failure paths.

### Phase 6 — Verification and launch QA

1. Reverify every fact against current official sources.
2. Test every breakpoint.
3. Test keyboard, reduced motion and screen-reader basics.
4. Test slow 4G and image-loading behavior.
5. Test real Android and iOS safe areas where possible.
6. Run Lighthouse and fix regressions.
7. Test lead delivery end-to-end in production environment.
8. Confirm legal/footer content.

---

## 14. Required QA matrix

### Responsive widths

```text
320 × 568
360 × 800
375 × 812
390 × 844
414 × 896
430 × 932
768 × 1024
1024 × 768
1280 × 800
1440 × 900
1920 × 1080
```

### Functional tests

- Mobile menu open/close/focus restoration.
- Every CTA opens the correct intent form.
- Browser back does not break open sheets or selected residence state.
- Phone and WhatsApp links work.
- Residence selection updates content accurately.
- Floor-plan zoom works on touch and keyboard.
- Master-plan hotspots work without hover.
- Location tabs are accessible.
- FAQ buttons expose correct expanded state.
- Form preserves data after error.
- Duplicate clicks do not create duplicate leads.
- Analytics exclude personal information.

### Visual tests

- No horizontal overflow at any width.
- Sticky conversion bar never covers content or inputs.
- No text sits directly on visually busy foliage.
- Floral patterns never reduce readability.
- Cards and images maintain intended ratios.
- Typography does not create widows/awkward one-word lines where avoidable.
- Desktop does not feel like a stretched mobile page.
- Mobile does not feel like a compressed desktop page.

---

## 15. Definition of done

The page is complete only when:

- Mobile 360–430 px is the strongest and most thoroughly tested experience.
- The hero identifies project, location, product and action without scrolling.
- The page matches the Botanical Editorial Luxury design system.
- Official/factual assets are used for architecture, plans, maps and legal information.
- Generated imagery is used only for supporting lifestyle art direction.
- Every displayed project fact is verified or intentionally withheld.
- Motion is smooth, purposeful and reduced-motion compliant.
- Lead flows work from every CTA and preserve attribution.
- The page meets performance and accessibility targets.
- No internal design commentary or placeholder text appears publicly.
- Legal, privacy, RERA and disclaimer requirements are present.

---

## 16. Direct instruction block for Codex

Use the following as the controlling instruction when implementation begins:

> Build the Poulomi Florique lead-generation landing page according to this masterplan and the supplied Botanical Editorial Luxury assets. Start with the complete 360–430 px experience and verify it before adding tablet and desktop enhancements. Use official images for the hero, tower, plans, master plan and maps; use generated images only as supporting artistic lifestyle imagery. Keep all essential text, CTAs and facts in semantic HTML. Implement calm, high-quality motion with reduced-motion support. Store project facts in one typed content source and do not publish any field marked `needs-confirmation`. Preserve or improve the existing lead integration, add reliable validation and attribution, and test all responsive, accessibility, performance and failure states. Do not substitute generic real-estate templates, excessive cards, gold gradients, scroll-jacking or unverified claims.

