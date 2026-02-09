# Dynamic Website Transformation Plan for Sunya Dehydrated Fruits

## Overview
This plan outlines the transformation of the current static Next.js website into a dynamic, interactive e-commerce platform. The goal is to add user authentication, real-time features, database integration, and enhanced interactivity while preserving the original content and design.

## Current State Assessment
The website is built with Next.js 16, React 19, and Tailwind CSS. It features:
- Static product pages and components
- Client-side interactivity with React components
- No backend API or database integration
- Static content for products, reviews, and user interactions

Areas identified for dynamism:
- User login and account management
- Dynamic product inventory and pricing
- Real-time stock updates
- User reviews and ratings
- Order management and history
- Personalized recommendations

## Technology Stack Recommendations

### Frontend (Already in Place)
- **Next.js 16** with App Router
- **React 19** for component-based UI
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility

### Backend Additions
- **Next.js API Routes** (Node.js) for server-side logic
- **MongoDB** with Mongoose for flexible document-based data storage
- **NextAuth.js** for authentication (supports multiple providers)

### Real-Time Features
- **Socket.io** for real-time updates (stock, notifications)
- **Server-Sent Events** for simpler real-time needs

### Additional Libraries
- **Zod** for input validation (already included)
- **React Hook Form** for form handling (already included)
- **bcryptjs** for password hashing
- **jsonwebtoken** for session management

## Step-by-Step Implementation Guide

### Phase 1: Backend Infrastructure Setup

#### 1.1 Install Backend Dependencies
```bash
npm install mongoose mongodb next-auth @auth/mongodb-adapter bcryptjs jsonwebtoken socket.io socket.io-client
npm install -D @types/bcryptjs @types/jsonwebtoken
```

#### 1.2 Set Up Environment Variables
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/sunya
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
```

#### 1.3 Configure Database Connection
Create `lib/mongodb.ts`:
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
```

### Phase 2: Database Schema Design

#### 2.1 User Schema
Create `lib/models/User.ts`:
```typescript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

#### 2.2 Product Schema
Create `lib/models/Product.ts`:
```typescript
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
```

#### 2.3 Order Schema
Create `lib/models/Order.ts`:
```typescript
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
```

### Phase 3: Authentication System

#### 3.1 Configure NextAuth.js
Create `lib/auth.ts`:
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import User from './models/User';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
});
```

#### 3.2 Create Auth API Route
Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

#### 3.3 Create Registration API
Create `app/api/auth/register/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Phase 4: Dynamic Content Integration

#### 4.1 Products API
Create `app/api/products/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const products = await Product.find({ isActive: true });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const productData = await request.json();
    const product = new Product(productData);
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### 4.2 Update Product Showcase Component
Modify `components/product-showcase.tsx` to fetch from API:
```typescript
'use client';

import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <img src={product.images[0]} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <p>Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### Phase 5: Real-Time Features

#### 5.1 Set Up Socket.io Server
Create `lib/socket.ts`:
```typescript
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const initSocket = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-product-room', (productId) => {
      socket.join(`product-${productId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
```

#### 5.2 Socket API Route
Create `pages/api/socket.ts` (using pages router for socket):
```typescript
import { NextApiRequest } from 'next';
import { initSocket } from '@/lib/socket';
import { NextApiResponseServerIO } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    initSocket(res.socket.server);
    res.socket.server.io = initSocket(res.socket.server);
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
```

#### 5.3 Real-Time Stock Updates
Update product API to emit socket events:
```typescript
// In app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { stock } = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { stock, updatedAt: new Date() },
      { new: true }
    );

    // Emit real-time update
    if (global.io) {
      global.io.to(`product-${params.id}`).emit('stock-update', { productId: params.id, stock });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Phase 6: Security Best Practices

#### 6.1 Input Validation with Zod
Create validation schemas in `lib/validations.ts`:
```typescript
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
});
```

#### 6.2 Rate Limiting
Install `express-rate-limit` and configure:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export default limiter;
```

#### 6.3 HTTPS and Security Headers
Update `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Phase 7: Performance Optimization

#### 7.1 Implement Caching
Use Next.js caching for API routes:
```typescript
// In API routes
export const revalidate = 60; // Revalidate every 60 seconds

// Or use Redis for more advanced caching
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
```

#### 7.2 Lazy Loading and Code Splitting
Update components to use dynamic imports:
```typescript
import dynamic from 'next/dynamic';

const ProductShowcase = dynamic(() => import('@/components/product-showcase'), {
  loading: () => <div>Loading...</div>,
});
```

#### 7.3 Image Optimization
Ensure images are optimized with Next.js Image component:
```typescript
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  priority={index < 3} // Prioritize first 3 images
/>
```

### Phase 8: Mobile Responsiveness and Accessibility

#### 8.1 Responsive Design
Ensure Tailwind classes are mobile-first:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

#### 8.2 Accessibility Improvements
Add ARIA labels and semantic HTML:
```typescript
<button
  aria-label="Add to cart"
  className="btn-primary"
  onClick={handleAddToCart}
>
  <ShoppingCartIcon aria-hidden="true" />
  Add to Cart
</button>
```

#### 8.3 Touch-Friendly Interactions
Ensure buttons and links have adequate touch targets:
```css
.btn {
  min-height: 44px;
  min-width: 44px;
}
```

## Deployment and Maintenance

### 9.1 Environment Setup
- Set up MongoDB Atlas for production database
- Configure environment variables for production
- Set up Redis for caching (optional)

### 9.2 Monitoring and Analytics
- Implement error tracking with Sentry
- Add performance monitoring
- Set up analytics for user behavior

### 9.3 Backup and Recovery
- Regular database backups
- Implement data migration scripts
- Set up monitoring alerts

## Conclusion
This plan provides a comprehensive roadmap for transforming the static Sunya website into a dynamic, secure, and performant e-commerce platform. The phased approach ensures minimal disruption to existing functionality while gradually introducing advanced features.

Key benefits of this transformation:
- Enhanced user experience with personalization
- Real-time inventory management
- Secure user authentication and data protection
- Scalable architecture for future growth
- Improved performance and mobile experience

The implementation should be done incrementally, with thorough testing at each phase to ensure stability and security.