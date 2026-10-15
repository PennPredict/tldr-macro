# Approved design changes

## 2026-10-14 — Raise the Economic Thread

Approved by the user in chat. The Economic Thread moves directly below the full header; no component styling, colors, type scale, or internal geometry changes. The existing thread-to-story focus treatment is re-scoped to the page shell solely to preserve its behavior after the move.

## 2026-10-14 — Plain-language Economic Thread

Approved by the user in the supplied specification. The design-freeze allowlist remains limited to `app/EconomicThread.tsx`; no new colors, type scale, spacing system, page order, or page-wide component styles are introduced. The change reuses the existing diagram and popover treatments while making labels, reading order, and explanations understandable without economics coursework.

## 2026-10-14 — Economic Thread evidence model

Approved by the user in the supplied specification. Allowlist: `app/EconomicThread.tsx` and the Economic Thread rules in `app/globals.css`. Reason: replace the exploratory parallel trees with one compact, time-ordered, typed, evidence-backed thread with arrowheads and a mechanism row. All other computed-style baselines remain frozen.

## 2026-10-14 — Multi-factor composition and mechanism ordering

Approved by the user in the supplied specification. Allowlist remains limited to `app/EconomicThread.tsx` and the Economic Thread rules in `app/globals.css`. Reason: distinguish CPI composition from mechanisms, place valuation before Nasdaq, show same-day attributed factors, and provide thread-only legend, schedule, and staging context. All non-thread visuals remain frozen.

## 2026-10-14 — Simplified, approval-gated Economic Thread

Approved by the user in the supplied specification. The design-freeze allowlist remains limited to `app/EconomicThread.tsx` and the Economic Thread rules in `app/globals.css`; the calendar receives IDs only, with no visual change. Reason: reduce the thread to six nodes and five unambiguous links, provide a mobile because/so sequence, and keep optional sourced captions out unless separately approved. All non-thread colors, fonts, type scale, spacing, layout, components, logo, and section order remain frozen.
