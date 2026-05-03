---
name: UI Conventions
description: Design system: color themes per page, nav bar pattern, DataGrid sx style, search pattern
type: project
---

## Nav bar pattern (MembersNav, GearNav, StaffNav)
MUI AppBar elevation=0 with gradient background, h5 title, debounced live search input (300ms, clear button), outlined/contained action buttons. No form submit, no Search button.

## Page color themes
- Members: lime green (#d9f99d → #bbf7d0), DataGrid headers #f0fdf4 / #166534
- Gear: amber (#fffbeb), DataGrid headers #92400e
- Trips: purple (#ede9fe → #ddd6fe), DataGrid headers #f5f3ff / #5b21b6
- Admin/Staff: indigo (#e0e7ff → #c7d2fe), DataGrid headers #eef2ff / #3730a3
- Stats: pink/fuchsia hero (#fdf4ff → #fce7f3)
- Guide: lime green hero (same as Members)

## DataGrid sx pattern
border: none, rounded-2xl overflow-hidden border border-gray-200 wrapper div (no bg-gray-300 p-4).
Headers: uppercase, 0.82rem, colored background + 2px colored bottom border.
Rows: hover tint, selected tint, no focus outline on cells/headers.
Footer: borderTop #e5e7eb, bg #fafafa.

## Search
All search bars use useEffect debounce (300ms) calling setSearchParams. Clear (✕) icon button appears when input is non-empty. Label "Results update as you type". No form/submit/enter handler.

## Staff page (public /staff)
StaffGrid uses pos0() helper — `(s.positions?.[0] ?? "").toLowerCase()` — to guard against empty positions arrays. Always use this pattern when accessing positions[0].

## Charting (Stats page)
recharts@3.8.1 installed. Uses BarChart, AreaChart, PieChart (donut), RadarChart, all wrapped in ResponsiveContainer.

## Footer
Global site footer lives in Layout.tsx (SiteFooter component). Shows on every page. Content: GroupMe note + "Marisha Kapinska & Xinghan Yang — April 18, 2026".
