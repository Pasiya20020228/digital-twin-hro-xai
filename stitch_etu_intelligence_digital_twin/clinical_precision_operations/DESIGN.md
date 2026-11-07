---
name: Clinical Precision Operations
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d9e2fc'
  on-surface: '#121b2e'
  on-surface-variant: '#44474e'
  inverse-surface: '#273044'
  inverse-on-surface: '#edf0ff'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4c5e83'
  primary: '#001637'
  on-primary: '#ffffff'
  primary-container: '#172b4d'
  on-primary-container: '#8093bb'
  inverse-primary: '#b4c7f1'
  secondary: '#2850ce'
  on-secondary: '#ffffff'
  secondary-container: '#476ae8'
  on-secondary-container: '#fffbff'
  tertiary: '#001b18'
  on-tertiary: '#ffffff'
  tertiary-container: '#00322d'
  on-tertiary-container: '#2ca397'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b4c7f1'
  on-primary-fixed: '#041b3c'
  on-primary-fixed-variant: '#34476a'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001452'
  on-secondary-fixed-variant: '#0038b6'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9ff'
  on-background: '#121b2e'
  surface-variant: '#d9e2fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-metric:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a premium, authoritative, and frictionless command-and-control environment tailored for enterprise healthcare executives, clinical operations directors, and hospital staff. Operating at the intersection of critical patient care and autonomous systems, the interface prioritizes calm authority, immediate legibility, and high-density situational awareness without cognitive overload.

The aesthetic philosophy fuses **Modern Enterprise Functionalism** with **Clinical Architectural Rigor**. The UI projects absolute dependability and high precision: zero decorative noise, intentional structural whitespace, razor-sharp alignment rules, and strict semantic signaling. Real-time digital twin simulations and multi-agent AI recommendations are presented as transparent, auditable, and human-in-the-loop decisions rather than black-box outputs.

## Colors

The color palette is calibrated for high-vigilance clinical monitoring environments under harsh overhead hospital lighting. Contrast levels consistently meet or exceed WCAG AAA requirements for mission-critical typography.

### Role Assignments
- **Canvas Base (`#F5F7FB`)**: Cool, soft clinical ground providing clear separation against white modules without glare.
- **Surface Panels (`#FFFFFF`)**: Pure, un-tinted clinical white reserved for cards, datagrids, and analytical controls to establish focal clarity.
- **Primary Navy (`#172B4D`)**: The foundational executive anchor. Used for primary navigation rails, top-level brand iconography, high-emphasis text, and active structural states.
- **Action Blue (`#3157D5`)**: The definitive interactive affordance. Used for primary CTAs, agent routing indicators, selected states, and real-time path highlights.
- **Analytical Teal (`#0D9488`)**: Dedicated to multi-agent intelligence telemetry, digital twin simulations, autonomous agent logic, and predictive capacity modeling.
- **Primary Text (`#172033`)**: Deep slate-black delivering maximum contrast against white and light neutral surfaces.
- **Secondary Text (`#64748B`)**: Balanced cool gray for supporting metadata, units, breadcrumbs, and muted table columns.
- **Structural Borders (`#E2E8F0`)**: Low-contrast architectural dividers that define zones without creating visual clutter.

### Semantic Status Tokens
- **Operational Normal (`#10B981`)**: Stable capacity, nominal patient flow, and verified agent actions.
- **Advisory / Latent Contention (`#F59E0B`)**: Predicted bottlenecks, pending approvals, and moderate load thresholds.
- **Critical Contention (`#EF4444`)**: Resource depletion, acute diversion requirements, and unassigned critical alerts.

## Typography

The typography is built entirely on **Inter**, optimized for density and readability in data-intensive operational environments. 

### Numeric & Clinical Rules
- Every data cell, bed count, timestamp, agent probability percentage, and telemetry read-out must mandate `font-variant-numeric: tabular-nums` to avoid column jitter during live-stream updates.
- Metric values pair standard Inter letterforms with strict baseline alignment alongside unit markers (e.g., "94.2 %" where "%" is set in `label-md` baseline-aligned to the integer).
- Upper-case styling is reserved strictly for `label-sm` status chips, operational triage codes, and agent state identifiers.

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid governed by an absolute 8px base rhythm (with 4px micro-subdivisions for compact table elements).

### Screen Adaptations
- **Desktop / Operations Wallboard (>= 1440px)**: 12-column grid, 24px margins, 16px gutters. Allows a persistent 280px left rail for hospital-wide department navigation, a main operational stage (flexible 8-column digital twin floor plan/canvas), and a 4-column right rail dedicated to real-time agent triage feeds.
- **Standard Laptop / Clinical Workstation (1024px - 1439px)**: 12-column grid, 16px margins, 16px gutters. The right agent telemetry rail collapses into an expandable overlay drawer or a tabbed layout.
- **Tablet / Mobile Rounds (< 1024px)**: 4-column responsive grid, 16px margins, 12px gutters. Sidebars fold into standard off-canvas sheets. Priority is redirected to real-time incident queues and alert resolution workflows.

All interactive elements maintain a minimum 40px touch/click target area while retaining visual compactness via 4px internal micro-padding offsets.

## Elevation & Depth

Visual hierarchy relies on structural planes and subtle hairline borders rather than heavy atmospheric shadows. The goal is clinical flat clarity, minimizing visual drag.

- **Level 0 (Canvas Base)**: `#F5F7FB` background plane.
- **Level 1 (Card & Module Surfaces)**: Pure `#FFFFFF`, delineated by a continuous 1px solid border (`#E2E8F0`) and an ambient micro-shadow: `0 1px 3px 0 rgba(23, 43, 77, 0.04), 0 1px 2px -1px rgba(23, 43, 77, 0.04)`.
- **Level 2 (Active Overlays, Popovers & Hover Cards)**: Surface `#FFFFFF`, border `#CBD5E1`, with an elevated clinical shadow: `0 4px 6px -1px rgba(23, 43, 77, 0.06), 0 2px 4px -2px rgba(23, 43, 77, 0.04)`.
- **Level 3 (Command Modals & Emergency Overrides)**: Surface `#FFFFFF`, shadow: `0 20px 25px -5px rgba(23, 43, 77, 0.1), 0 8px 10px -6px rgba(23, 43, 77, 0.06)`, framed over a semi-transparent slate wash (`rgba(23, 32, 51, 0.45)` with `backdrop-filter: blur(4px)`).

## Shapes

The design system enforces a calibrated dual-radius language:
- **Small Elements & Controls (0.5rem / 8px)**: Standard buttons, input fields, dropdown trigger selectors, data chips, and table row selections.
- **Large Panels & Containers (0.75rem / 12px)**: Dashboard analytical panels, digital twin canvas viewports, flyout summary cards, and operational modal windows.
- **Full Radius (9999px / Pill)**: Reserved exclusively for atomic status markers, confidence metrics, and agent state indicator pills to contrast against the geometric grid of hospital data.

## Components

### Buttons
- **Primary Action**: Solid `#3157D5` fill, `#FFFFFF` text, 8px corner radius, 10px 16px padding. In hover states, transitions to `#2545B8`. Focused with a 2px offset ring in `#3157D5`.
- **Secondary Action**: `#FFFFFF` background, 1px solid `#E2E8F0` border, `#172033` label. On hover, background shifts to `#F8FAFC` and border deepens to `#CBD5E1`.
- **Destructive / Emergency Override**: `#EF4444` background, `#FFFFFF` text. Used only for manual system interventions, bed diversions, and alert dismissals.

### Input Fields & Selectors
- Standard height: 40px. 
- Background: `#FFFFFF`. 
- Border: 1px solid `#E2E8F0`. 
- Default label: `#172033`, placeholder: `#94A3B8`.
- Focus state: Border shifts to `#3157D5` with an outer non-blur halo of `0 0 0 3px rgba(49, 87, 213, 0.15)`.

### Cards & Analytical Panels
- Flat `#FFFFFF` surface with 12px border radius, 1px `#E2E8F0` border.
- Cards feature a standardized header zone: `body-sm` or `label-md` uppercase category tracking, paired with an action menu slot or real-time streaming ping dot.
- Content sections are divided by 1px solid `#F1F5F9` lines, avoiding nested double-borders.

### Status Badges & Explainable AI Pills
- Built with a full pill radius (9999px), using muted pastel tints for backgrounds paired with deep, saturated text:
  - **Nominal**: Background `#ECFDF5`, text `#065F46`, dot `#10B981`.
  - **Advisory**: Background `#FFFBEB`, text `#92400E`, dot `#F59E0B`.
  - **Critical**: Background `#FEF2F2`, text `#991B1B`, dot `#EF4444`.
  - **AI Agent Recommendation**: Background `#F0FDFA`, text `#115E59`, border 1px solid `#CCFBF1`, leading icon in `#0D9488`.

### Data Tables & Resource Grids
- Row height: 44px (compact) to 52px (standard).
- Table header: `#F8FAFC` surface, uppercase `label-sm` text in `#64748B`, 1px solid bottom border (`#E2E8F0`).
- Cells utilize `font-variant-numeric: tabular-nums` for precise scanning across occupancy percentages, OR turnaround intervals, and emergency department lengths of stay.
- Hover states trigger a subtle row background wash of `#F8FAFC`.

### Explainable AI Recommendation Drawer
- High-priority operational pattern: When an agent suggests shifting resources (e.g., reallocating 4 ICU nurses or diverting non-trauma cases), the rationale card displays:
  - Confidence Score Meter (percentage pill in tabular numerals).
  - Multi-variable trade-off tree (compact stepped list with directional tags).
  - Clear dual-action human confirmation: "Approve Optimization" (`#3157D5`) vs "Override" (`#64748B` ghost button).