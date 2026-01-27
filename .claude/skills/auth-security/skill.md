# Authentication & Security

## Instructions
Enforce secure identity and access control.

1. **Frontend Auth**
   - Configure Better Auth
   - Enable JWT issuance
   - Define token expiry

2. **Backend Verification**
   - Validate JWT signature
   - Decode user identity
   - Match token user with request context

3. **Security Rules**
   - All APIs require JWT
   - Unauthorized requests return 401
   - Enforce strict user isolation

## Constraints
- No custom auth systems
- No insecure fallbacks
- No shared sessions