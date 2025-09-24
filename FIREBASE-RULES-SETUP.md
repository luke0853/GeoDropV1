# Firebase Rules Setup

## Firestore Rules
- Users can read/write their own data
- Public data is readable by all
- Admin functions require authentication

## Storage Rules
- Users can upload their own images
- Reference images are public
- File size limits enforced

## Security
- HTTPS only
- Authentication required for sensitive operations
- Input validation on all endpoints
