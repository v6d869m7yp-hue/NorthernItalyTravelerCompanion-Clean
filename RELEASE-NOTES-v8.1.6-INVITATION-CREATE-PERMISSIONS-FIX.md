# Northern Italy Traveler Companion v8.1.6

## Invitation Create Permissions Fix

- Fixes the owner-side duplicate-invitation check that Firestore rejected before an invitation could be created.
- The check now queries only invitations created by the signed-in owner, then filters the active trip, email, and pending status locally.
- Preserves traveler roles, Vault privacy boundaries, reservation relinking, multi-file uploads, and Safari cache repairs.
- No trip-document edits are required.

After publishing, clear the Companion app cache once and retry **Create invitation**.
