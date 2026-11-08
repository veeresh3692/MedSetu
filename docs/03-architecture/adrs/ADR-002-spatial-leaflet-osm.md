# ADR-002: LEAFLET & OPENSTREETMAP OVER PROPRIETARY MAP APIS
**Status:** APPROVED  
**Date:** 2026-11-08  
**Deciders:** Elite AI Orchestrator, AGENT 07 (System Architect), Product Owner  
**Consulted:** AGENT 09 (Frontend Engineer), AGENT 14 (DevOps Engineer)  

---

## 1. Context & Problem Statement
MediCompare India requires interactive geospatial map visualization to render nearby licensed pharmacies, display walking/driving distance, and allow consumers to filter pharmacies by radius (1 km, 3 km, 5 km, 10 km).

Commercial map providers (Google Maps Platform JavaScript API, Mapbox GL) enforce per-map-load pricing models:
- Google Maps charges ~$7.00 per 1,000 map loads after a monthly $200 credit.
- For a student project or public healthcare discovery platform with high consumer traffic, an unexpected surge could trigger runaway credit card charges.

What mapping architecture and library should MediCompare India use?

---

## 2. Decision
We will exclusively use **Leaflet (v1.9+) with OpenStreetMap (OSM) standard tiles** for client-side geospatial rendering, paired with server-side spatial calculations (spherical Haversine distance in SQL).

To prevent Server-Side Rendering (SSR) hydration crashes (`window is not defined`), Leaflet map components will be dynamically loaded via `next/dynamic` with `{ ssr: false }`.

---

## 3. Alternatives Considered

### Alternative 1: Google Maps JavaScript API & Places API
- *Pros*: Familiar styling, built-in search autocomplete.
- *Cons*: Mandatory billing credit card, severe financial risk of runaway costs, vendor lock-in.
- *Verdict*: **REJECTED**.

### Alternative 2: Mapbox GL JS / MapLibre GL
- *Pros*: Vector tiles, smooth zooming.
- *Cons*: Mapbox requires API key and commercial token billing; MapLibre requires hosting self-hosted vector tile servers.
- *Verdict*: **REJECTED** for MVP.

---

## 4. Consequences

### Positive Consequences
- **100% Free & Open-Source**: Zero recurring map subscription or API load costs.
- **Privacy Preserving**: No tracking of patient IPs or browsing habits by third-party advertising giants.
- **Lightweight**: Leaflet core is ~42 KB gzip, compared to Google Maps JS SDK (> 200 KB).
- **External Navigation Integration**: Provides direct one-click redirect links (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`) allowing consumers to navigate using their preferred native mobile app (Google Maps / Apple Maps).

### Negative / Trade-off Consequences
- **Tile Server Etiquette**: OpenStreetMap tile servers enforce fair-use limits; custom tile caching or CDN caching must be respected.
- **SSR Requirement**: Requires strict `next/dynamic` wrapper to avoid Next.js build and hydration failures.

---

## 5. Compliance & Verification
- Adheres to MediCompare Governance Rule `01-product-architecture-governance.md` and Risk Register `RSK-08`.
- Verified in Task MC-005 by Agent 07 (System Architect).
