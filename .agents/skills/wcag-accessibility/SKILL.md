---
name: wcag-accessibility
description: >-
  Audits and implements WCAG 2.1 AA accessibility standards for inclusive, screen-reader friendly healthcare user interfaces.
---

# Skill: wcag-accessibility

## 1. Description & Purpose
Audits and implements WCAG 2.1 AA accessibility standards for inclusive, screen-reader friendly healthcare user interfaces.

## 2. Scope & Applicability
WCAG 2.1 AA compliance, semantic HTML, ARIA attributes, keyboard navigation, color contrast, and screen reader testing.

## 3. When to Use
When designing, coding, or reviewing UI components, search forms, dialogs, and comparison tables.

## 4. Required Inputs
- Component markup
- Color palette tokens
- Accessibility guidelines

## 5. Execution Procedure
1. Verify color contrast ratios: text to background must meet minimum 4.5:1 for normal text and 3:1 for large text.
2. Ensure full keyboard accessibility: all interactive elements (buttons, inputs, links, dialogs) must be navigable and actionable via Tab/Enter/Space.
3. Implement semantic HTML: proper heading hierarchy (`h1` -> `h2` -> `h3`), `nav`, `main`, `section`, `aria-label` attributes where text is absent.
4. Add screen-reader announcements (`aria-live="polite"`) for dynamic search results and comparison updates.
5. Test focus management: modal dialogs must trap focus and return focus to triggering element upon close.

## 6. Safety Constraints & Guardrails
- Accessibility in healthcare is non-negotiable. Ensure elderly patients and users with visual impairments can easily read prices and dosage info.
- Strictly respect least-privilege boundaries and privacy mandates.
- Maintain transparent data provenance at all times.

## 7. Expected Outputs & Deliverables
- Accessibility Audit Report
- ARIA Annotation Spec
- Color Contrast Compliance Matrix

## 8. Validation Checklist
- [ ] Do all text elements meet 4.5:1 contrast?
- [ ] Is the complete search and comparison flow keyboard operable?
- [ ] Are ARIA labels present on icon-only buttons?

## 9. Reference Material & Standards
- MediCompare India Master Orchestrator Rules (`AGENTS.md`)
- MediCompare India Governance Rules (`.agents/rules/`)
- Antigravity Customization System Specification
