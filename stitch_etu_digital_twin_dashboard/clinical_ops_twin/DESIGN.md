---
name: Clinical Ops Twin
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#40484c'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#70787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#1e667f'
  primary: '#004357'
  on-primary: '#ffffff'
  primary-container: '#0d5c75'
  on-primary-container: '#93d3ef'
  inverse-primary: '#90cfec'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#004456'
  on-tertiary: '#ffffff'
  tertiary-container: '#005d75'
  on-tertiary-container: '#85d5f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bde9ff'
  primary-fixed-dim: '#90cfec'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d64'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#b9eaff'
  tertiary-fixed-dim: '#81d1f0'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d62'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for high-pressure, rapid-triage clinical environments including Emergency Treatment Units (ETUs), Trauma Bays, and Acute Accident Wards. Operating as an operational digital twin, the interface prioritizes immediate legibility, zero cognitive fatigue, and fail-safe situational awareness under varying lighting conditions (harsh fluorescent wards to dimly lit night stations).

The design style synthesizes **Clinical Minimalism** with **Tactile Precision**. Rather than generic flat dashboards or playful consumer health aesthetics, it delivers an authoritative, instrumentation-grade UI reminiscent of modern physiological monitors and aerospace telemetries. High-contrast state delineations, crisp structural framing, and soft tactile surfaces prevent visual blur during rapid scanning by triage nurses, charge doctors, and unit coordinators on mobile and wall-mounted consoles.

## Colors

The palette is anchored in medical slate and clinical deep teal to promote focus and eliminate eye strain, supported by a non-negotiable, mission-critical status taxonomy:

- **Primary (`#0D5C75`)**: Deep Clinical Teal. Used for primary interactive controls, unit-level focus indicators, and verified system states.
- **Secondary (`#1E3A8A`)**: Deep Cobalt Slate. Drives structural hierarchy, navigation bars, and system telemetry markers.
- **Tertiary (`#0E7490`)**: Electric Cyan-Teal. Reserved for live telemetry sync indicators, bed sensor feeds, and active digital-twin node highlights.
- **Neutral (`#475569`)**: Surgical Slate. Provides crisp, AA/AAA-compliant typography, subtle architectural dividers, and low-priority labels.

### Operational Status Palette (Clinical Hierarchy)
- **Critical / Code Red / Surge**: `#DC2626` (Pure Crimson) with soft tinted background `#FEF2F2` and 1px border `#FCA5A5`. Used strictly for immediate life threats, cardiac alerts, and ward saturation alarms.
- **Warning / Attention / Triage Level 2**: `#D97706` (Medical Amber) / `#EA580C` (Urgent Coral) with `#FFFBEB` background. Denotes deteriorating vitals, pending lab bottlenecks, and pending transfers.
- **Normal / Nominal / Available**: `#059669` (Sterile Emerald) with `#ECFDF5` background. Denotes stable vitals, cleared beds, and ready crash carts.
- **Informational / Telemetry Active**: `#2563EB` (Medical Cobalt) with `#EFF6FF` background. Denotes patient tracking, transport in-transit, and diagnostic queue updates.

All critical alerts must maintain an APCA contrast ratio equivalent to WCAG AAA standards against both mobile screens in direct sunlight and dimmed night shifts.

## Typography

The typography uses **Inter** across all roles to maximize legibility of dense clinical data, patient identifiers, and medication dosages. 

- **Tabular Figures**: The font feature setting `tnum` (tabular numbers) and `cv05` (distinct lowercase 'l') must be enabled globally across all numeric vitals, bed metrics, and timestamps to eliminate layout shifts during real-time telemetry streaming.
- **Labels & Acronyms**: Status badges, ward codes (e.g., `ETU-BAY-04`), and vital parameters (e.g., `SpO2`, `BAM`, `GCS`) must use `label-md` or `label-sm` with slight uppercase tracking (+0.04em) to prevent misinterpretation under stress.
- **Dosage and Unit Hierarchy**: Always pair integer numbers with explicit unit suffixes styled at one step lower weight to avoid medication order misreads.

## Layout & Spacing

The layout model is anchored on an 8pt base grid with a 4pt sub-grid for dense telemetry tables and patient bed cards.

- **Grid Architecture**: 
  - **Desktop/Console (Wall Displays & Nursing Stations)**: 12-column fluid grid, `1.5rem` outer margins, `1rem` column gutters. Dedicated non-collapsible left rail for unit-wide critical counters (Code Blue, Resus capacity, Surge capacity).
  - **Tablet (Doctor Rounds & Mobile Carts)**: 8-column layout, `1.25rem` margins, `1rem` gutters.
  - **Mobile (Staff Handhelds)**: 4-column layout, `1rem` edge margin, `0.75rem` gutters. High-density vertical scrolling with sticky status headers.

- **Touch Targets**: All emergency actionable controls (Triage level toggle, Bed transfer, Code trigger) must maintain a minimum bounding box of 48×48px on mobile devices, even when visual badge tags appear compact.

## Elevation & Depth

Visual hierarchy uses **tonal layer stacking** combined with **subtle tactile outlines** rather than deep decorative shadows. This prevents the interface from feeling muddy under clinical fluorescent lighting:

- **Level 0 (Ward Canvas)**: Neutral surgical base `#F8FAFC`.
- **Level 1 (Bed & Bay Cards, Standard Surfaces)**: `#FFFFFF` encased in a crisp 1px tactile border `#E2E8F0`. Shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active Patient Focus / Hover)**: `#FFFFFF` encased in a 1px border `#CBD5E1`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Emergency Drawers / Triage Overlays / Med Delivery)**: `#FFFFFF` with `0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.06)` and a top 2px status accent line.
- **Critical Surge Elevation**: Critical alert modules omit blur and utilize a pulsating 2px perimeter stroke (`#DC2626`) paired with a high-contrast 10% translucent backing.

## Shapes

The design system enforces a **Soft (`1`)** shape language:
- Standard buttons, input fields, dropdowns: `0.25rem` (4px).
- Patient bed cards, diagnostic modules, telemetry containers: `0.5rem` (8px).
- Elevated status chips and triage badges: `0.25rem` (4px) with subtle chamfered or rounded edges. Full pills are strictly reserved for unread notification count tags to distinguish status chips from count bubbles.

The disciplined, tight radius avoids the casualness of consumer wellness apps and aligns with certified medical device screens.

## Components

### Buttons
- **Primary Action (Admit, Dispatch, Confirm Order)**: Background `#0D5C75`, text `#FFFFFF`, border-radius 4px. Minimum touch target 48px on mobile. Hover state shifts to `#0A475B`. Active state applies `scale(0.98)`.
- **Destructive / Emergency Action (Code Blue, Trauma Surge Alert)**: Background `#DC2626`, text `#FFFFFF`, bold weight. Requires tactile 1.5s press-and-hold interaction on mobile devices to prevent accidental triggers.
- **Secondary / Action Ghost**: Transparent background, 1px border `#CBD5E1`, text `#1E293B`.

### Triage Status Badges & Chips
- **Structure**: Multi-tier component containing an optional live pulse indicator (for telemetry), high-contrast uppercase text, and an explicit severity level code (e.g., `CAT 1 - RESUS`).
- **Surface**: Pale status tint background (`10% opacity`), sharp 1px matching border (`30% opacity`), and high-contrast saturated text. Never use faint low-contrast pastel text.

### Bed / Bay Digital Twin Cards
- **Structure**: Header displaying Bay ID, Patient Identifier, and Acuity Tier badge. Body displaying real-time micro-sparklines (HR, BP, SpO2) using tabular numerals. Footer containing assigned primary nurse and pending diagnostic timers.
- **State States**: Default white card; shifts to a 2px left border strip matching the current patient triage color (Crimson, Amber, Emerald, Slate).

### Form Controls & Inputs
- **Inputs & Selects**: Height 44px on mobile. 1px border `#CBD5E1`, background `#FFFFFF`. Focus ring: 2px solid `#0D5C75` with 0px offset. Error state: 1.5px solid `#DC2626`.
- **Triage Steppers**: Segmented button groups with unambiguous high-contrast selection fill, providing instantaneous visual feedback when re-triaging incoming trauma cases.

### Real-Time Vital Gauges & Sparklines
- **Sparklines**: 1.5px line stroke with a soft 8% vertical gradient fill. Zero smoothing overshoot to ensure precise clinical peaks (QRS complexes, arterial pulse waves).