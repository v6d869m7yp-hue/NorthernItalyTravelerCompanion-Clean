# Privacy Audit — v8.0.1

## Finding corrected
The v8.0.0 package contained a second, legacy Northern Italy reservation system. Its static HTML included booking and confirmation identifiers and a direct host telephone number. Repository visibility or login status would not protect values embedded in static HTML.

## Current design
- `reservations.html` contains no booking dossier and directs travelers to `companion/reservations.html`.
- Companion reservation records are intended to load after Firebase authentication.
- Highly sensitive identity and financial records should remain in the encrypted Vault, not ordinary repository files or shared document metadata.

## Before making the repository public
1. Deploy and verify `companion/firestore.rules` and `companion/storage.rules` in the correct Firebase project.
2. Confirm an unauthenticated browser cannot read trip, reservation, document, journal, or vault records.
3. Search the full Git history, not only the current files, for old confirmation numbers. A public repository exposes prior commits too.
4. If sensitive values were ever committed, create a fresh public repository from this clean package or rewrite the old Git history before publishing.
5. Give each collaborator an individual account; do not share one login.
