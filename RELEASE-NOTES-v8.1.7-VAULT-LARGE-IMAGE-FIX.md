# Northern Italy Traveler Companion v8.1.7

## Vault large-image and Safari encryption fix

- Fixes Safari `Maximum call stack size exceeded` while encrypting image attachments.
- Replaces unsafe whole-array Base64 conversion with bounded chunk encoding.
- Accepts images up to 25 MB and compresses them on-device before encryption.
- Keeps PDFs and other document types at the existing 5 MB limit.
- Adds clear quota and image-processing error messages instead of the generic Companion failure notice.
- Preserves traveler invitations, role controls, reservation relinking, and encrypted sync.
