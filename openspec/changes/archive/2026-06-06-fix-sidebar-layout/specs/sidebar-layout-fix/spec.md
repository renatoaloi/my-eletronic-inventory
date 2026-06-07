## ADDED Requirements

### Requirement: Sidebar fills full viewport height on desktop

On screens at the `lg` breakpoint (1024px) and above, the sidebar SHALL extend to the full height of the viewport, regardless of the length of its content.

#### Scenario: Desktop sidebar fills viewport

- **WHEN** the viewport width is ≥1024px
- **THEN** the sidebar height SHALL be at least the viewport height

#### Scenario: Desktop sidebar has no bottom gap

- **WHEN** the viewport width is ≥1024px
- **THEN** there SHALL be no visible gap between the bottom of the sidebar and the bottom of the viewport

### Requirement: Version badge stays at sidebar bottom

A "v1.0.0" badge SHALL always be rendered at the bottom of the sidebar, visually inside the sidebar bounds, on all screen sizes.

#### Scenario: Version badge on desktop

- **WHEN** the viewport width is ≥1024px
- **THEN** the "v1.0.0" badge SHALL appear at the bottom of the sidebar, within the sidebar's visual boundaries

#### Scenario: Version badge fills sidebar width

- **WHEN** the viewport width is ≥1024px
- **THEN** the version badge SHALL span the full width of the sidebar at its bottom edge

### Requirement: No layout regressions

The fix SHALL NOT cause visual regressions in the main content area, mobile sidebar behavior, or nav link styling.

#### Scenario: Mobile sidebar unchanged

- **WHEN** the viewport width is <1024px
- **THEN** the sidebar SHALL still slide over the content using `fixed` positioning with the same animation, overlay, and z-index as before

#### Scenario: Content area unchanged

- **WHEN** the viewport width is ≥1024px
- **THEN** the main content area SHALL still occupy the remaining space to the right of the sidebar with the correct `flex-1` behavior
