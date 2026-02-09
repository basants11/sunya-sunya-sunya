#!/bin/bash

# Sunya Project Setup Script
# This script sets up the project for local development and deployment

set -e

echo "🚀 Setting up Sunya Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✓ Node.js $(node --version) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
    
    # Generate JWT secrets
    echo "🔑 Generating JWT secrets..."
    ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env.local with generated secrets
    sed -i.bak "s/your-secret-access-token-key-here-min-32-chars/$ACCESS_SECRET/" .env.local
    sed -i.bak "s/your-secret-refresh-token-key-here-min-32-chars/$REFRESH_SECRET/" .env.local
    rm -f .env.local.bak
    
    echo "✓ JWT secrets generated and added to .env.local"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Review your .env.local file and add any other required variables"
echo "2. Start development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 For deployment:"
echo "   - Read DEPLOYMENT.md for detailed instructions"
echo "   - Push to GitHub: git push origin main"
echo "   - Deploy to Vercel: vercel --prod"
echo ""
