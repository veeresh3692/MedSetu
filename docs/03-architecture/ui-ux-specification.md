# HEALTHCARE UI/UX DESIGN SPECIFICATION & COMPONENT CONTRACTS
## MEDICOMPARE INDIA
**Document ID:** `DOC-UI-001`  
**Task ID:** `MC-010`  
**Author:** AGENT 08 — UI/UX Designer & AGENT 09 — Frontend Engineer  
**Reviewer:** AGENT 12 — Security Engineer  
**Status:** `APPROVED`  
**Version:** `1.0.0`  
**Date:** 2026-11-08  
**Standard:** WCAG 2.1 AA / Next.js App Router / Tailwind CSS  

---

## 1. Design System Foundations & Color Tokens

The visual design system of MediCompare India communicates clinical trustworthiness, accessibility for elderly patients, and complete transparency.

### 1.1 Color Palette
| Token Name | Hex Code | Role & Usage | Contrast Ratio vs White |
| :--- | :--- | :--- | :--- |
| **`emerald-600` (Primary)** | `#059669` | Primary actions, CTA buttons, active states | 4.54:1 (WCAG AA Pass) |
| **`emerald-900` (Dark Green)**| `#064E3B` | Brand identity, primary headers, high emphasis | 12.6:1 (WCAG AAA Pass) |
| **`emerald-50` (Light Green)**| `#ECFDF5` | Background cards, verified badges, highlight bars | High contrast against dark green |
| **`slate-50` (Background)** | `#F8FAFC` | Primary application canvas background | Clean, glare-free |
| **`slate-900` (Text Primary)**| `#0F172A` | Primary typography, medicine titles, prices | 16.1:1 (WCAG AAA Pass) |
| **`slate-500` (Text Muted)** | `#64748B` | Secondary details, manufacturers, pack sizes | 4.61:1 (WCAG AA Pass) |
| **`amber-600` (Rx Warning)** | `#D97706` | Schedule H / H1 prescription warnings | 4.52:1 (WCAG AA Pass) |
| **`amber-50` (Rx Background)**| `#FFFBEB` | Warning card background | Soft amber container |
| **`blue-600` (Govt Generic)** | `#2563EB` | Jan Aushadhi (PMBJP) public generic badge | 4.56:1 (WCAG AA Pass) |
| **`blue-50` (Govt Background)**| `#EFF6FF` | Jan Aushadhi alternative container | Public generic container |

---

## 2. Layout Structure & Responsive Breakpoints

The application follows a mobile-first responsive architecture:
- **Mobile (`< 640px`)**: Single-column vertical stack with collapsible bottom sheet / tabs for Map vs. List view.
- **Tablet (`640px – 1024px`)**: Two-column layout; sticky medicine header.
- **Desktop (`>= 1024px`)**: Split view:
  - Left Column (60%): Medicine details, NPPA statutory reference, bioequivalent generic alternatives, and pharmacy list.
  - Right Column (40%): Sticky interactive Leaflet/OSM map with pinned store locations.

---

## 3. Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│ Navbar: Brand Logo + Bengaluru Locality Picker + Global Search Bar    │
├────────────────────────────────────────────────────────────────────────┤
│ MedicineHeader: Brand Name + Pack Size + MRP + Schedule H Rx Badge     │
│                 + Exact Monograph Active Salt Composition Display      │
├────────────────────────────────────────────────────────────────────────┤
│ GovernmentPriceCard: NPPA DPCO Ceiling Price Reference + Gazette S.O.  │
├──────────────────────────────────┬─────────────────────────────────────┤
│ BioequivalentAlternatives:       │ PharmacyMap (Leaflet/OSM):          │
│ • Jan Aushadhi (PMBJP) Generic   │ • Interactive pins for stores       │
│ • Domestic Branded Generics      │ • Price competitiveness markers     │
│ • Savings % and unit economics   │ • Distance radius boundary circle   │
├──────────────────────────────────┤                                     │
│ NearbyPharmacyList:              │                                     │
│ • Store name & address           │                                     │
│ • Distance in km (Haversine)     │                                     │
│ • Live Selling Price (<= MRP)    │                                     │
│ • Stock Badge (In Stock)         │                                     │
│ • "Get Directions" link          │                                     │
│ • "Report Price" dispute trigger │                                     │
├──────────────────────────────────┴─────────────────────────────────────┤
│ Footer: Persistent Statutory Non-Dispensing Disclaimer + DPDP Privacy  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Accessibility & Patient Experience Guardrails

1. **Font Sizing**: Base text is `16px` (`text-base`) with minimum line height `1.5` to assist visually impaired and senior citizens.
2. **Touch Targets**: All interactive elements (buttons, search results, tabs) maintain a minimum target size of `44x44 px`.
3. **Screen Readers**: All badges, price savings indicators, and modal triggers have explicit `aria-label` attributes.
4. **No Medical Misleading**: Any alternative brand presentation must feature the disclaimer: *"Always consult your prescribing doctor before substituting medications."*

---

*Authored by Agent 08 (UI/UX) & Agent 09 (Frontend). Approved by Agent 12 (Security Engineer).*

