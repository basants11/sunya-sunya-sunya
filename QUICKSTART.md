# 🚀 Sunya Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Local Setup (2 minutes)

```bash
# Extract the ZIP file and navigate to it
cd sunya

# Run automatic setup
chmod +x setup.sh
./setup.sh

# Or manual setup
npm install
cp .env.example .env.local
# Edit .env.local and add JWT secrets (see below)
```

### Generate JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```env
JWT_ACCESS_SECRET=<first-secret>
JWT_REFRESH_SECRET=<second-secret>
```

## Step 2: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 ✓

## Step 3: Push to GitHub (1 minute)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Sunya project"

# Create repo at https://github.com/new (name it "sunya")
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/sunya.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel (2 minutes)

### Option A: Dashboard (Easiest)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Add environment variables:
   - `JWT_ACCESS_SECRET`: (your secret)
   - `JWT_REFRESH_SECRET`: (your secret)
5. Click "Deploy"

### Option B: CLI

```bash
npm install -g vercel
vercel login
vercel --prod
# Answer prompts with defaults, add env vars when asked
```

## ✅ Done!

Your site is now live! 

- Check Vercel dashboard for your URL
- Future updates: just push to main (`git push origin main`)
- Vercel auto-deploys!

## 📌 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Local dev secrets (DO NOT COMMIT) |
| `.env.example` | Template for env vars |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `README.md` | Full documentation |

## 🆘 Common Issues

### Build fails with "Missing required environment variables"
→ Add JWT_ACCESS_SECRET and JWT_REFRESH_SECRET to Vercel

### "Cannot find module" errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Deployment shows old code
```bash
# Hard refresh browser: Ctrl+Shift+R
# Or redeploy from Vercel dashboard
```

## 📚 Next Steps

1. Configure custom domain (Vercel Settings)
2. Add Google OAuth (if using auth)
3. Set up database (if needed)
4. Configure payment providers
5. Add team members

## 🎯 What's Included

✓ E-commerce cart system
✓ User authentication
✓ Payment integration
✓ Mobile responsive
✓ Dark mode support
✓ Production-ready

## 💡 Pro Tips

- Keep `.env.local` out of git (it's in .gitignore)
- Always use strong secrets in production
- Test locally before pushing to main
- Check Vercel logs if deploy fails
- Use preview deployments for testing

---

For detailed info, see [DEPLOYMENT.md](./DEPLOYMENT.md)
