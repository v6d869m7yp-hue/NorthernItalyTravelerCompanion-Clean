# Northern Italy Traveler Companion v7.0 RC3

## Navigation isolation repair

- Replaced the generic `.nav` component with the isolated `.publication-nav` component.
- Removed all dependency on legacy navigation selectors from earlier builds.
- Closed state is now the CSS default and requires the explicit `is-open` class to display.
- Updated the service worker to fetch critical UI assets network-first with `no-store`.
- Advanced cache and visible version references to RC3.
