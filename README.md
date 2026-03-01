# JurisConnect - Smarter Legal Workflow

JurisConnect is a practice management platform built for modern lawyers to stay on top of their cases, clients, and billing without the headache of manual tracking. It combines a clean, professional dashboard with a robust backend to handle the "boring" legal admin work so you can focus on the courtroom.

##  What's Inside?

###  Matter Management
- Track active, ongoing, and future cases.
- Quick access to case numbers, court forums, and opposing counsel details.
- Integrated **Hearing Scheduler** to keep track of upcoming court stages.

###  Client Intelligence
- Unified contact list with verified communication details.
- View "Client 360" profiles showing all linked matters and history.
- Rapid client onboarding with zero verification fluff.

###  Time Tracking
- Live **Engagement Timer** to log billable hours in real-time.
- Dropdown selection for linking entries directly to active cases.
- Full engagement history logs.

###  Billing & Invoices
- Professional invoice generation with status tracking (*Draft, Sent, Paid, Overdue*).
- **Billing Snapshot** on the dashboard showing monthly revenue and outstanding dues.
- Support for general invoices (not tied to a specific matter).

##  The Tech Stack

- **Frontend**: Expo (React Native), Expo Router, Tailwind CSS (NativeWind), and standard StyleSheet for performance-critical screens.
- **Backend**: Node.js & Express.
- **Database**: Prisma ORM with PostgreSQL.
- **Tools**: TypeScript for end-to-end type safety.

##  Getting Started

### 1. Database Setup
Go to the `backend` folder and set up your environment:
1. Create a `.env` file with your `DATABASE_URL`.
2. Run migrations: `npx prisma migrate dev`.
3. Start the server: `npm run dev`.

### 2. Frontend Setup
Go to the `frontend` folder:
1. Install dependencies: `npm install`.
2. Update `config.ts` with your local IP if testing on a physical device.
3. Start the app: `npx expo start`.

##  Security & Isolation
The platform is built with strict multi-tenancy. Every entry (client, matter, time log) is locked to the specific user ID. New registrations get a completely clean workspace with zero data leakage from other users.

---

