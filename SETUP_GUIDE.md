# Nammane Setup Guide - Wave 1

## ✅ What's Been Created

Your complete Next.js starter for Nammane is ready at:
```
~/Projects/nammane-web/
```

### Project Structure
```
nammane-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page with rotating hero
│   │   ├── layout.tsx            ← Root layout
│   │   ├── auth/
│   │   │   └── signup/page.tsx   ← Sign-up page
│   │   ├── discover/
│   │   │   └── page.tsx          ← Event discovery page
│   │   └── api/
│   │       └── auth/signup/route.ts
│   ├── lib/
│   │   ├── auth.ts               ← Supabase auth helpers
│   │   ├── supabase.ts           ← Supabase client
│   │   └── types.ts              ← TypeScript types
│   └── styles/
│       └── globals.css           ← Tailwind + global styles
├── database/
│   ├── 001_initial_schema.sql    ← Full database schema
│   └── README.md
├── .github/workflows/
│   ├── deploy-main.yml           ← Auto-deploy to production
│   └── deploy-staging.yml        ← Auto-deploy to staging
├── .env.local.example            ← Development env template
├── .env.staging.example          ← Staging env template
├── .env.production.example       ← Production env template
├── package.json                  ← Dependencies
├── tsconfig.json                 ← TypeScript config
├── tailwind.config.ts            ← Tailwind config
├── next.config.js                ← Next.js config
└── README.md                      ← Project docs
```

## 🔧 Next Steps (In Order)

### 1. Create GitHub Repository
```bash
cd nammane-web
git init
git add .
git commit -m "Initial commit: Wave 1 scaffold"
git branch -M main
git remote add origin https://github.com/yourusername/nammane-web.git
git push -u origin main

# Create staging branch
git checkout -b staging
git push -u origin staging
```

### 2. Set Up Supabase (5 minutes)
1. Go to https://supabase.com
2. Create a new Free project
3. In Project Settings → API, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
4. Save to `.env.local`:
```bash
cp .env.local.example .env.local
# Edit and fill in your Supabase keys
```

### 3. Create Database
1. In Supabase → SQL Editor
2. Copy the full content from `database/001_initial_schema.sql`
3. Run the SQL query
4. You now have all tables ready!

### 4. Install Dependencies & Run Local
```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see your landing page with the rotating hero!

### 5. Connect GitHub to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import `nammane-web` repository
4. Create 2 projects:
   - **Project 1: Production**
     - Branch: `main`
     - Domain: `nammane.in`
     - Environment: `.env.production`
   - **Project 2: Staging**
     - Branch: `staging`
     - Domain: `staging.nammane.in`
     - Environment: `.env.staging`

5. Add secrets to both Vercel projects:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_URL
NEXTAUTH_SECRET
```

### 6. Set Up NextAuth (Optional for Wave 1)
For now, we have basic email/password. Later add:
- Google OAuth
- Phone/Email OTP (via Twilio)
- Magic links

Update `src/app/api/auth/signup/route.ts` with real Supabase calls.

## 🌐 Domain Setup

### Free Domain Workaround (Wave 1)
Use `nammane.vercel.app` while planning:
- Keep your domain budget for later
- Vercel auto-assigns free preview URLs per branch

### When Ready (After PMF)
1. Buy `nammane.in` from GoDaddy or NameCheap (~$100/year)
2. Point nameservers to Vercel
3. Vercel auto-handles SSL/TLS

## 📝 Configuration Checklist

- [ ] GitHub repo created with main & staging branches
- [ ] Supabase project created and database migrated
- [ ] `.env.local` filled with Supabase keys
- [ ] `npm install` completed locally
- [ ] `npm run dev` working on http://localhost:3000
- [ ] Vercel projects linked to GitHub
- [ ] GitHub secrets added to Vercel
- [ ] Test deploy to staging: `git push origin staging`
- [ ] Test deploy to production: `git push origin main`

## 🚀 First Deploy

```bash
# Test on staging first
git checkout staging
git cherry-pick main  # or git merge main
git push origin staging
# Wait for staging.nammane.vercel.app to deploy

# Then go live
git checkout main
git merge staging
git push origin main
# Wait for nammane.vercel.app (or nammane.in) to deploy
```

## 📱 Testing the MVP

Once deployed to staging:
1. Visit the landing page → rotating hero works ✓
2. Click "Get Started" → signup page loads ✓
3. Click "Explore Events" → discover page loads ✓
4. (Later) Test sign-up flow once Supabase auth is wired

## 🔐 Environment Variables Reference

### Development (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Secret for API routes
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET` - Random 32+ char string

### Staging (.env.staging)
- Same as above but use staging Supabase instance
- `NEXTAUTH_URL=https://staging.nammane.in`

### Production (.env.production)
- Same as above but use production Supabase instance
- `NEXTAUTH_URL=https://nammane.in`

**NEVER commit `.env.local`, `.env.staging`, or `.env.production`**
Only `.env.*.example` files go in Git.

## 💡 Tips

1. **Local Testing:** Use `npm run dev`, not `npm run build`
2. **Database Changes:** Edit SQL, run in Supabase SQL Editor
3. **Secrets:** Use GitHub Secrets + Vercel Environment Variables (one source of truth)
4. **Branching:** Always develop on `develop` or feature branches, push to `staging` first
5. **Live Reload:** Next.js auto-hot-reloads on file changes

## 📞 Troubleshooting

### "Supabase module not found"
```bash
npm install @supabase/ssr @supabase/supabase-js
```

### "Cannot find module @/lib/..."
Check `tsconfig.json` has baseUrl and paths set correctly.

### Vercel deploy fails
1. Check GitHub Actions logs
2. Ensure environment variables are set in Vercel project
3. Ensure branch protection rules aren't blocking

## 🎯 Next Build Priorities

1. **Wire Auth** - Connect signup/login to Supabase
2. **Event Creation** - Build guided form for hosts
3. **Event Discovery** - Query and display events
4. **Booking Flow** - Request → Approve → Attend
5. **Search & Filters** - By city, category, date
6. **Messages** - Event-scoped chat

See README.md for full feature roadmap.

---

**You're all set!** Start building. 🚀
