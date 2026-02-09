#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Generates secure random secrets for JWT authentication
 * Run: node generate-secrets.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('\n🔐 JWT Secret Generator\n');
console.log('Generating secure secrets for JWT authentication...\n');

const accessSecret = generateSecureSecret(32);
const refreshSecret = generateSecureSecret(32);

console.log('✓ Access Token Secret:');
console.log(`  ${accessSecret}\n`);

console.log('✓ Refresh Token Secret:');
console.log(`  ${refreshSecret}\n`);

console.log('📝 Add these to your .env.local file:\n');
console.log(`JWT_ACCESS_SECRET=${accessSecret}`);
console.log(`JWT_REFRESH_SECRET=${refreshSecret}\n`);

console.log('📋 For Vercel deployment, add these secrets to:');
console.log('   Project Settings → Environment Variables\n');

// Optionally create .env.local file
const envLocalPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  const envContent = `# JWT Secrets - Generated $(date)
JWT_ACCESS_SECRET=${accessSecret}
JWT_REFRESH_SECRET=${refreshSecret}
`;
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✓ Created .env.local with secrets\n');
} else {
  console.log('⚠️  .env.local already exists, not overwriting\n');
}

console.log('🚀 Ready to start development!');
console.log('   Run: npm run dev\n');
