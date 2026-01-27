# FastAPI Backend Development

## Instructions
Build secure, spec-compliant REST APIs.

1. **API Design**
   - All routes under `/api`
   - RESTful resource naming
   - JSON responses only

2. **Security**
   - Verify JWT tokens on every request
   - Extract user identity from token
   - Reject unauthenticated requests

3. **Error Handling**
   - Use HTTPException
   - Clear status codes
   - Predictable error responses

## Constraints
- Do not trust client-provided user IDs
- No frontend concerns
- No raw SQL