# Northern Italy Traveler Companion v8.1.4

## Invitation Query Fix

- Fixes the Share & sync permission error for correctly configured trip owners.
- Adds the authenticated inviter UID to the owner invitation-history query so Firestore can prove that every returned invitation belongs to the signed-in owner.
- Retains v8.1.x traveler invitations, roles, legacy-trip migration, cache repair, and privacy protections.
- No reservation, document, or encrypted Vault data is modified.
