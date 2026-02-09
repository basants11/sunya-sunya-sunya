# ✅ Pre-Deployment Verification Checklist

Complete this checklist before deploying to ensure everything works.

## Local Development Setup

- [ ] JWT secrets generated or added to .env.local
- [ ] npm install completed without errors
- [ ] npm run dev starts without errors
- [ ] App loads at http://localhost:3000
- [ ] No console errors (Ctrl+Shift+J / Cmd+Option+J)

## Core Functionality

### Header
- [ ] Header loads without "useCart" errors
- [ ] Header has smooth skeleton loader on first load
- [ ] Logo/branding visible
- [ ] Navigation items visible

### Cart Features
- [ ] Enhanced cart section loads smoothly
- [ ] Cart section has skeleton loader on first load
- [ ] Can view products in cart section
- [ ] Cart button has smooth animations on hover

### Add to Cart
- [ ] Can add product to cart
- [ ] Quantity selector works
- [ ] Add to cart button shows loading state
- [ ] Success toast appears
- [ ] Cart updates without errors

### Buttons
- [ ] Buttons have smooth hover animations
- [ ] Buttons have hover elevation (-translate-y effect)
- [ ] Buttons have active state (press down effect)
- [ ] Cart buttons have gradient
- [ ] All buttons are responsive

### Checkout
- [ ] Can open checkout modal
- [ ] Checkout form displays correctly
- [ ] Form inputs are responsive
- [ ] Submit button works

## Error Handling

- [ ] Error boundary displays without html/body nesting
- [ ] 404 page works correctly
- [ ] Error messages are clear

## Performance

- [ ] Initial page load < 3 seconds
- [ ] Cart interactions responsive
- [ ] Smooth animations (no jank)
- [ ] No memory leaks (check DevTools)

## Browser Compatibility

Test in at least 2 browsers:

### Chrome/Chromium
- [ ] Loads correctly
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth

### Firefox
- [ ] Loads correctly
- [ ] All features work
- [ ] No console errors
- [ ] Animations smooth

### Safari (if available)
- [ ] Loads correctly
- [ ] All features work
- [ ] No console errors

### Mobile (if available)
- [ ] Responsive layout
- [ ] Touch interactions work
- [ ] Buttons appropriately sized
- [ ] No horizontal scroll

## GitHub Preparation

- [ ] All files committed
- [ ] .env.local NOT in git (check .gitignore)
- [ ] No API keys in code
- [ ] Clean git history

```bash
# Verify .env.local is ignored
git status  # Should NOT show .env.local
```

## Vercel Setup

Before deploying to Vercel:

- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project created in Vercel
- [ ] Environment variables configured:
  - [ ] JWT_ACCESS_SECRET
  - [ ] JWT_REFRESH_SECRET

## Deployment

- [ ] Run final build test: `npm run build`
- [ ] No build errors
- [ ] No warnings (only if acceptable)
- [ ] Push to GitHub: `git push origin main`
- [ ] Trigger Vercel deployment
- [ ] Wait for build to complete

## Post-Deployment Testing

### Live URL Tests
- [ ] Can access live URL
- [ ] Header loads smoothly
- [ ] Cart section loads smoothly
- [ ] Can add products to cart
- [ ] Checkout works
- [ ] Buttons have animations
- [ ] No console errors

### Mobile Testing
- [ ] Responsive on small screens
- [ ] Touch interactions work
- [ ] Buttons clickable with proper sizing
- [ ] No layout issues

### Performance Metrics
- [ ] Page loads in < 3 seconds
- [ ] Lighthouse score > 75
- [ ] No Core Web Vitals issues

## Documentation

- [ ] README.md up to date
- [ ] FINAL_FIXES.md documents all changes
- [ ] DEPLOY_NOW.md has clear instructions
- [ ] .env.local.example updated

## Final Sign-Off

- [ ] All checks complete
- [ ] No critical issues
- [ ] Ready for production
- [ ] Team notified of deployment
- [ ] Monitoring set up (if applicable)

---

## Quick Verification Commands

```bash
# Check .env.local exists (with secrets)
ls -la .env.local

# Verify no API keys in code
grep -r "sk_" --include="*.ts" --include="*.tsx" .

# Check git status
git status

# Build for production
npm run build

# Run final checks
npm run lint  # if available
```

## Rollback Plan

If issues occur after deployment:

1. Vercel dashboard → Deployments
2. Click previous successful deployment
3. Click "Promote to Production"
4. Wait for rollback to complete
5. Investigate issue and fix locally
6. Redeploy when ready

---

**All checks passed? You're ready to deploy! 🚀**

Last verified: [Date]
Verified by: [Your name]
