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
- [ ] Test Daily Check-in form submission and data persistence
- [ ] Verify Weekly Dashboard calculations are accurate
- [ ] Test Past Entries browsing and filtering
- [ ] Test Entry Detail editing functionality

## Deployment
- [x] Save checkpoint before publishing
- [x] Publish the app
- [ ] Gather user feedback and iterate

## Bugs & Issues
- [x] OAuth login flow - RESOLVED (app needed to be published first)
