# SQLModel ORM Design

## Instructions
Define database models aligned with specs.

1. **Model Design**
   - Use SQLModel for all tables
   - Define relationships clearly
   - Keep models minimal and clean

2. **Data Integrity**
   - Enforce user ownership via user_id
   - Use appropriate field constraints
   - Support future schema evolution

3. **Alignment**
   - Match API request/response models
   - Reflect `/specs/database/schema.md`

## Constraints
- No business logic
- No migrations without spec updates
- No raw SQL unless specified