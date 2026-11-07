---
name: responsive-design
description: >-
  Implements responsive, mobile-first layouts using Tailwind CSS across mobile, tablet, and desktop breakpoints.
---

# Skill: responsive-design

## 1. Description & Purpose
Implements responsive, mobile-first layouts using Tailwind CSS across mobile, tablet, and desktop breakpoints.

## 2. Scope & Applicability
Tailwind breakpoints (sm, md, lg, xl), mobile navigation, responsive tables, drawer/modal behavior, and touch ergonomics.

## 3. When to Use
When building or reviewing frontend views to ensure seamless cross-device experiences.

## 4. Required Inputs
- Page mockups
- Tailwind configuration
- Device viewport specifications

## 5. Execution Procedure
1. Adopt mobile-first utility classes (default styles for 320px-640px, scaling up via `md:`, `lg:`).
2. Ensure complex comparison tables adapt on mobile (convert to card-based views or sticky comparison columns).
3. Optimize map layouts: bottom sheet or toggleable map view on mobile, split-screen on desktop.
4. Verify touch targets, thumb-friendly navigation bar, and input zoom prevention on iOS/Android browsers.
5. Test responsiveness across common viewports (360x800, 390x844, 768x1024, 1440x900).

## 6. Safety Constraints & Guardrails
- Ensure no horizontal scroll overflow or unreadable microscopic font sizes on compact mobile screens.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Responsive Layout Specs
- Viewport Breakpoint Audit
- Mobile Card Component Templates

## 8. Validation Checklist
- [ ] Is the interface fully functional on 360px mobile screens?
- [ ] Do comparison tables transform gracefully on mobile?
- [ ] Is horizontal overflow prevented?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
