---
name: Project Overview
description: Excursion Club staff frontend — stack, routing, auth, providers, key files
type: project
---

React 18 + TypeScript + Vite. Styling: Tailwind CSS + MUI v5. State: React Context + TanStack React Query. Router: React Router v6. Auth: Google OAuth → JWT in cookies.

**Why:** Staff management tool for UCSB Excursion Club. Handles member sign-ups/renewals, gear checkout/checkin, trips, stats, and a staff guide.

**Key routes (staff/admin only):** /members, /gear, /trips, /stats, /guide, /editstaff. /links redirects to /guide.

**Provider nesting (App.tsx):** ReservationsProvider > StaffProvider > MembersProvider > GearProvider wrapping all routes.

**Backend:** https://excursion-backend-three.vercel.app (prod), localhost:9000 (dev). All API calls in src/utils/api.ts.

**How to apply:** Authors listed in global footer (Layout.tsx) and update-log/. Footer shows on every page via Layout.tsx.

**update-log/ folder** exists at repo root — add a dated .md file after significant sessions.
