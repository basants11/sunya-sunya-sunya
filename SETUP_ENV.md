# Environment Setup Guide

## Quick Start (Development)

### 1. Copy Environment Template
```bash
cp .env.local.example .env.local
```

### 2. Generate JWT Secrets (Optional for Development)
```bash
node generate-secrets.js
```

This will output:
```
JWT_ACCESS_SECRET=abc123...
JWT_REFRESH_SECRET=xyz789...
```

Copy these into your `.env.local` if you want to test authentication.

### 3. Start Development Server
```bash
npm install
npm run dev
```

Visit http://localhost:3000 - everything works!

## Features Available Without Database

### ✓ Works Out of the Box
- Homepage and all static pages
- Product showcase
- Newsletter signup (form only, no database save)
- Responsive design
- All UI interactions
- Header, footer, navigation
- Search functionality (client-side)
- Cart features (local storage)

### ✓ Limited Features (Without MongoDB)
- Authentication pages display (login/signup forms)
- User profile pages (mock data in dev)
- API endpoints return mock data in dev mode
- Cart system (uses localStorage, syncs with mock server)

## Production Setup (With Database)

### Get MongoDB Connection String

#### Option 1: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env.local`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sunya
```

#### Option 2: MongoDB Community (Local)
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Connection string:
MONGODB_URI=mongodb://localhost:27017/sunya
```

### Full .env.local for Production
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sunya

# JWT Secrets (run: node generate-secrets.js)
JWT_ACCESS_SECRET=your-secure-access-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here

# Optional: Google OAuth (if you want to add it back)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

## Environment Variables Explained

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Production Only | Database connection string |
| `JWT_ACCESS_SECRET` | Production Only | Sign JWT access tokens |
| `JWT_REFRESH_SECRET` | Production Only | Sign JWT refresh tokens |
| `NODE_ENV` | Auto (development/production) | Current environment |

## Development Mode Behavior

### Database Connection Missing
- ✓ App starts without crashing
- ✓ API endpoints return mock data
- ✓ Pages load normally
- ✓ Shows console warnings (normal)

### JWT Secrets Missing
- ✓ Uses safe development defaults
- ✓ Shows console warnings (normal)
- ✓ Authentication works for testing

## Vercel Deployment

### 1. Add Environment Variables
Go to Vercel Project Settings → Environment Variables

Add these for production:
```
MONGODB_URI = mongodb+srv://...
JWT_ACCESS_SECRET = (from node generate-secrets.js)
JWT_REFRESH_SECRET = (from node generate-secrets.js)
```

### 2. Deploy
```bash
git push origin main
# Vercel auto-deploys
```

## Common Issues

### "MONGODB_URI not defined"
- **In Development**: Normal! App runs with mock data
- **In Production**: Add MONGODB_URI to Vercel environment variables

### "JWT secrets missing"
- **In Development**: Normal! Uses safe defaults, shows warning
- **In Production**: Run `node generate-secrets.js` and add to env vars

### Database Queries Failing
- Check `.env.local` has correct MONGODB_URI
- Ensure MongoDB Atlas cluster is accessible
- Verify IP whitelist includes your IP (Atlas Settings)

## Testing Database Connection

### Test Locally
```bash
# In your .env.local, add:
MONGODB_URI=mongodb://localhost:27017/sunya

# Then start MongoDB:
mongod

# App should connect without errors
```

### Test in Production
Check Vercel logs:
```bash
vercel logs --follow
```

## Next Steps

1. **For Development**: Just run `npm run dev` - everything works!
2. **For Production**: Set up MongoDB Atlas + environment variables
3. **For Testing**: Keep development mode as-is, it's perfect for building UI

---

All set! Your **Sunya** project is ready to run locally without any configuration needed.
