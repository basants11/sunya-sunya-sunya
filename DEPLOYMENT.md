# Deployment Guide - Sunya

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your JWT secrets:

```bash
# Generate secure secrets with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update:
```
JWT_ACCESS_SECRET=<your-generated-secret-1>
JWT_REFRESH_SECRET=<your-generated-secret-2>
```

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to verify everything works.

## Deployment to GitHub

### 1. Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit: Sunya project setup"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `sunya`
3. Copy the repository URL

### 3. Push to GitHub

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## Deployment to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
5. Add Environment Variables:
   - `JWT_ACCESS_SECRET`: Your generated secret from step above
   - `JWT_REFRESH_SECRET`: Your generated secret from step above
   - `NODE_ENV`: production
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install CLI globally
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- Link to existing project? → No (first time)
- Project name? → sunya
- Framework preset? → Next.js
- Root directory? → ./

## Environment Variables on Vercel

### Required Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_ACCESS_SECRET` | Yes | Secret key for access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | Yes | Secret key for refresh tokens (min 32 chars) |
| `NODE_ENV` | No | Set to `production` |

### Optional Variables

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: For Google OAuth login
- `GOOGLE_CLIENT_SECRET`: For Google OAuth backend
- `DATABASE_URL`: If using a backend database

## Continuous Deployment

After pushing to GitHub, Vercel automatically deploys:

```bash
git add .
git commit -m "Update: feature description"
git push origin main

# Vercel builds and deploys automatically!
```

## Troubleshooting

### Build Fails with "Missing required environment variables"

**Solution**: Add `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to Vercel environment variables.

### "useCart must be used within a CartProvider"

**Solution**: This is normal during local development with hot reload. The wrapper components defer rendering until the cart provider is ready. Refresh the page if needed.

### Deployment Still Shows Old Code

**Solution**: Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R) or clear cache:

```bash
# Vercel cache
vercel env pull  # Pull latest env vars
vercel --prod    # Redeploy
```

### "Cannot find module" Errors

**Solution**: 

```bash
# Clear build cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Generating Secure JWT Secrets

Use Node.js to generate cryptographically secure secrets:

```bash
# Generate 32-byte (256-bit) hex secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Repeat for both secrets and add to .env.local and Vercel
```

## Production Checklist

- [ ] JWT secrets generated and added to `.env.local`
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] Project pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables added to Vercel
- [ ] Initial deployment successful
- [ ] Test site at your Vercel URL
- [ ] Custom domain configured (optional)

## Monitoring Deployment

View deployment logs in Vercel Dashboard:

1. Go to your Vercel project
2. Click "Deployments" tab
3. Click on latest deployment
4. View build and function logs

## Rolling Back Deployment

If needed, revert to previous deployment:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Find previous working deployment
5. Click the three dots → "Redeploy"

## Support

For issues:
- Check Vercel logs: `vercel logs`
- Check GitHub commits: `git log`
- Review environment variables: `vercel env list`

## Next Steps

After successful deployment:

1. Configure custom domain in Vercel settings
2. Set up analytics/monitoring
3. Configure email notifications
4. Add additional team members

For more help visit:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Docs: https://docs.github.com
