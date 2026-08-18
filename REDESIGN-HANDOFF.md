# Aweh Ekse! — Complete Feature & Architecture Document

## App Overview

**Aweh Ekse!** is an offline-first Progressive Web App (PWA) built for **Aweh Ekse!**, a Zimbabwe-based organisation promoting the **"Aweh Ekse! — An Addictive Substances & Conditioning Contents"** campaign. The app targets youth in Zimbabwe and similar low-connectivity environments, providing substance abuse education, mental health tools, and community campaign features — all fully functional without an internet connection.

**Key constraint**: All data is stored locally in the browser (IndexedDB via Dexie.js). No user profile data is synced to a remote server. Privacy is paramount.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 (with Rolldown) |
| Styling | Tailwind CSS v4 (CSS-first config, no JS config file) |
| Database | Dexie.js 4 (IndexedDB wrapper) |
| Routing | React Router v7 |
| PWA | vite-plugin-pwa + Workbox |
| PDF Export | jsPDF |
| State | React Context (no Redux/Zustand) |
| Code Splitting | React.lazy() per route (60+ chunks) |

---

## Project Structure

```
tov-native/
├── public/                    # Static assets (icons, favicon)
├── src/
│   ├── components/
│   │   ├── layout/            # AppShell, Header, BottomNav, OfflineBanner
│   │   ├── ui/                # Button, Card, Modal, Toast, Badge, Skeleton, SearchBar, EmptyState
│   │   └── ErrorBoundary.jsx
│   ├── context/               # OfflineContext, ProfileContext, ThemeContext, SyncContext
│   ├── core/
│   │   ├── auth/              # profileManager.js, pinLock.js
│   │   ├── cache/             # contentPack.js
│   │   ├── db/                # schema.js (Dexie tables)
│   │   ├── hooks/             # useDownload, useEncryption, useExport, useAchievement, useGPS
│   │   ├── seed/              # contentSeeder.js (first-run data population)
│   │   ├── sync/              # queue.js, status.js
│   │   └── utils/             # dates.js, validators.js, storage.js
│   ├── data/                  # JSON content files (content-pillars, assessments, facilities, etc.)
│   ├── pages/                 # 60+ page components across 12 feature sections
│   ├── App.jsx                # Router with all routes
│   ├── main.jsx               # Entry point + SW registration + content seeding
│   └── index.css              # Tailwind v4 theme (custom colors, fonts)
├── start.bat                  # Double-click to launch the app
├── vite.config.js             # Vite + Tailwind + PWA config
└── package.json
```

---

## Navigation Structure

### Header (fixed top)
- App logo ("AE" green circle) with "Aweh Ekse!" text
- Active profile avatar button → navigates to `/profile/select`

### Bottom Navigation (5 tabs, fixed bottom)
| Tab | Icon | Route |
|-----|------|-------|
| Home | House SVG | `/` |
| Learn | Book SVG | `/hub` |
| Track | Smiley SVG | `/mood` |
| Help | Phone SVG | `/help` |
| More | Menu SVG | `/more` |

### Offline Banner
- Amber banner at top of screen when device is offline
- Auto-hides when connection is restored

---

## Complete Feature Breakdown

### 1. Home Dashboard (`/`)
**File**: `src/pages/Home.jsx`

- Personalised greeting with profile name
- Quick-access grid of 8 feature cards:
  - Information Hub, Risk Check, Get Help, Safety Plan
  - Daily Check-in, Games, Campaign Hub, Lesson Plans
- Aweh Ekse! campaign promotional banner
- Each card navigates to its respective section

---

### 2. Profile Management

#### Profile Select (`/profile/select`)
**File**: `src/pages/Profile/ProfileSelect.jsx`

- Full-screen profile picker
- Shows all saved profiles as circular avatar initials
- "Add new profile" dashed-border button
- Tapping a profile sets it as active

#### Profile Create (`/profile/create`)
**File**: `src/pages/Profile/ProfileCreate.jsx`

- Registration form with fields:
  - Name, Surname, Date of Birth, Gender
  - Province (Zimbabwe dropdown), Area/Town
  - Tribe (optional), Language (optional)
  - PIN (optional, for profile lock)
- Saves to Dexie `profiles` table

---

### 3. Information Hub (`/hub`)

#### Hub Home (`/hub`)
**File**: `src/pages/InformationHub/HubHome.jsx`

- 6 category cards:
  - Substance Abuse (`💊`), Mental Health (`🧠`)
  - How They Connect (`🔗`), Zimbabwe Context (`🇿🇼`)
  - Practical Guides (`📝`), Substance Library (`📖`)
- Search link → `/hub/search`
- Bookmarks link → `/hub/bookmarks`

#### Category View (`/hub/category/:category`)
**File**: `src/pages/InformationHub/CategoryView.jsx`

- Lists articles filtered by category
- Merges bundled JSON content with user-saved DB content
- Each article is a tappable card

#### Article Page (`/hub/article/:id`)
**File**: `src/pages/InformationHub/ArticlePage.jsx`

- Full article view with sections:
  - Title, category badge, reading time
  - Overview text
  - Health effects (tag chips)
  - Myths vs Facts (toggleable cards)
  - Zimbabwe Context section
  - Strategies for prevention
  - Body content (HTML rendered)
  - Sources/references
- Bookmark toggle (saves to Dexie)

#### Search Results (`/hub/search`)
**File**: `src/pages/InformationHub/SearchResults.jsx`

- Full-text search input
- Results list from bundled content + DB content
- Searches name, description, category fields

#### Bookmarks (`/hub/bookmarks`)
**File**: `src/pages/InformationHub/Bookmarks.jsx`

- Lists all bookmarked articles from Dexie `content` table

#### Substance Library (`/hub/substances`)
**File**: `src/pages/InformationHub/SubstanceLibrary.jsx`

- Accordion-style encyclopedia of substances
- Each entry includes:
  - Zimbabwe local name (e.g., "mbanje" for cannabis, "guka" for meth)
  - Health effects, common myths vs facts
  - Zimbabwe-specific context
- SearchBar integration for filtering
- Data from `content-pillars.json` (10 substances/entries)

---

### 4. Risk Checker (`/check`)

#### Checker Home (`/check`)
**File**: `src/pages/RiskChecker/CheckerHome.jsx`

- 4 assessment types:
  - **Substance Risk** (`bg-tov-blue`) — screens for substance use patterns
  - **Mental Health** (`bg-tov-purple`) — depression/anxiety screening
  - **Peer Pressure** (`bg-tov-green`) — peer influence vulnerability
  - **Stress/Wellbeing** (`bg-tov-orange`) — overall wellbeing check
- Recent assessment history preview (last 3)

#### Question Flow (`/check/take/:type`)
**File**: `src/pages/RiskChecker/QuestionFlow.jsx`

- Multi-question assessment (4-5 questions per type)
- Progress bar showing completion
- Multiple choice options (4-5 per question)
- Auto-advance on selection
- Saves results to Dexie `assessments` table with timestamp

#### Results Page (`/check/results/:id`)
**File**: `src/pages/RiskChecker/ResultsPage.jsx`

- Risk score interpretation:
  - Low (green) — "Keep building healthy habits"
  - Moderate (amber) — "Consider talking to someone"
  - High (red) — "Please reach out to a professional"
- Review of all answers
- Action links: Safety Plan, Get Help, Take Another Assessment

#### History (`/check/history`)
**File**: `src/pages/RiskChecker/History.jsx`

- List of all past assessments
- Shows date, type, and risk level for each

---

### 5. Contact Directory (`/help`)

#### Directory Home (`/help`)
**File**: `src/pages/ContactDirectory/DirectoryHome.jsx`

- 3 directory categories:
  - Hotlines (`bg-tov-red`)
  - Rehab Centres (`bg-tov-orange`)
  - Nearby Facilities (`bg-tov-green`)
- Emergency card with 995 (ambulance) and 999 (police)

#### Hotlines (`/help/hotlines`)
**File**: `src/pages/ContactDirectory/Hotlines.jsx`

- 8 Zimbabwe crisis hotlines with:
  - Organisation name, description
  - Call button (tel: link)
  - WhatsApp button (wa.me link)

#### Rehab Directory (`/help/rehab`)
**File**: `src/pages/ContactDirectory/RehabDirectory.jsx`

- 6 rehab centres with:
  - Name, location, description
  - Cost badge (Free/Affordable/Paid)
  - Call + WhatsApp buttons

#### Facility Page (`/help/facility/:id`)
**File**: `src/pages/ContactDirectory/FacilityPage.jsx`

- Single facility detail:
  - Full address, phone number
  - Services offered (tag chips)
  - "Get Directions" button (opens Google Maps)
  - "Call Now" button
- Data loaded from `facilities.json`

#### Emergency Routing (`/help/nearby`)
**File**: `src/pages/ContactDirectory/EmergencyRouting.jsx`

- Geolocation-based nearest facility finder
- Google Maps directions links
- Sorted by distance

---

### 6. Lesson Plans (`/lessons`)

#### Plan Library (`/lessons`)
**File**: `src/pages/LessonPlans/PlanLibrary.jsx`

- 6 lesson plans with pillar filter chips:
  - Knowledge, Life Skills, Wellbeing, Habits, Community
- Each plan card shows: title, duration, pillar badge
- Educator Dashboard link

#### Plan Viewer (`/lessons/:id`)
**File**: `src/pages/LessonPlans/PlanViewer.jsx`

- Full lesson plan view:
  - Objectives, materials list
  - Timed activities with step-by-step instructions
  - Assessment questions
- 2 complete lesson plans included in data

#### Educator Dashboard (`/lessons/dashboard`)
**File**: `src/pages/LessonPlans/EducatorDashboard.jsx`

- Stats grid:
  - Campaigns created, Events held
  - Students reached, Lesson plans completed
- Quick action links

#### Facilitation Guide (`/lessons/facilitation`)
**File**: `src/pages/LessonPlans/FacilitationGuide.jsx`

- 5 tips for facilitators:
  1. Create a safe space
  2. Use local examples
  3. Be trauma-informed
  4. Make it interactive
  5. End with hope

#### Post-Lesson Reflection (`/lessons/reflect`)
**File**: `src/pages/LessonPlans/PostLessonReflection.jsx`

- 5-star rating system
- Freeform text reflection
- Saves to Dexie `journal` table

---

### 7. Safety Plan (`/safety-plan`)

#### Safety Plan Home (`/safety-plan`)
**File**: `src/pages/SafetyPlan/SafetyPlanHome.jsx`

- Hero card with CTA to create or view plan
- Lists 5 plan sections with icons:
  - Warning Signs, Coping Strategies, People & Social Settings
  - People I Can Ask For Help, Professional Contacts
  - Making My Space Safer

#### Plan Builder (`/safety-plan/build`)
**File**: `src/pages/SafetyPlan/PlanBuilder.jsx`

- 6-step wizard with progress bar:
  1. Warning signs (what triggers me)
  2. Coping strategies (what helps)
  3. Social settings (people/places to avoid)
  4. Emergency contacts (people I can call)
  5. Professional contacts (therapist, doctor)
  6. Environment (making my space safer)
- Saves to Dexie `safetyPlan` table

#### Plan View (`/safety-plan/view`)
**File**: `src/pages/SafetyPlan/PlanView.jsx`

- Renders all saved plan sections
- Emergency "Call 995" button
- Edit link to modify plan

#### SOS Config (`/safety-plan/sos`)
**File**: `src/pages/SafetyPlan/SOSConfig.jsx`

- SOS emergency contacts form
- Add 1-5 contacts with name + phone number
- Saves to Dexie `safetyPlan` table

---

### 8. Mood Tracker (`/mood`)

#### Daily Check-in (`/mood`)
**File**: `src/pages/MoodTracker/DailyCheckin.jsx`

- 5-mood selector (emoji grid):
  - 😊 Great, 🙂 Good, 😐 Okay, 😟 Bad, 😢 Terrible
- 5 habit toggles:
  - 😴 Slept well, 🏃 Exercised, 🚫 Substance-free
  - 👥 Social connection, 💊 Took medication
- Saves to Dexie `moodMatrix` table with date

#### Heatmap (`/mood/heatmap`)
**File**: `src/pages/MoodTracker/Heatmap.jsx`

- 30-day grid heatmap with emoji colors
- Each day shows mood emoji
- Mood summary bar chart

#### Insights (`/mood/insights`)
**File**: `src/pages/MoodTracker/Insights.jsx`

- Average mood stat
- Total check-ins count
- Pattern detection:
  - Worst day, best day
  - Substance-free days streak
  - Most common mood

#### Journal Entry (`/mood/journal`)
**File**: `src/pages/MoodTracker/JournalEntry.jsx`

- 5 journal prompts + freeform textarea
- Encrypt-on-device notice
- Saves to Dexie `journal` table

---

### 9. Honesty Zone / Polls (`/polls`)

#### Poll Home (`/polls`)
**File**: `src/pages/Polls/PollHome.jsx`

- 4 action cards:
  - Take a Poll, Habit Ledger
  - Community Results, Create a Poll
- Privacy notice (anonymous participation)

#### Poll Participate (`/polls/participate`)
**File**: `src/pages/Polls/PollParticipate.jsx`

- 4 sample polls with progress bar
- Auto-advance on answer
- Honesty points earned

#### Poll Results (`/polls/results`)
**File**: `src/pages/Polls/PollResults.jsx`

- 4 aggregated poll results with bar charts
- Anonymous notice

#### Poll Builder (`/polls/create`)
**File**: `src/pages/Polls/PollBuilder.jsx`

- Question input + 2-6 options
- Character counter
- Anonymous notice

#### Habit Ledger (`/polls/ledger`)
**File**: `src/pages/Polls/HabitLedger.jsx`

- Weekly substance tracking table
- 5 substances × 7 days grid
- Toggle cells (used/didn't use)

---

### 10. Campaign Hub (`/campaign`)

#### Campaign Home (`/campaign`)
**File**: `src/pages/Campaign/CampaignHome.jsx`

- Featured "Aweh Ekse!" hero card
- Active campaigns list
- 5 tool links

#### Campaign Builder (`/campaign/build`)
**File**: `src/pages/Campaign/CampaignBuilder.jsx`

- Form fields:
  - Campaign name
  - Theme chips (8 options)
  - Duration dropdown
  - Description textarea

#### Campaign Calendar (`/campaign/calendar`)
**File**: `src/pages/Campaign/CampaignCalendar.jsx`

- Monthly calendar grid with event dots
- Upcoming events list

#### Campaign Materials (`/campaign/materials`)
**File**: `src/pages/Campaign/CampaignMaterials.jsx`

- 8 downloadable materials (PDF/ZIP/MP4)
- Category filter chips
- Save Offline toggle

#### Attendance Tracker (`/campaign/attendance`)
**File**: `src/pages/Campaign/AttendanceTracker.jsx`

- Event name + location
- +/-5 counter for attendance count

#### Campaign Report (`/campaign/report`)
**File**: `src/pages/Campaign/CampaignReport.jsx`

- Stats grid:
  - Events held, People reached
- Report format selector
- jsPDF export functionality

#### Aweh Ekse! Hub (`/campaign/aweh-ekse`)
**File**: `src/pages/Campaign/AwehEkseHub.jsx`

- Flagship campaign hub
- 10-week theme matrix (accordion):
  - Week 1: Know the Facts
  - Week 2: Peer Pressure
  - Week 3: Mental Health Matters
  - Week 4: Say No with Confidence
  - Week 5: Healthy Coping
  - Week 6: Community Support
  - Week 7: Recovery is Possible
  - Week 8: Digital Wellness
  - Week 9: Life Skills
  - Week 10: Celebration & Commitment
- 5 podcast episodes with descriptions

---

### 11. Research Portal (`/research`)

#### Research Home (`/research`)
**File**: `src/pages/Research/ResearchPortal.jsx`

- Stats (surveys completed, referrals made)
- 4 research tool links
- Privacy notice

#### Survey Builder (`/research/survey-builder`)
**File**: `src/pages/Research/SurveyBuilder.jsx`

- Title input
- Dynamic questions (add/remove):
  - Yes/No, Scale (1-5), Multiple choice, Free text

#### Survey Taker (`/research/take-survey`)
**File**: `src/pages/Research/SurveyTaker.jsx`

- 2 sample surveys
- Question-by-question flow with progress bar

#### School Dashboard (`/research/school`)
**File**: `src/pages/Research/SchoolDashboard.jsx`

- Province grid selector (all 10 Zimbabwe provinces)
- School data cards:
  - Students enrolled, Surveys completed, Wellbeing score

#### Data Export (`/research/export`)
**File**: `src/pages/Research/DataExport.jsx`

- 4 export types:
  - Mood Trends, Survey Results
  - Campaign Impact, Habit Patterns
- jsPDF export functionality

---

### 12. Games (`/games`)

Three mobile-friendly games, each with 3 modes: Solo, Multiplayer, Paper.

#### Games Home (`/games`)
**File**: `src/pages/Games/GamesHome.jsx`

- 3 game hero cards with gradient backgrounds:
  - Chokwadi Kana Nhema (Truth or Lie)
  - Kuenzanisa Upenyu (Compare Lives)
  - Bata Chiratidzo (Tap the Symbol)
- Sync Code Lobby link

#### Sync Code Lobby (`/games/sync`)
**File**: `src/pages/Games/SyncCodeLobby.jsx`

- Create room (generates 6-character code)
- Join room (enter code)

---

##### Game 1: Chokwadi Kana Nhema (CKN) — Truth or Lie
**Files**: `CKNHome.jsx`, `CKNSolo.jsx`, `CKNNulti.jsx`, `CKNPaper.jsx`

- **Solo**: 10 true/false statements about substances. Tap True/False. Score tracked.
- **Multiplayer**: Instructions + Sync Code Lobby link
- **Paper**: 10 printable true/false questions for facilitators

##### Game 2: Kuenzanisa Upenyu (KU) — Compare Lives
**Files**: `KUHome.jsx`, `KUSolo.jsx`, `KUMulti.jsx`, `KUPaper.jsx`

- **Solo**: 4-step life scenario chooser. Health/Social/Mood stat bars with consequences.
- **Multiplayer**: Instructions + Sync Code Lobby link
- **Paper**: 4 printable discussion cards with prompts

##### Game 3: Bata Chiratidzo (BC) — Tap the Symbol
**Files**: `BCHome.jsx`, `BCSolo.jsx`, `BCMulti.jsx`, `BCPaper.jsx`

- **Solo**: 30-second timed emoji tapping game. Tap health symbols (✅, 🏥, 🏃), avoid harmful ones (🍺, 💊, 💉).
- **Multiplayer**: Instructions + Sync Code Lobby link
- **Paper**: 8 printable quick-fire emoji quiz questions

---

### 13. Achievements (`/achievements`)

#### Achievements Home (`/achievements`)
**File**: `src/pages/Achievements/AchievementsHome.jsx`

- 15 badges in a grid:
  - Earned badges (coloured) vs Locked (greyed out)
- Progress counter: "X of 15 earned"

#### Badge Detail (`/achievements/:id`)
**File**: `src/pages/Achievements/BadgeDetail.jsx`

- Single badge view:
  - Icon, name, category
  - Description and earning criteria
  - Earned status + date
  - Tips to earn

**Full badge list:**
| Badge | Icon | Category |
|-------|------|----------|
| First Steps | 🌱 | Onboarding |
| Week Warrior | 🔥 | Consistency |
| Monthly Master | 👑 | Consistency |
| Dear Diary | 📓 | Mood |
| Safety First | 🛡️ | Safety |
| Honest Voice | 🗳️ | Polls |
| Truth Teller | ✋ | Games |
| Habit Watcher | 📊 | Habits |
| Fact Master | 🔍 | Knowledge |
| Life Chooser | ⚖️ | Knowledge |
| Quick Spotter | 🎯 | Games |
| Campaign Starter | 📢 | Campaigns |
| Knowledge Seeker | 📚 | Learning |
| Clean Week | ✅ | Recovery |
| Clean Month | 🏆 | Recovery |

---

### 14. More / Settings (`/more`)

**File**: `src/pages/More.jsx`

- Active profile info card (avatar, name, province, age)
- Menu sections:
  - **Features**: Lesson Plans, Campaign Hub, Honesty Zone, Research Portal, Games, Achievements
  - **Settings**: Dark Mode toggle (light/dark)
  - **Profile**: Switch Profile, New Profile
  - **About**: Aweh Ekse! Website link
- Device status:
  - Network status (Online/Offline)
  - Storage used (MB and percentage)
- App version footer

---

## Data Architecture (IndexedDB via Dexie.js)

### Database: `TovNativeDB` (version 1)

| Table | Primary Key | Indexes | Purpose |
|-------|-------------|---------|---------|
| `profiles` | auto-increment | name, createdAt | User profiles |
| `content` | id | pillar, category, ageGroup, title | Cached articles & game content |
| `progress` | auto-increment | profileId, moduleId, status | Learning progress |
| `assessments` | auto-increment | profileId, type, createdAt | Risk assessment results |
| `journal` | auto-increment | profileId, createdAt | Journal entries |
| `moodMatrix` | auto-increment | profileId, date, [profileId+date] | Daily mood check-ins |
| `habitLog` | auto-increment | profileId, date, [profileId+date] | Daily habit tracking |
| `safetyPlan` | profileId | — | Safety plan per profile |
| `polls` | id | category, createdAt | Community polls |
| `pollResponses` | auto-increment | profileId, pollId, createdAt | Poll answers |
| `habitLedger` | auto-increment | profileId, createdAt | Substance use tracking |
| `campaigns` | auto-increment | profileId, status, createdAt | Campaign data |
| `campaignEvents` | auto-increment | campaignId, date | Campaign event dates |
| `surveys` | auto-increment | profileId, surveyId, createdAt | Survey responses |
| `referrals` | auto-increment | profileId, status, createdAt | Referral tracking |
| `achievements` | auto-increment | profileId, badgeId | Earned badges |
| `syncQueue` | auto-increment | tableName, recordId, action, createdAt | Offline sync queue |
| `downloads` | id | type, size, downloadedAt | Downloaded content + seed flags |
| `gameScores` | auto-increment | profileId, gameId, createdAt | Game scores |
| `gameSyncCodes` | code | gameId, createdAt | Multiplayer room codes |

### Content Seeding
On first launch, the app seeds IndexedDB with:
- 10 bundled articles from `content-pillars.json`
- 10 game items from `game-content.json`
- 4 assessment templates from `assessments.json`
- 8 hotlines from `hotlines.json`
- 6 facilities from `facilities.json`

Seed flag stored in `downloads` table to prevent re-seeding.

---

## PWA Requirements

| Requirement | Implementation |
|-------------|---------------|
| Offline-first | Service Worker (Workbox) precaches all assets |
| Add to Home Screen | Full PWA manifest with icons, theme colour, standalone display |
| No internet required | All data in IndexedDB, all assets precached |
| Fast loading | React.lazy() code splitting, ~1-5KB per page chunk |
| Background sync | Sync queue in IndexedDB (ready for future cloud sync) |
| Portrait lock | `orientation: 'portrait-primary'` in manifest |
| Safe areas | `env(safe-area-inset-*)` padding for notch devices |

---

## Files for Redesign

### Styling Files
| File | Purpose |
|------|---------|
| `src/index.css` | **Main theme** — all custom colors, fonts, Tailwind config |
| `vite.config.js` | PWA manifest colors, build config |
| `index.html` | Body background classes, meta theme-color |

### Component Files (Layout)
| File | Lines | Purpose |
|------|-------|---------|
| `src/components/layout/AppShell.jsx` | 43 | Root layout shell |
| `src/components/layout/Header.jsx` | 35 | Fixed top header |
| `src/components/layout/BottomNav.jsx` | 54 | Fixed bottom nav (5 tabs) |
| `src/components/layout/OfflineBanner.jsx` | 16 | Offline status banner |

### Component Files (Shared UI)
| File | Lines | Purpose |
|------|-------|---------|
| `src/components/ui/Button.jsx` | 32 | Button (5 variants, 4 sizes) |
| `src/components/ui/Card.jsx` | 22 | Card + sub-components |
| `src/components/ui/Modal.jsx` | 31 | Full-screen modal |
| `src/components/ui/Toast.jsx` | 40 | Toast notification system |
| `src/components/ui/Badge.jsx` | 34 | Badge pills + ProgressRing |
| `src/components/ui/Skeleton.jsx` | 29 | Loading skeletons |
| `src/components/ui/SearchBar.jsx` | 33 | Search input |
| `src/components/ui/EmptyState.jsx` | 16 | Empty state placeholder |
| `src/components/ErrorBoundary.jsx` | 41 | Error boundary |

### Page Files (60+ files)
All located in `src/pages/` — see route table above. Each is a standalone `.jsx` file.
