---
name: KalaKasturi Gallery System
colors:
  surface: '#101417'
  surface-dim: '#101417'
  surface-bright: '#353a3e'
  surface-container-lowest: '#0a0f12'
  surface-container-low: '#181c20'
  surface-container: '#1c2024'
  surface-container-high: '#262a2e'
  surface-container-highest: '#313539'
  on-surface: '#dfe3e8'
  on-surface-variant: '#c0c7d2'
  inverse-surface: '#dfe3e8'
  inverse-on-surface: '#2d3135'
  outline: '#8a919c'
  outline-variant: '#404751'
  surface-tint: '#9ccaff'
  primary: '#9ccaff'
  on-primary: '#003256'
  primary-container: '#52a2ed'
  on-primary-container: '#00375d'
  inverse-primary: '#0062a1'
  secondary: '#9fcafb'
  on-secondary: '#003256'
  secondary-container: '#184973'
  on-secondary-container: '#8eb9e9'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#9c9d9d'
  on-tertiary-container: '#333535'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d0e4ff'
  primary-fixed-dim: '#9ccaff'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#00497a'
  secondary-fixed: '#d0e4ff'
  secondary-fixed-dim: '#9fcafb'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#184973'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#101417'
  on-background: '#dfe3e8'
  surface-variant: '#313539'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 128px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is a high-end digital curation environment designed to present art as the singular protagonist. It targets serious collectors and art enthusiasts who value quiet luxury and an immersive, museum-like digital experience.

The style is **Minimalist-Gallery with Glassmorphic accents**. It prioritizes extreme negative space and a "void" background to eliminate visual noise. The aesthetic is defined by:
- **Atmospheric Depth:** Using deep charcoals and near-blacks to create a sense of infinite space.
- **Asymmetric Balance:** Moving away from standard bootstrap-style grids toward more dynamic, editorial-style layouts that mimic physical gallery walls.
- **Sophisticated Transparency:** Using frosted layers only for functional overlays to maintain focus on the artwork underneath.

## Colors

The palette is anchored in a "True Dark" philosophy. The primary background uses `#04070A` to provide more depth than pure black while ensuring OLED-friendly contrast. 

- **Primary & Secondary:** These blue-spectrum accents (`#52A2ED`, `#A3CEFF`) are reserved strictly for interactive highlights, price points, or availability badges. They should be used sparingly (the 60-30-10 rule is pushed here to 95-4-1).
- **Surface Tiers:** `#13171C` is used for cards and modular sections to provide a subtle lift from the background.
- **Typography:** Primary text uses an off-white `#F5F5F5` to reduce eye strain compared to pure white, while secondary information fades into a sophisticated light gray.

## Typography

This design system utilizes **Geist** for headlines to provide a technical, modern edge that contrasts with the organic nature of art. **Inter** is utilized for body copy due to its exceptional legibility in dark mode environments.

Large display headings use tight letter spacing and significant weight to create "visual anchors" on the page. Body text utilizes "generous leading" (1.6x - 1.8x) to ensure descriptions of artwork are easy to digest. Labels are kept small, uppercase, and tracked out to provide a metadata-style aesthetic common in museum plaques.

## Layout & Spacing

The design system employs a **Modular, Asymmetrical Grid**. Unlike standard commercial sites, the layout intentionally breaks symmetry to create a sense of discovery.

- **Breakpoints:** Desktop (1440px+), Tablet (768px-1439px), Mobile (<767px).
- **Rhythm:** A base-8 spacing system is used, but for top-level layout, "Section Gaps" of 128px are preferred to enforce the "breathable" gallery feel.
- **Asymmetry:** On desktop, artwork cards should offset by 40-80px from their neighbors in a masonry-style vertical flow.
- **Margins:** Ultra-wide margins (64px) on desktop push content inward, focusing the user's eye on the center of the viewport.

## Elevation & Depth

Elevation in this design system is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional shadows.

1.  **Level 0 (Base):** `#04070A` - The infinite canvas.
2.  **Level 1 (Cards/Sections):** `#13171C` - Subtle separation for content grouping.
3.  **Level 2 (Overlays/Navigation):** `rgba(20, 25, 30, 0.7)` with a 20px backdrop-blur. This creates a "frosted obsidian" effect that allows artwork colors to bleed through subtly as the user scrolls.
4.  **Borders:** Use 1px solid `rgba(255, 255, 255, 0.08)` for structural definition. Avoid heavy shadows; if necessary, use a "glow" shadow (`rgba(82, 162, 237, 0.1)`) for active primary elements.

## Shapes

The design system utilizes **Soft (Level 1)** roundedness. Since art frames are traditionally sharp or slightly beveled, the UI should not be overly rounded or "bubbly."

- **Standard Elements:** 4px (0.25rem) radius for buttons and small inputs.
- **Artwork Containers:** 8px (0.5rem) radius to soften the edges of photography and digital art without making them look like mobile apps.
- **Interactive States:** On hover, shapes may transition to a slightly larger radius or expand slightly in scale (1.02x).

## Components

### Buttons
- **Primary:** Solid `#F5F5F5` with `#04070A` text. No border. High contrast for CTA.
- **Secondary:** Ghost style with 1px `#FFFFFF` border (low opacity) and white text.
- **Interaction:** All buttons should have a 300ms ease-out transition on hover, typically increasing opacity or slightly shifting upward.

### Input Fields
- Background: `#13171C`.
- Border: Bottom-border only (2px) or very subtle all-around border. 
- Focus state: Border color shifts to `#52A2ED`.

### Cards (Art Display)
- No visible border by default.
- Image takes 100% width.
- Metadata (Title, Artist, Price) appears in the secondary text color below the image.
- **Hover state:** The image should subtly scale up within its container, and the background of the card may lift to Level 2 elevation.

### Navigation
- Sticky header with "Obsidian" glassmorphism.
- Minimalist icon-only or text-only links in `label-sm` typography.

### Progress & Loading
- Use thin, linear loaders in `#52A2ED`. Avoid heavy spinners; use skeleton screens that match the asymmetrical layout of the gallery.