---
name: Clinical Twin Intelligence
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d7e2ff'
  on-surface: '#041b3c'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3052'
  inverse-on-surface: '#edf0ff'
  outline: '#747686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1f54d3'
  primary: '#003fb3'
  on-primary: '#ffffff'
  primary-container: '#2457d6'
  on-primary-container: '#d5dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#3f4a5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#576276'
  on-tertiary-container: '#d3def6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00164d'
  on-primary-fixed-variant: '#003cad'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f9f9ff'
  on-background: '#041b3c'
  surface-variant: '#d7e2ff'
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
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.03em
  telemetry-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
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
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves high-stakes hospital operational command at the National Hospital of Sri Lanka Emergency Treatment Unit (ETU). The design direction balances mission-critical clarity with modern enterprise health-tech authority. The interface embodies quiet urgency: calm, mathematically precise, explainable, and utterly stable under operational stress.

The emotional tone balances intense clinical trust with predictive intelligence. Clinicians and floor superintendents must interpret acute resource constraints, agentic allocation logic, and spatial bottlenecks in fractions of a second. Visual noise is treated as a clinical hazard. 

Stylistically, the system utilizes an **Enterprise Precision Modern** language:
- Clean clinical surfaces with precise borders rather than heavy atmospheric shadows.
- High-density tabular layouts with uncompromised legibility and spatial discipline.
- A distinctive dual-canvas model: clinical administration, agent reasoning panels, and triage telemetry operate in an ultra-clean, light clinical aesthetic, while spatial hospital digital twin floorplans project onto a low-reflection dark operational navy canvas.

## Colors

The palette enforces strict semantic authority, meeting WCAG 2.1 AAA contrast ratios across all critical clinical monitoring readouts:

- **Primary Canvas Background (`#F7F9FC`)**: A sterile, calm, low-glare clinical backdrop.
- **Surface Crisp White (`#FFFFFF`)**: Pure structural surface tier used for telemetry cards, metric matrices, and explainability inspectors.
- **Brand Clinical Blue (`#2457D6`)**: Precise, authoritative, and non-distracting. Applied to verified system states, active agent routes, and primary actions.
- **Secondary Restrained Teal (`#0D9488`)**: Dedicated to non-urgent medical status indicators, steady-state multi-agent coordination metrics, and confirmed bed transfers.
- **Primary Navy Text (`#172B4D`)**: High-contrast, optical-grade text token for all diagnostic headers, metrics, and patient identifiers.
- **Muted Slate (`#64748B`)**: Secondary metadata, timestamp references, agent inference confidence intervals, and units of measure.
- **Subtle Cool Gray Borders (`#E2E8F0`)**: Crisp boundaries separating high-density data regions without cognitive weight.

### Semantic Triage & Alert States
- **Normal / Nominal (`#059669`)**: Triage tier-stable, equipment calibrated, staffed.
- **Warning / Divert Risk (`#D97706`)**: Bed capacity thresholds at 80%+, triage queue backlog, approaching SLA breaches.
- **Critical Alert (`#DC2626`)**: Red-zone resuscitation bed depletion, critical equipment offline, emergent mass casualty redirection.

### Digital Twin Spatial Surface
- **Canvas Base (`#0B132B`)**: Deep non-reflective void for real-time ETU 3D/2D orthographic floorplans.
- **Spatial Grid & Architectural Shell (`#1E293B`)**: Ward zones, walls, transit corridors, and bed bays.

## Typography

Typography prioritizes rapid clinical scan rates, scannability under stress, and alignment integrity:

- **Primary Structural Font (Inter)**: Applied across all interface prose, contextual headers, modal dialogues, and explainability reasoning trees. `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` should be enabled to guarantee unmistakable glyph distinction between `I`, `l`, `1`, `0`, and `O`.
- **Telemetry & Operational Data Font (JetBrains Mono)**: Applied to bed numbers, vital statistics, queuing algorithms, agent confidence metrics, and floorplan hardware coordinates. Enforces rigid columnar alignment in dynamic tables without horizontal jitter.
- **Labels & Badges**: Small caps/uppercase labels utilize `letter-spacing: 0.04em` to preserve readability at micro-scales (11px).

## Layout & Spacing

The interface employs a dense, high-utility fluid grid layout system built specifically for multi-monitor command consoles (workstations, wall displays, tablet carts):

- **Grid Architecture**: 12-column dynamic grid on desktop views (min-width: 1440px), collapsing to an 8-column layout for clinical workstation monitors (1024px to 1439px), and 4 columns on bedside tablets (<1024px).
- **Dual-Pane Workstation Split**: Digital Twin floorplans occupy a permanent 60% viewport split by default, with the Agent Inference & Resource Allocation Panel holding the remaining 40%. Panes can be toggled or resized along a 4px structural divider.
- **Rhythm & Compression**: Standard enterprise spacing is tightened (`space-md: 0.75rem`) to maximize screen-space utilization without visual crowding. Compact tabular rows adhere strictly to a 36px standard height for rapid assessment.
- **Safe Margins**: Edge boundaries are locked at `1.25rem` to keep critical data fields outside peripheral monitor bezels.

## Elevation & Depth

Visual hierarchy is constructed primarily through **crisp structural borders and surface tonal layering**, deliberately minimizing ambient shadows to reduce interface blur during rapid scanning:

- **Level 0 (App Canvas)**: `#F7F9FC`. Base workspace backdrop.
- **Level 1 (Data Cards & Telemetry Surfaces)**: `#FFFFFF` bounded by a 1px solid border of `#E2E8F0`. No shadow.
- **Level 2 (Active Agent Interventions & Pinned Bays)**: `#FFFFFF` with a 1px solid border of `#CBD5E1` and an ultra-subtle ambient shadow: `0 1px 3px 0 rgba(23, 43, 77, 0.04), 0 1px 2px -1px rgba(23, 43, 77, 0.02)`.
- **Level 3 (Diagnostic Drawers & Explainability Overlays)**: `#FFFFFF` floating over floorplans with `0 8px 24px -4px rgba(11, 19, 43, 0.12), 0 2px 6px -1px rgba(11, 19, 43, 0.04)`.
- **Digital Twin Viewport Depth**: Layers inside the floorplan use inverted tonal illumination:
  - Floor plane: `#0B132B`
  - Structural walls/boundaries: `#1E293B`
  - Available capacity: `#0D9488` at 15% fill, 1px `#0D9488` border
  - Saturated/Critical zone: `#DC2626` at 20% fill, 1.5px `#DC2626` border

## Shapes

The design system adopts a **Soft (`1`)** shape geometry. In a clinical and emergency operating environment, excessively rounded or pill-shaped buttons feel toy-like, while razor-sharp corners induce fatigue across data-heavy tables.

- **Micro Components (Badges, Status Chips, Inputs)**: `0.25rem` (4px) corner radius.
- **Containers & Cards (Resource Cards, Patient Panels, Telemetry Pods)**: `0.375rem` (6px) or `0.5rem` (8px).
- **Digital Twin Geometries**: Floorplan bed bays, equipment nodes, and triage triage stations maintain strict geometric accuracy with 2px corner radiuses for crisp vector rendering at various zoom levels.
- **Modals & Flyouts**: `0.5rem` (8px) corner radius.

## Components

### Buttons
- **Primary (Action/Allocation Confirm)**: Background `#2457D6`, foreground `#FFFFFF`, border none, 32px height in standard tables, 40px height for emergency execution buttons. Corner radius `0.25rem`. Hover `#1D44B8`.
- **Secondary (Agent Override/Inspect)**: Background `#FFFFFF`, foreground `#172B4D`, border 1px solid `#E2E8F0`. Hover `#F1F5F9`.
- **Critical Action (Immediate Divert/Code Red)**: Background `#DC2626`, foreground `#FFFFFF`, border none. Hover `#B91C1C`.
- **Ghost/Tertiary (Filter/View controls)**: Background transparent, foreground `#64748B`. Hover background `#F1F5F9`, foreground `#172B4D`.

### Status Badges & Chips
- Compact, inline indicators with strict monospace numerals where applicable.
- **Stable / Tier 3-4**: Background `#ECFDF5`, text `#047857`, border 1px solid `#A7F3D0`.
- **Warning / Tier 2**: Background `#FFFBEB`, text `#B45309`, border 1px solid `#FDE68A`.
- **Critical / Tier 1 (Resuscitation)**: Background `#FEF2F2`, text `#B91C1C`, border 1px solid `#FECACA`. Includes a high-visibility 6px circular indicator dot.

### Telemetry & Table Rows
- **Height**: 36px compact rows for high-volume logs; 48px for bed status overviews.
- **Borders**: 1px horizontal bottom divider `#E2E8F0`.
- **Numeric Columns**: Right-aligned, formatted with `JetBrains Mono` with active tabular figures (`tnum`).

### Input Fields & Controls
- **Inputs & Selects**: 32px and 36px heights. Border 1px solid `#CBD5E1`, background `#FFFFFF`, text `#172B4D`. Focus state uses `#2457D6` outline with a 2px offset rings of `rgba(36, 87, 214, 0.15)`.
- **Checkboxes & Radios**: 16px square/circle with 1.5px border `#CBD5E1`. Checked state background `#2457D6`, icon white.

### Explainable AI Cards
- Dedicated containers displaying agent reasoning paths (e.g., "Why Bed 04 was reassigned from Observation to Acute Asthma").
- Header displays Agent ID (e.g., `AGENT_TRIAGE_OPTIMIZER_02`), confidence score metric pill (e.g., `98.4% CONF`), and an expand/collapse breakdown of decision constraints (oxygen supply proximity, nurse-to-patient ratio, wait-time impact).
- Structural left border: 3px solid `#2457D6` (Inference), `#0D9488` (Resource Optimization), or `#DC2626` (Preemption Warning).

### Digital Twin Overlay Tooltips
- Inverted theme card positioned dynamically above floorplan SVG/Canvas elements.
- Background `#0B132B`, border 1px solid `#334155`, text `#F8FAFC`. Monospace stats displayed in high-contrast crisp text `#38BDF8`.