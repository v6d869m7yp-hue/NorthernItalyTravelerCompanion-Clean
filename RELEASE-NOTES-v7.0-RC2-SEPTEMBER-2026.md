# Northern Italy Traveler Companion v7.0 RC2

## Navigation-state repair

- Fixed the publication menu remaining visible after Safari/iPadOS page restoration.
- The Menu button ARIA state is now authoritative for drawer visibility.
- The drawer is forcibly closed on page show, page hide, orientation changes, and hidden-page transitions.
- Menu state, label, body scroll lock, focus, and `aria-hidden` now remain synchronized.
- External navigation and back/forward history no longer leave the menu layered over page content.

RC2 is a targeted correction to RC1; itinerary and guide content are unchanged.
