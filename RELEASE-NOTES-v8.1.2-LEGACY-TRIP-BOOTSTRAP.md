# Northern Italy Traveler Companion v8.1.2

## Legacy Trip Bootstrap

- Allows an existing trip owner to read an older trip document that predates memberUids and roles.
- Performs a one-time safe migration adding the owner to memberUids with the owner role.
- Restores the Traveler Invitations panel for upgraded trips.
- Preserves reservations, documents, Vault data, and existing trip IDs.
- Updates Companion metadata and cache identity to v10.1.2.

Deploy `companion/firestore.rules` after publishing the website files.
