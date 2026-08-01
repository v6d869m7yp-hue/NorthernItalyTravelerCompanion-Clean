# Northern Italy Traveler’s Companion v8.0.0

## Companion integration release

- Integrates the complete Istanbul–Viking Travel Companion v10.0.0 inside `companion/`.
- Adds a Northern Italy Companion hub with direct access to Daily Briefing, Traveler Assistant, Timeline, Reservations, Trip Binder, Documents, Trip Map and Journal.
- Replaces external cross-repository journey links with dependable local handoffs.
- Adds Companion to the Northern Italy menu, breadcrumbs, home dashboard and floating journey switcher.
- Updates the Companion’s Venice handoff to return directly to the local Northern Italy Venice chapter.
- Preserves all Northern Italy v7.1.0 content, itinerary, maps, reservations, optional destinations and visual design.
- Updates the root offline cache for the Companion hub and essential Companion pages.

## Deployment

Deploy the contents of this folder as a single site. Do not deploy only the `companion/` folder. Both applications retain their own service workers and local-storage namespaces.
