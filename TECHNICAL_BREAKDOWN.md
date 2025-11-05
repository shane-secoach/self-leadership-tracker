# Self-Leadership Tracker - Technical Breakdown

## Architecture Overview

The Self-Leadership Tracker is a full-stack web application built with a modern JavaScript/TypeScript stack. It follows a client-server architecture with a React frontend and Express backend, connected via tRPC for type-safe API communication.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                      │
│  - Vite (dev server & build tool)                           │
│  - Tailwind CSS 4 (styling)                                 │
│  - Wouter (routing)                                         │
│  - tRPC Client (API calls)                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     │ /api/trpc/* (tRPC endpoints)
                     │ /api/oauth/callback (OAuth)
┌────────────────────▼────────────────────────────────────────┐
│                  Backend (Express 4)                         │
│  - Node.js runtime                                          │
│  - tRPC Server (type-safe RPC procedures)                   │
│  - OAuth integration (Manus)                                │
│  - Session management (JWT cookies)                         │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL queries
                     │ Drizzle ORM
┌────────────────────▼────────────────────────────────────────┐
│                   Database (MySQL)                           │
│  - users table (authentication)                             │
│  - dailyCheckIns table (check-in data)                      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server (fast HMR)
- **Tailwind CSS 4** - Utility-first CSS framework
- **Wouter** - Lightweight client-side router
- **tRPC Client** - Type-safe API client
- **shadcn/ui** - Pre-built UI components (Button, Card, Dialog, etc.)
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **tRPC 11** - Type-safe RPC framework
- **Drizzle ORM** - SQL ORM with TypeScript support
- **MySQL2** - MySQL database driver
- **jose** - JWT token signing/verification
- **tsx** - TypeScript execution for development

### Database
- **MySQL** (or compatible: TiDB, MariaDB)
- **Drizzle Kit** - Schema migrations and type generation

### Authentication
- **Manus OAuth** - Third-party authentication service
- **JWT Cookies** - Session tokens stored in HTTP-only cookies

## File Structure

```
self-leadership-tracker/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── _core/                   # Core utilities
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts       # Authentication hook
│   │   │   └── ...
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx  # (not used in this app)
│   │   │   └── ErrorBoundary.tsx    # Error handling
│   │   ├── contexts/                # React contexts
│   │   │   └── ThemeContext.tsx     # Light/dark theme
│   │   ├── pages/                   # Page components
│   │   │   ├── Today.tsx            # Home/Today screen
│   │   │   ├── CheckInForm.tsx      # Daily check-in form
│   │   │   ├── WeeklyView.tsx       # Weekly dashboard
│   │   │   ├── PastEntries.tsx      # Past entries browser
│   │   │   ├── EntryDetail.tsx      # Entry detail/edit
│   │   │   ├── NotFound.tsx         # 404 page
│   │   │   └── Home.tsx             # (replaced by Today.tsx)
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC client setup
│   │   ├── const.ts                 # Constants (login URL, app title)
│   │   ├── App.tsx                  # Main app component & routing
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles & theme
│   ├── index.html                   # HTML template
│   ├── vite.config.ts               # Vite configuration
│   └── tsconfig.json                # TypeScript config
│
├── server/                          # Backend (Express + tRPC)
│   ├── _core/                       # Core server infrastructure
│   │   ├── index.ts                 # Express app setup
│   │   ├── context.ts               # tRPC context (auth)
│   │   ├── trpc.ts                  # tRPC router setup
│   │   ├── oauth.ts                 # OAuth callback handler
│   │   ├── sdk.ts                   # Manus SDK integration
│   │   ├── cookies.ts               # Cookie configuration
│   │   ├── env.ts                   # Environment variables
│   │   ├── llm.ts                   # LLM integration (unused)
│   │   ├── notification.ts          # Notifications (unused)
│   │   ├── vite.ts                  # Vite dev server setup
│   │   └── ...
│   ├── db.ts                        # Database query helpers
│   ├── routers.ts                   # tRPC procedure definitions
│   └── storage.ts                   # S3 file storage (unused)
│
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                    # Table definitions
│   ├── migrations/                  # Migration files
│   └── drizzle.config.ts            # Drizzle configuration
│
├── shared/                          # Shared code
│   ├── const.ts                     # Shared constants
│   └── types.ts                     # Shared types
│
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind configuration
└── TECHNICAL_BREAKDOWN.md           # This file
```

## Database Schema

### users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,      -- Manus OAuth ID
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### dailyCheckIns Table
```sql
CREATE TABLE dailyCheckIns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,                    -- Foreign key to users
  checkInDate DATE NOT NULL,              -- Date of check-in (unique per user)
  moodScore INT NOT NULL,                 -- 1-10
  energyScore INT NOT NULL,               -- 1-10
  stressScore INT NOT NULL,               -- 1-10
  pillarSelfAwareness INT NOT NULL,       -- 1-5
  pillarMindset INT NOT NULL,             -- 1-5
  pillarAction INT NOT NULL,              -- 1-5
  pillarImpact INT NOT NULL,              -- 1-5
  keyWin TEXT,                            -- Short text field
  biggestChallenge TEXT,                  -- Short text field
  penMoment TEXT,                         -- Short text field
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_date (userId, checkInDate),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints (tRPC)

All API calls are made via tRPC to `/api/trpc/*`. The procedures are type-safe and automatically generate TypeScript types.

### Authentication Procedures
- `trpc.auth.me.useQuery()` - Get current user (public)
- `trpc.auth.logout.useMutation()` - Logout (public)

### Check-in Procedures
- `trpc.checkIn.today.useQuery()` - Get today's check-in (protected)
- `trpc.checkIn.save.useMutation()` - Save/update check-in (protected)
- `trpc.checkIn.getByDate.useQuery(date)` - Get check-in for specific date (protected)
- `trpc.checkIn.getWeek.useQuery(startDate)` - Get week's check-ins (protected)
- `trpc.checkIn.getMonth.useQuery(year, month)` - Get month's check-ins (protected)

### System Procedures
- `trpc.system.notifyOwner.useMutation()` - Send notification to app owner (protected)

## Authentication Flow

### OAuth Login Flow
1. User clicks "Log today" button
2. Frontend generates login URL with:
   - App ID (from env)
   - Redirect URI: `{origin}/api/oauth/callback`
   - State: base64-encoded redirect URI
3. User is redirected to Manus OAuth portal (`https://manus.im/app-auth`)
4. User selects account and authenticates
5. Manus redirects back to `/api/oauth/callback` with `code` and `state`
6. Backend exchanges code for access token via Manus SDK
7. Backend fetches user info using access token
8. Backend creates JWT session token and sets HTTP-only cookie
9. Backend redirects to `/` (home page)
10. Frontend checks auth status and displays app

### Session Management
- **Session Token**: JWT signed with `JWT_SECRET` env variable
- **Storage**: HTTP-only cookie named `__session` (from `COOKIE_NAME` const)
- **Expiration**: 1 year (configurable)
- **Validation**: Every tRPC request validates the session cookie

## Environment Variables

### Required for Development/Deployment
```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-for-signing-jwt-tokens
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# App Configuration
VITE_APP_TITLE=Self-Leadership Tracker
VITE_APP_LOGO=https://your-logo-url.png

# Owner Info
OWNER_NAME=Shane Evans
OWNER_OPEN_ID=your-owner-open-id

# Built-in Manus APIs (for future features)
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Build & Deployment

### Development
```bash
# Install dependencies
npm install
# or
pnpm install

# Start dev server (runs on http://localhost:3000)
npm run dev
# or
pnpm dev
```

### Production Build
```bash
# Build frontend and backend
npm run build
# or
pnpm build

# Output:
# - client/dist/ - Frontend static files (React + Vite)
# - server compiled TypeScript ready to run
```

### Running in Production
```bash
# Set environment variables
export DATABASE_URL=...
export JWT_SECRET=...
# ... (set all required env vars)

# Run the server
npm start
# or
node dist/server/_core/index.js
```

### Deployment Options

#### Option 1: Traditional VPS/Server
1. Clone the repository
2. Install Node.js (v18+)
3. Install MySQL database
4. Set environment variables
5. Run `npm install && npm run build`
6. Start with `npm start`
7. Use PM2 or systemd to keep process running
8. Use Nginx/Apache as reverse proxy
9. Set up SSL with Let's Encrypt

#### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option 3: Vercel/Netlify (Frontend Only)
- Deploy frontend to Vercel/Netlify
- Deploy backend separately to Heroku/Railway/Render
- Update API endpoints in frontend

#### Option 4: AWS/Google Cloud/Azure
- Use managed Node.js services (App Engine, Elastic Beanstalk, App Service)
- Use managed MySQL (RDS, Cloud SQL, Azure Database)
- Use CDN for static assets

## Key Features Implementation

### Daily Check-in Form
- **Location**: `client/src/pages/CheckInForm.tsx`
- **Sliders**: HTML5 range inputs for mood (1-10), energy (1-10), stress (1-10)
- **Pillar Scores**: 1-5 sliders for each of the four pillars
- **Text Fields**: Three text areas for key win, challenge, and pen moment
- **Submission**: Calls `trpc.checkIn.save.useMutation()` to save to database
- **Validation**: Prevents duplicate entries for same date (database constraint)

### Weekly Dashboard
- **Location**: `client/src/pages/WeeklyView.tsx`
- **Calculations**: On-the-fly averages calculated from database rows
- **Pillar Insights**: Shows strongest and weakest pillar
- **Visualization**: Simple card-based layout with color coding
- **Data Fetching**: Calls `trpc.checkIn.getWeek.useQuery()` to fetch week's data

### Past Entries Browser
- **Location**: `client/src/pages/PastEntries.tsx`
- **Month Navigation**: Calendar picker to select month/year
- **Week Grouping**: Entries grouped by week for easy scanning
- **Quick Stats**: Shows average scores for each week
- **Entry Links**: Click to view/edit individual entries

### Entry Detail/Edit
- **Location**: `client/src/pages/EntryDetail.tsx`
- **View Mode**: Displays entry data in read-only format
- **Edit Mode**: Allows modification of all fields
- **Update**: Calls `trpc.checkIn.save.useMutation()` to update database
- **Delete**: Option to delete entry (with confirmation)

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Vite automatically splits code by route
- **Lazy Loading**: Pages loaded on-demand via Wouter routing
- **CSS**: Tailwind purges unused styles in production
- **Images**: Use optimized formats (WebP where possible)

### Backend Optimization
- **Database Queries**: Indexed on `userId` and `checkInDate` for fast lookups
- **Caching**: tRPC automatically caches query results
- **Connection Pooling**: MySQL2 uses connection pooling by default
- **Compression**: Express gzip middleware compresses responses

### Database Optimization
- **Unique Constraint**: Prevents duplicate entries for same user/date
- **Foreign Key**: Ensures data integrity
- **Indexes**: Automatic indexes on primary/unique keys

## Security Considerations

### Authentication
- **OAuth**: Delegates authentication to Manus (industry standard)
- **JWT Tokens**: Signed with secret key, prevents tampering
- **HTTP-only Cookies**: Prevents XSS attacks from accessing tokens
- **CSRF Protection**: Same-site cookie policy prevents CSRF

### Data Protection
- **User Isolation**: Each user can only see their own data (enforced in procedures)
- **Protected Procedures**: All data endpoints require authentication
- **SQL Injection**: Drizzle ORM uses parameterized queries
- **HTTPS**: Enforced in production (secure cookies)

### Environment Variables
- **Secrets**: Never commit `.env` files
- **API Keys**: Stored server-side only
- **Database URL**: Contains password, keep secure

## Scaling Considerations

### Horizontal Scaling
- **Stateless Backend**: No session state stored in memory
- **Load Balancer**: Can run multiple backend instances
- **Shared Database**: All instances connect to same MySQL
- **Session Cookies**: Work across all instances (JWT-based)

### Vertical Scaling
- **Database Optimization**: Add indexes, optimize queries
- **Caching Layer**: Add Redis for query caching
- **CDN**: Serve static assets from CDN
- **Database Replication**: Master-slave setup for read scaling

### Future Enhancements
- **Real-time Updates**: Add Socket.io for live data sync
- **Data Export**: CSV/PDF export of check-in history
- **Analytics Dashboard**: Trends and insights over time
- **Mobile App**: React Native or Flutter version
- **Notifications**: Email/SMS reminders for daily check-ins
- **Team Features**: Share insights with coaches/mentors
- **AI Coaching**: LLM integration for personalized feedback

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format: `mysql://user:pass@host:port/db`
- Check MySQL server is running
- Verify firewall allows connection
- Check user permissions

### OAuth Not Working
- Verify `VITE_APP_ID` is correct
- Check redirect URI matches in Manus dashboard
- Verify `OAUTH_SERVER_URL` is correct
- Check `JWT_SECRET` is set

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check Node.js version: `node --version` (should be v18+)

## Support & Resources

- **Drizzle ORM Docs**: https://orm.drizzle.team/
- **tRPC Docs**: https://trpc.io/
- **React Docs**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Express Docs**: https://expressjs.com/
