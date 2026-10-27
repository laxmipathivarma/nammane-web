# Nammane - Social Events Discovery Platform

Find amazing people and great gatherings. A Web-first platform for discovering and hosting social events.

**Version:** 0.1.0 (Wave 1: Web App)  
**Target Markets:** Bengaluru, Mumbai, Delhi NCR (expandable)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier available)
- Vercel account (for deployment)

### Setup

1. **Clone & Install**
```bash
cd nammane-web
npm install
```

2. **Configure Environment**
```bash
# Copy and fill in your credentials
cp .env.local.example .env.local
```

3. **Set up Supabase**
```bash
# Create a new Supabase project
# Copy your API keys to .env.local

# Apply database migrations
supabase db push
```

4. **Run Development Server**
```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
nammane-web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page (with rotating hero)
│   │   ├── auth/         # Authentication pages
│   │   ├── discover/     # Event discovery
│   │   └── api/          # Backend routes
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities (auth, db, types)
│   └── styles/           # Global CSS (Tailwind)
├── database/             # SQL migrations
├── .github/workflows/    # CI/CD (auto-deploy)
└── public/               # Static assets
```

## 🔧 Tech Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS  
**Backend:** Next.js API Routes  
**Database:** PostgreSQL (via Supabase)  
**Auth:** NextAuth.js (extensible for OTP, OAuth)  
**Hosting:** Vercel  
**Git:** GitHub (main/staging branches)  

## 📚 Core Features (Wave 1)

- **Event Discovery** - Browse events by category, city, date
- **Event Creation** - Guided flow for hosts to create events
- **Booking System** - Request to join, approval-based attendance
- **User Profiles** - Registration, profile setup, city selection
- **Basic Chat** - Event-scoped messaging
- **Trust & Safety** - Blocking, reporting, moderation queue

## 🌍 Environment Variables

See `.env.local.example` and `.env.production.example` for details:
- Supabase credentials
- NextAuth secrets
- OAuth providers (optional for Wave 1)

## 🚢 Deployment

### Staging
```bash
git push origin staging
# Auto-deploys to staging.nammane.in
```

### Production
```bash
git push origin main
# Auto-deploys to nammane.in
```

See `.github/workflows/` for CI/CD configuration.

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Push to GitHub
3. Create a pull request to `staging`
4. After testing, merge to `main` for production

## 📖 Documentation

- [Database Schema](./database/README.md)
- [API Routes](./src/app/api/README.md) (to be created)
- [Deployment Guide](./docs/DEPLOYMENT.md) (to be created)

## 🔐 Security

- Row-level security (RLS) on all Supabase tables
- Authentication via NextAuth.js (email/password, OTP, OAuth)
- Environment variables for secrets (never committed)
- HTTPS only in production

## 💰 Free Tier Coverage

- **Supabase:** 500MB database, 2GB bandwidth (covers ~500 active users)
- **Vercel:** Unlimited deployments on free hobby plan
- **GitHub:** Free private repos with Actions

### Upgrade Path
- Supabase → $25/mo (1GB database)
- Vercel → $20/mo (Pro) when needed
- Custom domain & email → ~$50/mo combined

## 📞 Support

For questions or issues:
1. Check existing GitHub issues
2. Create a new issue with reproduction steps
3. Contact the team

---

**Built for Nammane, India's social events platform.**
