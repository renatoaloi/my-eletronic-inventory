## Context

The sidebar uses `fixed` positioning on mobile (slides in/out via `translate-x`) and switches to `static` on desktop via `lg:static`. Two issues arise on desktop:

1. **Height breaks**: `h-full` on a `static` element resolves to the parent's computed `height: auto`, not `100vh`. The sidebar only grows as tall as its content (~300px), leaving a gap below.
2. **Version badge floats**: `absolute bottom-0` requires a positioned ancestor. When the sidebar is `static`, the badge positions relative to the viewport, not the sidebar.

The parent layout uses `min-h-screen flex` — the flex container stretches children by default, but `h-full` overrides that with an explicit `100%` that resolves incorrectly.

## Goals / Non-Goals

**Goals:**

- Sidebar fills full viewport height on desktop (≥lg breakpoint)
- Version badge is always positioned at the bottom of the sidebar, regardless of screen size
- Mobile behavior (slide overlay, fixed positioning, translate animation) is unchanged
- No visual regressions in the main content area

**Non-Goals:**

- No changes to sidebar width, nav link styling, or iconography
- No changes to the mobile header or content layout structure
- No backend, API, or database changes

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Positioning model | Keep `fixed` → `static` toggle but fix height/badge | Minimum diff; no need to restructure layout for a CSS fix |
| Desktop height | `lg:min-h-screen` instead of `lg:h-screen` | `min-h-screen` ensures fills viewport but allows growth; `h-screen` would clip if content ever exceeds viewport |
| Badge positioning context | Add `lg:relative` to sidebar when `lg:static` | `relative` establishes a positioning ancestor for `absolute` children without affecting layout flow |

## Risks / Trade-offs

- **[Low]** `lg:relative` on a `flex` child is harmless — flex layout ignores `position: relative` for sizing
- **[Low]** `lg:min-h-screen` on a `static` flex child: flex stretch behavior still applies, min-height ensures the sidebar is at least viewport height
- **[None]** No risk of content clipping — sidebar nav will never exceed viewport height in this app
