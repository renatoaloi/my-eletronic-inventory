## Why

The sidebar does not occupy the full viewport height on desktop (`lg:static` overrides `h-full`), and the version badge (`absolute bottom-0`) loses its positioning context when the sidebar becomes `static`, causing it to float relative to the viewport. This creates a visual gap below the sidebar that makes the layout look broken and can cause content overlap with the main area.

## What Changes

- Fix sidebar desktop height to always fill the full viewport (`min-h-screen`)
- Ensure the version badge is correctly positioned relative to the sidebar on all screen sizes
- No changes to navigation links, mobile behavior, or functional logic

## Capabilities

### New Capabilities

- `sidebar-layout-fix`: Correct sidebar sizing and positioning so it fills the full viewport height on desktop and the version badge renders inside the sidebar bounds

### Modified Capabilities

*(none — existing capabilities have no requirement changes)*

## Impact

- `frontend/src/components/Sidebar.jsx` — CSS class changes only (Tailwind utility classes)
- `frontend/src/components/Layout.jsx` — possible minor class adjustments to maintain proper flex layout
- No API, backend, or dependency changes
