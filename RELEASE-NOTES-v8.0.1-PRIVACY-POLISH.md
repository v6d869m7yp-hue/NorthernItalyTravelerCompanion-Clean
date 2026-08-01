# Northern Italy Traveler’s Companion v8.0.1 — Privacy Polish

## Purpose
Maintenance and privacy-hardening release following the v8.0.0 Companion integration.

## Changes
- Replaced the legacy static reservation dossier with a gateway to authenticated Companion reservations.
- Removed known booking codes, confirmation numbers, and a private host phone number from deployable guide files.
- Preserved useful itinerary, property, route, and emergency information without exposing booking credentials.
- Updated visible Northern Italy page footers and cache-busting references to v8.0.1 where older v7 labels remained.
- Added a privacy audit report and deployment checklist.

## Important
Firebase configuration values in a browser application are identifiers, not passwords. Protection depends on properly deployed Firestore and Storage rules. Review `PRIVACY-AUDIT-v8.0.1.md` before making the repository public.
