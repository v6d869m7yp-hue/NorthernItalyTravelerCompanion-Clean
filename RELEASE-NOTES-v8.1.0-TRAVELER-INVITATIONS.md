# Northern Italy Traveler Companion v8.1.0 — Traveler Invitations & Roles

This release adds working trip invitations to the integrated Companion. Owners can invite by email, assign Editor or Viewer access, revoke pending invitations, change roles, and remove members. Invited travelers sign in using the exact invited email and accept from Travel Vault → Share & sync. Shared trip membership never discloses another traveler’s decrypted private Vault.

## Required Firebase deployment
Deploy the included `companion/firestore.rules` before using invitations. Existing Storage rules already use trip membership for shared document access.
