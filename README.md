# ZenFocus Event Automation

A complete, high-converting webinar funnel system built with **Next.js 16 (App Router)**, **Stripe Checkout**, **MongoDB**, and **Nodemailer**. Designed for paid workshops and live events — from landing page to payment to automated email sequences.

---

## 🎯 What This Does

This is a production-ready, end-to-end event automation platform:

1. **Landing Page** — A long-form, conversion-optimized sales page with a 2-step checkout flow
2. **Stripe Payment** — Real Stripe Checkout integration ($97 workshop ticket)
3. **Success Page** — Verifies payment via Stripe API, saves user to MongoDB with `isPaid: true`, and displays a premium confirmation page
4. **Automated Emails** — Pre-event, reminder, and post-event email sequences triggered by an external cron service
5. **Facebook Pixel** — Full funnel tracking (PageView → Lead → InitiateCheckout → Purchase)

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                          # Landing page (2-step form + Stripe checkout)
│   ├── success/page.tsx                  # Payment confirmation page
│   ├── api/
│   │   ├── create-checkout-session/      # POST — Creates Stripe Checkout session
│   │   ├── verify-session/               # GET  — Verifies Stripe payment, upserts user in DB
│   │   ├── send-email/                   # GET  — Cron-triggered email dispatcher
│   │   └── user/                         # POST — Manual user creation endpoint
│   ├── layout.tsx                        # Root layout (Facebook Pixel, SEO metadata)
│   └── globals.css                       # Global styles
├── components/
│   ├── FacebookPixel.tsx                 # FB Pixel init + fbEvent() helper
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── config.ts                         # EVENT_DATE constant
│   ├── db.ts                             # MongoDB/Mongoose connection
│   ├── emailTemplate.ts                  # HTML email templates + dispatch logic
│   └── mailer.ts                         # Nodemailer transporter
├── models/
│   └── user.ts                           # Mongoose User schema
├── public/
│   ├── logoMain.png                      # Brand logo
│   └── 1-6.png                           # Social proof images
├── vercel.json                           # Vercel cron job config (hourly)
└── .env                                  # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test or live keys)
- Gmail account with App Password (for Nodemailer)

### 1. Clone & Install

```bash
git clone https://github.com/ismaeeldev/ZenFocus-Event-Automation.git
cd ZenFocus-Event-Automation
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Email (Gmail + App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ZOOM_LINK=https://zoom.us/your-meeting-link

# Facebook Pixel (optional)
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## 💳 Payment Flow

```
User fills form (Step 1)
  → Clicks "Secure Your Spot" → slides to Step 2
  → Clicks "Pay with Stripe"
  → POST /api/create-checkout-session → Stripe Checkout page
  → User pays with card
  → Stripe redirects to /success?session_id=cs_test_...
  → GET /api/verify-session → confirms payment
  → Upserts user in MongoDB (isPaid: true)
  → Success page renders with real payment data
```

### Test Card (Stripe Test Mode)

| Field       | Value                    |
|-------------|--------------------------|
| Card Number | `4242 4242 4242 4242`    |
| Expiry      | Any future date          |
| CVC         | Any 3 digits             |

---

## 📧 Email Automation

The system sends automated emails based on time remaining until `EVENT_DATE` (set in `lib/config.ts`).

### Email Schedule

| Phase            | Timing           | Email Type     |
|------------------|------------------|----------------|
| **Pre-Webinar**  | 7 days before    | Welcome        |
|                  | 5 days before    | Value build    |
|                  | 3 days before    | Social proof   |
|                  | 2 days before    | Urgency        |
|                  | 1 day before     | Final prep     |
|                  | Same day         | Go-time        |
| **Reminders**    | 24 hours before  | Reminder       |
|                  | 5 hours before   | Reminder       |
|                  | 1 hour before    | Reminder       |
|                  | Live now         | Live alert     |
| **Post-Webinar** | Immediately      | Replay access  |
|                  | 24 hours after   | Replay nudge   |
|                  | 48 hours after   | Replay urgency |
|                  | Final            | Last chance     |

### How It Works

- Each user has a `sentEmails: [String]` array in the database to prevent duplicate sends
- The `/api/send-email` endpoint calculates hours until the event and dispatches the highest-priority unsent email
- Emails are branded HTML templates with the company logo and CTA buttons

### Triggering Emails

**Option A: Vercel Cron (automatic on deploy)**

The `vercel.json` configures an hourly cron job:
```json
{
  "crons": [{ "path": "/api/send-email", "schedule": "0 * * * *" }]
}
```

**Option B: External Cron Service**

Use [cron-job.org](https://cron-job.org) or similar to hit:
```
GET https://your-domain.vercel.app/api/send-email
```

---

## 📊 Facebook Pixel Events

| Funnel Step                  | Pixel Event         | Location          |
|------------------------------|---------------------|-------------------|
| Any page loads               | `PageView`          | Layout (auto)     |
| User submits form (Step 1→2) | `Lead`              | Landing page      |
| User clicks "Pay with Stripe"| `InitiateCheckout`  | Landing page      |
| Payment confirmed by Stripe  | `Purchase` ($97)    | Success page      |

To activate, set `NEXT_PUBLIC_FB_PIXEL_ID` in your `.env` to your Pixel ID from [Facebook Events Manager](https://business.facebook.com/events_manager).

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Add **all environment variables** in Vercel → Settings → Environment Variables
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g. `https://your-project.vercel.app`)
5. Deploy — the cron job will start automatically

### Post-Deploy Checklist

- [ ] Set all env variables in Vercel dashboard
- [ ] Replace `NEXT_PUBLIC_APP_URL` with your Vercel URL
- [ ] Replace Stripe test keys with live keys (`sk_live_...`, `pk_live_...`)
- [ ] Set real Gmail credentials for email sending
- [ ] Set your Facebook Pixel ID
- [ ] Set your Zoom registration link
- [ ] Verify `EVENT_DATE` in `lib/config.ts` matches your event date
- [ ] Test a payment with Stripe test card before going live

---

## 🛠 Tech Stack

| Technology     | Purpose                          |
|----------------|----------------------------------|
| Next.js 16     | App Router, SSR, API Routes      |
| Tailwind CSS   | Styling                          |
| shadcn/ui      | UI Components                    |
| Stripe         | Payment processing               |
| MongoDB        | User database                    |
| Mongoose       | ODM for MongoDB                  |
| Nodemailer     | Email sending (Gmail SMTP)       |
| Lucide React   | Icons                            |
| Facebook Pixel | Ad tracking & conversion events  |

---

## 📄 License

This project is private and proprietary to Zen Focus Media.
