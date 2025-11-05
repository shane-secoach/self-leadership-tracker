# Self-Leadership Tracker - TODO

## Data Model & Schema
- [x] Create Daily Check-in table with all required fields
- [x] Create database schema with proper types and defaults

## Core Features
- [x] Screen 1: Home/Today screen with greeting and conditional rendering
- [x] Screen 2: Daily Check-in form with sliders/steppers and text inputs
- [x] Screen 3: Weekly View/Dashboard with averages and visualizations
- [x] Screen 4: Past Entries screen for review and editing
- [x] Screen 5: Entry Detail page for viewing and editing individual entries

## UI/UX Implementation
- [x] Apply brand colors (Indigo, Mint, Lilac, Teal, Lime)
- [x] Mobile-first responsive layout
- [x] Implement microcopy and helper text throughout
- [x] Add score-based feedback messages (e.g., "Nice. This pillar is working for you today.")

## Business Logic
- [x] Enforce single entry per date per user (via database unique constraint)
- [x] Calculate weekly averages on-the-fly
- [x] Implement pillar scoring and strongest/weakest pillar detection
- [x] Handle date formatting and timezone considerations

## API & Backend
- [x] Create tRPC procedures for daily check-in CRUD operations
- [x] Create tRPC procedure for weekly summary calculations
- [x] Implement user authentication and authorization (via protectedProcedure)

## Testing & Polish
- [ ] Test core user flow (login → log today → view week → edit past entry)
- [ ] Verify mobile responsiveness
- [ ] Test edge cases (missing days in week, first-time user, etc.)

## Deployment
- [ ] Save checkpoint before publishing
- [ ] Prepare project for deployment

## Bugs & Issues
- [ ] OAuth login flow not completing - redirects back to login screen after account selection
  * Issue: After clicking "Shane Evans" on the Manus OAuth portal, the app redirects back to the login screen instead of completing authentication
  * Diagnosis: The OAuth callback is being triggered, but the session cookie isn't being recognized by the frontend
  * Attempted fixes:
    - Added authentication check to Today page with redirect to login if not authenticated
    - Added debug logging to OAuth callback and cookie handling
    - Modified cookie options to use adaptive sameSite based on secure connection
  * Next steps: Check server logs during OAuth callback to see if cookie is being set correctly, verify JWT token creation, test cookie persistence
