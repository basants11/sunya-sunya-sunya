# ✅ Deployment Checklist for Sunya

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment (Local Setup)

- [ ] Node.js 18+ installed
- [ ] Project extracted to your machine
- [ ] Dependencies installed: `npm install`
- [ ] `.env.local` created with JWT secrets
- [ ] Local development tested: `npm run dev`
- [ ] No console errors when visiting `http://localhost:3000`
- [ ] Cart functionality works
- [ ] Navigation works across pages

### Generate JWT Secrets

```bash
# Generate two secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local:
# JWT_ACCESS_SECRET=<secret-1>
# JWT_REFRESH_SECRET=<secret-2>
```

## GitHub Setup

- [ ] GitHub account created (https://github.com)
- [ ] Git installed locally
- [ ] Repository initialized: `git init`
- [ ] All files added: `git add .`
- [ ] Initial commit created: `git commit -m "Initial commit"`
- [ ] New repository created at https://github.com/new
- [ ] Repository named `sunya` (or your preferred name)
- [ ] Repository URL copied
- [ ] Remote added: `git remote add origin <URL>`
- [ ] Branch renamed: `git branch -M main`
- [ ] Code pushed: `git push -u origin main`
- [ ] Code visible on GitHub (refresh page)

### Git Commands Quick Reference

```bash
git init
git add .
git commit -m "Initial commit: Sunya project"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Vercel Setup

- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub account connected to Vercel
- [ ] Vercel CLI installed (optional): `npm install -g vercel`

### Deployment - Dashboard Method (Recommended)

- [ ] Logged into Vercel
- [ ] Clicked "Add New..." → "Project"
- [ ] Selected GitHub repository (sunya)
- [ ] Framework confirmed as "Next.js"
- [ ] Root directory confirmed as "./"
- [ ] Environment variables page opened
- [ ] Added: `JWT_ACCESS_SECRET` with your secret
- [ ] Added: `JWT_REFRESH_SECRET` with your secret
- [ ] Added: `NODE_ENV` = `production` (optional)
- [ ] Clicked "Deploy"
- [ ] Deployment completed (green checkmark)
- [ ] Deployment URL visible
- [ ] Test URL clicked and site loads

### Deployment - CLI Method

- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Project created: `vercel` (follow prompts)
- [ ] Or deployed to production: `vercel --prod`
- [ ] Environment variables added when prompted
- [ ] Deployment completed successfully

## Post-Deployment Verification

- [ ] Visit your Vercel URL in browser
- [ ] Home page loads without errors
- [ ] Navigation links work
- [ ] Cart can add items
- [ ] Search functionality works
- [ ] Responsive design works on mobile (test in dev tools)
- [ ] No 404 errors in console
- [ ] No red error messages
- [ ] No yellow warning messages (minor OK)

### Test Checklist on Live Site

- [ ] [ ] Home page loads
- [ ] [ ] Products page loads
- [ ] [ ] Product details load
- [ ] [ ] Cart functionality works
- [ ] [ ] Add to cart works
- [ ] [ ] Cart drawer opens/closes
- [ ] [ ] Remove from cart works
- [ ] [ ] Search works
- [ ] [ ] Mobile menu works (on mobile)
- [ ] [ ] No API errors in browser console

## Continuous Deployment Setup

- [ ] GitHub repository connected to Vercel
- [ ] Auto-deploy on push enabled (default)
- [ ] Understand that every `git push origin main` triggers deploy
- [ ] Know how to check deployment status in Vercel dashboard

### Test Continuous Deployment

- [ ] Make a small code change locally
- [ ] Commit change: `git commit -am "Test: Update..."`
- [ ] Push change: `git push origin main`
- [ ] Check Vercel dashboard for deployment
- [ ] Verify deployment completed
- [ ] Verify change is live

## Environment Variables Verification

Confirm these are set in Vercel:

- [ ] `JWT_ACCESS_SECRET` - 32+ character hex string
- [ ] `JWT_REFRESH_SECRET` - 32+ character hex string
- [ ] `NODE_ENV` - set to `production` (optional but recommended)

### Check Vercel Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Verify all required variables are listed
5. Do NOT display secret values to others

## Monitoring & Maintenance

- [ ] Know how to view logs: `vercel logs`
- [ ] Know how to redeploy: Vercel dashboard → Deployments
- [ ] Know how to rollback: Select previous deployment → Redeploy
- [ ] Set up deployment notifications (optional)
- [ ] Know where to check uptime (Vercel dashboard)

## Troubleshooting Ready

If issues occur:

- [ ] Check Vercel logs: https://vercel.com/docs/observability/logs
- [ ] Verify environment variables are set
- [ ] Check `.env.local` has valid secrets
- [ ] Review DEPLOYMENT.md troubleshooting section
- [ ] Check FIXES_APPLIED.md for known issues
- [ ] Clear build cache and redeploy

### Common Issues Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check Vercel logs, verify env vars |
| JWT errors | Add JWT_ACCESS_SECRET and JWT_REFRESH_SECRET |
| Cannot find module | Try redeploying or clearing cache |
| Old code showing | Hard refresh (Ctrl+Shift+R) |
| Cart not working | Refresh page, check browser console |

## Security Checklist

- [ ] `.env.local` in `.gitignore` (NOT committed)
- [ ] Secrets not shared or posted online
- [ ] GitHub repository set to private (optional)
- [ ] Vercel project access limited to team members
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Secure password used for accounts

### Never Do This

❌ Don't commit `.env.local` to GitHub
❌ Don't share JWT secrets publicly
❌ Don't use weak secrets
❌ Don't commit API keys to code
❌ Don't deploy unfinished work to main

## Final Steps

- [ ] Celebrate deployment! 🎉
- [ ] Share Vercel URL with team
- [ ] Monitor for issues in first hour
- [ ] Monitor error logs for problems
- [ ] Document deployment in team wiki/notes
- [ ] Set up backup deployment (optional)

## Team Collaboration

If working with a team:

- [ ] Add team members to Vercel project
- [ ] Add team members to GitHub repo
- [ ] Establish branch protection rules
- [ ] Set up code review process
- [ ] Document deployment procedures
- [ ] Create deployment runbook
- [ ] Assign deployment responsibilities

## Next Deployment (Future)

For future updates:

```bash
# Make changes locally
git add .
git commit -m "Feature: Description"
git push origin main

# Vercel auto-deploys!
# Check dashboard or notification email
```

---

## Quick Reference

### If Something Goes Wrong

```bash
# Check local build
npm run build

# Check git status
git status
git log --oneline

# View Vercel logs
vercel logs

# Redeploy from Vercel dashboard
# Settings → Deployments → Select deployment → Redeploy
```

### Emergency Rollback

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the last working deployment
4. Click the three dots
5. Select "Redeploy"
6. Wait for deployment to complete

---

## Completion

- [ ] **All items checked** ✅
- [ ] **Site live and working** ✅
- [ ] **Team notified** ✅
- [ ] **Ready for next update** ✅

**Date Deployed**: ___________
**Deployed By**: ___________
**Issues Found**: ___________

---

**Congratulations! Your Sunya project is live!** 🚀

For detailed information, see:
- README.md - Project overview
- DEPLOYMENT.md - Detailed deployment guide
- QUICKSTART.md - Quick setup guide
- FIXES_APPLIED.md - What was fixed
