# Authentication System Setup Guide

Complete setup guide for the Sunya authentication system with JWT-based email/password auth and Google OAuth integration.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Environment Variables](#environment-variables)
5. [MongoDB Setup](#mongodb-setup)
6. [Google OAuth Setup](#google-oauth-setup)
7. [Gmail SMTP Setup](#gmail-smtp-setup)
8. [Testing Instructions](#testing-instructions)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The authentication system provides:

- **JWT-based Authentication**: Email/password with secure httpOnly cookies
- **Google OAuth**: One-click sign-in with Google
- **Email Verification**: Required before account activation
- **Password Reset**: Secure token-based password recovery
- **Rate Limiting**: Protection against brute force attacks
- **Session Management**: Automatic token refresh

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   API Routes    │────▶│    MongoDB      │
│                 │     │   /api/auth/*   │     │   (User Data)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  Gmail SMTP     │
         │              │  (Email)        │
         │              └─────────────────┘
         ▼
┌─────────────────┐
│  Google OAuth   │
│  (Firebase/     │
│   Direct)       │
└─────────────────┘
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] pnpm or npm package manager
- [ ] Git access to the repository
- [ ] A Google account (for OAuth and SMTP)
- [ ] MongoDB Atlas account (free tier available)

---

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd /path/to/sunya

# Install auth-related dependencies
pnpm add mongoose bcryptjs jsonwebtoken nodemailer zod
pnpm add @hookform/resolvers

# Install dev dependencies
pnpm add -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer
```

### Step 2: Create Environment File

Create `.env.local` in the project root:

```bash
# Copy from example
cp .env.example .env.local

# Or create manually
touch .env.local
```

### Step 3: Generate JWT Secrets

Generate secure random strings for JWT signing:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32
openssl rand -base64 32

# Using Node.js
crypto.randomBytes(32).toString('base64')
```

Copy these values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

### Step 4: Set Up MongoDB

Follow the [MongoDB Setup](#mongodb-setup) section below.

### Step 5: Set Up Google OAuth

Follow the [Google OAuth Setup](#google-oauth-setup) section below.

### Step 6: Set Up Gmail SMTP

Follow the [Gmail SMTP Setup](#gmail-smtp-setup) section below.

### Step 7: Start Development Server

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

---

## Environment Variables

### Complete `.env.local` Template

```bash
# ============================================
# MongoDB Configuration
# ============================================
# Get from MongoDB Atlas: https://cloud.mongodb.com
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sunya?retryWrites=true&w=majority

# ============================================
# JWT Secrets (Generate with: openssl rand -base64 32)
# ============================================
JWT_ACCESS_SECRET=your_access_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_min_32_chars

# ============================================
# Gmail SMTP Configuration
# ============================================
# 1. Enable 2FA on your Gmail account
# 2. Generate App Password at: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@sunya.com.np

# ============================================
# Google OAuth Configuration
# ============================================
# Create at: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ============================================
# Firebase Configuration (Existing)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="your_private_key"

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Variable Descriptions

| Variable               | Required | Description                                      |
| ---------------------- | -------- | ------------------------------------------------ |
| `MONGODB_URI`          | Yes      | MongoDB connection string                        |
| `JWT_ACCESS_SECRET`    | Yes      | Secret for signing access tokens (15 min expiry) |
| `JWT_REFRESH_SECRET`   | Yes      | Secret for signing refresh tokens (7 day expiry) |
| `SMTP_HOST`            | Yes      | SMTP server hostname                             |
| `SMTP_PORT`            | Yes      | SMTP server port (587 for TLS)                   |
| `SMTP_USER`            | Yes      | Gmail address for sending emails                 |
| `SMTP_PASS`            | Yes      | Gmail App Password (NOT your regular password)   |
| `SMTP_FROM`            | Yes      | From address for emails                          |
| `GOOGLE_CLIENT_ID`     | Yes      | Google OAuth client ID                           |
| `GOOGLE_CLIENT_SECRET` | Yes      | Google OAuth client secret                       |
| `NEXT_PUBLIC_APP_URL`  | Yes      | Your app URL (for email links)                   |

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended - Free Tier)

1. **Create Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up for free account
   - Create a new project named "sunya"

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select region closest to your users (e.g., Mumbai for Nepal/India)
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Generate a secure password (save it!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Drivers"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with "sunya"

6. **Test Connection**
   ```bash
   # Add to .env.local
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sunya?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB (Development Only)

```bash
# Install MongoDB Community Edition
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Set local connection string
MONGODB_URI=mongodb://localhost:27017/sunya
```

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Sunya Auth" (or your preferred name)
4. Click "Create"

### 2. Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Toolkit API"
3. Click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (for testing) or "Internal" (if using Google Workspace)
3. Click "Create"
4. Fill in required fields:
   - **App name**: Sunya
   - **User support email**: your-email@gmail.com
   - **Developer contact information**: your-email@gmail.com
5. Click "Save and Continue"
6. Skip "Scopes" for now (we'll use default)
7. Add test users (for external apps in testing mode):
   - Click "Add Users"
   - Enter email addresses of users who can test
8. Click "Save and Continue"

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name: "Sunya Web Client"
5. **Authorized JavaScript origins**:
   - Add `http://localhost:3000` (development)
   - Add `https://yourdomain.com` (production)
6. **Authorized redirect URIs**:
   - Add `http://localhost:3000/api/auth/google` (development)
   - Add `https://yourdomain.com/api/auth/google` (production)
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**

### 5. Add to Environment Variables

```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

---

## Gmail SMTP Setup

### 1. Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow prompts to enable 2FA
4. Verify with your phone

### 2. Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Enter "Sunya Website" as the name
6. Click "Generate"
7. **Copy the 16-character password** (shown with spaces, remove spaces when using)

### 3. Configure Environment

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # Remove spaces: abcd efgh ijkl mnop → abcdefghijklmnop
SMTP_FROM=noreply@sunya.com.np
```

### 4. Test Email Configuration

```bash
# Run the email test script (if available)
pnpm test:email

# Or test via API endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'
```

---

## Testing Instructions

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Test Registration Flow

1. Open http://localhost:3000
2. Click the profile icon in the header
3. Click "Create Account"
4. Fill in:
   - Full Name: Test User
   - Email: your-test-email@gmail.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
5. Click "Create Account"
6. Check your email for verification link
7. Click the verification link
8. Verify you see "Email verified successfully"

### 3. Test Login Flow

1. Click profile icon → "Login"
2. Enter credentials:
   - Email: your-test-email@gmail.com
   - Password: TestPass123!
3. Click "Sign In"
4. Verify you're logged in (profile shows your name)

### 4. Test Google OAuth

1. Logout if currently logged in
2. Click profile icon → "Login"
3. Click "Continue with Google"
4. Select your Google account
5. Verify successful login

### 5. Test Password Reset

1. Logout
2. Click profile icon → "Login"
3. Click "Forgot password?"
4. Enter your email
5. Check email for reset link
6. Click reset link
7. Enter new password
8. Login with new password

### 6. Test Protected Routes

1. Ensure you're logged out
2. Try to access http://localhost:3000/account
3. Verify redirect to home with login modal
4. Login
5. Verify redirect back to /account

### 7. Run Automated Tests

```bash
# Run all tests
pnpm test

# Run auth-specific tests
pnpm test auth
```

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError: connection timed out`

**Solutions**:

1. Check IP whitelist in MongoDB Atlas Network Access
2. Verify connection string format
3. Check if password contains special characters (URL encode them)
4. Ensure cluster is active (not paused)

```bash
# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Email Not Sending

**Error**: `Error: Invalid login: 535-5.7.8 Username and Password not accepted`

**Solutions**:

1. Use App Password, not your regular Gmail password
2. Ensure 2FA is enabled on the Gmail account
3. Check SMTP_USER matches the account with App Password
4. Verify SMTP_PASS has no spaces

**Error**: `Error: connect ECONNREFUSED`

**Solutions**:

1. Check firewall settings
2. Verify SMTP_HOST and SMTP_PORT
3. Try port 465 with SSL instead of 587 with TLS

### Google OAuth Issues

**Error**: `redirect_uri_mismatch`

**Solutions**:

1. Verify redirect URI in Google Cloud Console matches exactly
2. Include/exclude trailing slash as configured
3. Check http vs https

**Error**: `Error 403: access_denied`

**Solutions**:

1. Add your email as a test user in OAuth consent screen
2. Ensure app is not in "Testing" mode for production

### JWT Issues

**Error**: `JsonWebTokenError: invalid signature`

**Solutions**:

1. Verify JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are set
2. Ensure secrets are at least 32 characters
3. Check for extra whitespace in secrets

### CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:

1. Ensure NEXT_PUBLIC_APP_URL matches your actual URL
2. Check API routes include proper CORS headers

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT secrets to new random values
- [ ] Update MongoDB connection string to production cluster
- [ ] Update Google OAuth redirect URIs to production domain
- [ ] Update NEXT_PUBLIC_APP_URL to production domain
- [ ] Enable "Production" mode in Google OAuth consent screen
- [ ] Restrict MongoDB Atlas IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Test all auth flows on staging environment

---

## Support

For issues or questions:

1. Check the [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) guide
2. Review the architecture document at `plans/AUTH_ARCHITECTURE.md`
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0
