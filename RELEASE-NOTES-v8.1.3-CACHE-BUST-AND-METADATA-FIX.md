# Northern Italy Traveler Companion v8.1.4

## Cache Bust & Metadata Fix

- Updates all Companion page asset query strings to v10.1.4.
- Aligns runtime, build-info, service-worker, cache, and release marker metadata.
- Fixes the Diagnostics 4/5 state caused by fresh build-info loading beside an older cached app.js runtime.
- Preserves traveler invitations, roles, legacy-trip membership bootstrap, private Vault relinking, multi-file uploads, and Safari recovery handling.

After deployment, use Diagnostics → Clear app cache and reload once.
