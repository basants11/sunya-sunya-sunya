# 🍈 Sunya - Premium Dehydrated Fruits

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue)

Premium dehydrated fruits with zero sugar, zero preservatives. Hand-selected, slow-dehydrated, export-grade quality from Nepal.

## ✨ Features

- 🛒 **Full E-Commerce**: Shopping cart, checkout, promo codes
- 🔐 **Authentication**: JWT-based user auth with Google OAuth
- 📱 **Responsive**: Mobile-first design
- ⚡ **Fast**: Next.js 16 with Turbopack
- 🎨 **Modern UI**: Shadcn/UI + Tailwind CSS
- 🌙 **Dark Mode**: Built-in support
- 💳 **Payments**: Khalti, eSewa, bank transfer support
- 📊 **Notifications**: Real-time cart and order updates
- ♿ **Accessible**: WCAG compliant

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Installation

#### Option 1: Automatic Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

This will:
- Install all dependencies
- Generate JWT secrets
- Create `.env.local` with configuration
- Display next steps

#### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add the generated secrets to .env.local
# JWT_ACCESS_SECRET=<secret-1>
# JWT_REFRESH_SECRET=<secret-2>

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
sunya/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── api/               # API routes (auth, checkout, etc.)
│   └── products/          # Product pages
├── components/            # React components
│   ├── cart-*            # Cart-related components
│   ├── auth/             # Authentication components
│   ├── header.tsx        # Main header
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── auth/             # Authentication logic
│   ├── cart/             # Cart state management
│   └── ...
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
├── styles/               # Global styles
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Build & Deploy
npm run build            # Build for production
npm start                # Start production server

# Quality checks
npm run lint             # Run ESLint
npm test                 # Run tests with Vitest
```

## 🔐 Environment Variables

Required variables for production:

```env
# JWT Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-secret-here

# Optional: Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# API Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

See `.env.example` for all available variables.

## 📦 Dependencies

### Core
- **Next.js 16**: React framework with SSR
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS

### UI & Components
- **shadcn/ui**: Pre-built components
- **Radix UI**: Headless UI components
- **Framer Motion**: Animations
- **Lucide React**: Icons

### State & Data
- **zustand**: Lightweight state management
- **Zod**: Schema validation
- **React Hook Form**: Form management

### Authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing

### Other
- **Sonner**: Toast notifications
- **date-fns**: Date manipulation
- **clsx**: Class name utility

## 🚀 Deployment

### Deploy to Vercel (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick start:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Other Platforms

The project is compatible with:
- Netlify
- GitHub Pages (static export only)
- Self-hosted (Docker, traditional servers)

## 🔒 Security

- JWT tokens for authentication
- Bcrypt password hashing
- HTTPS-only deployment
- Environment variable protection
- CSRF protection enabled
- XSS prevention with React escaping
- Input validation with Zod schemas

## 🧪 Testing

Run tests with:

```bash
npm test
```

Tests are written with Vitest and React Testing Library.

## 📊 Performance

- **Turbopack**: 5-10x faster builds
- **React Server Components**: Reduced JavaScript bundle
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based splitting
- **CSS Optimization**: Tailwind CSS purging

Lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary to Sunya.

## 🆘 Troubleshooting

### "Missing required environment variables"

**Solution**: Generate and add JWT secrets to `.env.local`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "useCart must be used within a CartProvider"

**Solution**: This is handled by wrapper components. Refresh the page if needed.

### Build fails on Vercel

**Solution**: 

1. Check Vercel logs for specific errors
2. Verify all environment variables are set
3. Try clearing build cache and redeploying:
   ```bash
   vercel env pull  # Pull latest env vars
   vercel --prod    # Redeploy
   ```

For more issues, see [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting).

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## 👥 Support

For issues and questions:

1. Check existing issues on GitHub
2. Review documentation and troubleshooting
3. Create a detailed issue with reproduction steps
4. Contact support team

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Wishlist feature
- [ ] Customer reviews
- [ ] Inventory management
- [ ] Subscription orders

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Hosting by [Vercel](https://vercel.com)

---

**Made with ❤️ for Sunya**
