# Poulomi Florique asset manifest

## Use first: official/factual project assets

| File | Placement | Responsive use | Alt text |
|---|---|---|---|
| `official/hero-official-desktop.jpg` | Desktop hero | ≥1024 px | Poulomi Florique landscaped residential courtyard |
| `official/hero-official-tablet.jpg` | Tablet hero | 768–1023 px | Poulomi Florique landscaped residential courtyard |
| `official/hero-official-mobile.jpg` | Mobile hero | <768 px | Poulomi Florique landscaped residential courtyard |
| `official/tower-elevation-official.png` | Brand story / architecture | Use original; optimized copy available | Poulomi Florique residential towers |
| `official/pool-deck-official.jpg` | Amenities: pool | All sizes | Poulomi Florique pool deck and pavilion |
| `official/landscape-highlights-official.jpg` | Amenities / landscape | All sizes | Landscaped amenity spaces at Poulomi Florique |
| `official/masterplan-official.jpg` | Master plan explorer | Use official file and zoom control | Poulomi Florique master plan |
| `official/location-map-official-desktop.jpg` | Desktop location | ≥1024 px | Location map for Poulomi Florique |
| `official/location-map-official-tablet.jpg` | Tablet location | 768–1023 px | Location map for Poulomi Florique |
| `official/location-map-official-mobile.jpg` | Mobile location | <768 px | Location map for Poulomi Florique |
| `official/floor-plan-blossom-cascade-official.jpg` | Residence explorer | All sizes, zoomable | Poulomi Florique Blossom Cascade floor plan |

## Generated supporting assets

These are marketing visualizations, not approved architectural representations. Add an “artistic impression” disclosure where appropriate.

| File | Recommended placement | Desktop/mobile behavior | Alt text |
|---|---|---|---|
| `generated/arrival-entrance-desktop.png` | Brand story / arrival section | Use `optimized/arrival-entrance-desktop.webp` and mobile crop | Landscaped residential arrival and lobby entrance |
| `generated/clubhouse-exterior-portrait.png` | Amenity gallery | Portrait card on all devices | Clubhouse surrounded by flowering landscape |
| `generated/sports-zone-portrait.png` | Amenity gallery | Portrait card on all devices | Landscaped sports courts in a residential community |
| `generated/wellness-coworking-portrait.png` | Amenity gallery | Portrait card on all devices | Wellness and co-working lounge overlooking gardens |
| `generated/childrens-nature-play-portrait.png` | Amenity gallery | Portrait card on all devices | Nature-led children’s play garden |
| `generated/signature-garden-portrait.png` | Bloomscape / gardens | Portrait card on all devices | Flowering garden and walking path |
| `generated/residence-interior-desktop.png` | Residence story | Use optimized desktop and mobile crops | Premium living and dining room opening to landscaped views |
| `generated/botanical-macro-portrait.png` | Botanical inset | Decorative; use empty alt | Empty alt because decorative |

## Optimized web-ready copies

The `optimized/` directory contains WebP crops sized for direct implementation. Prefer these in production and retain the PNG originals only as masters.

## Decorative vectors

- `decorative/botanical-corner-top-right.svg`: hero/editorial-panel upper-right ornament.
- `decorative/botanical-corner-bottom-left.svg`: cards, forms and section lower-left ornament.
- `decorative/botanical-divider-horizontal.svg`: full-width section transition.
- `decorative/botanical-branch-vertical.svg`: side ornament for story, residence or master-plan sections.
- `decorative/florique-flower-outline.svg`: brand flower mark for CTAs, empty states and form confirmation.
- `decorative/botanical-cluster-large.svg`: large low-opacity background composition.
- Legacy `botanical-corner.svg` and `botanical-divider.svg` remain for compatibility.

All new SVGs use `currentColor`. Set their colour through CSS (`color`) and keep them decorative with `aria-hidden="true"` when embedded as inline markup.

## Still required from the official sales/design team

Do not replace these with generated images:

1. Official Poulomi Florique logo/wordmark in light and dark SVG variants.
2. Every approved floor-plan variant, including unit names, orientations and areas.
3. Latest approved master plan at print-readable resolution or PDF.
4. Official brochure PDF and current cost sheet.
5. RERA registration QR/link artwork if legally required.
6. Developer logo and approved legal/footer identity.
7. Any mandatory “artistic impression” and project-disclaimer language.

## Implementation notes

- Keep headings, prices, RERA numbers, CTAs and amenity labels as HTML—not embedded into images.
- Use `<picture>` for hero and location map breakpoints.
- Use `object-position` per crop instead of relying on one image everywhere.
- Preload only the mobile/desktop hero selected by the browser.
- Lazy-load all other imagery.
- Floor plans and master plan require zoom controls and downloadable official PDFs.
- Add a small CMS/source record for every volatile project claim.
