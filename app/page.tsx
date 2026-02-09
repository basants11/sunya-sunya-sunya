import { EnhancedCartWrapper } from '@/components/enhanced-cart-wrapper';
import { Hero } from '@/components/hero';
import { Newsletter } from '@/components/newsletter';
import { ProductShowcase } from '@/components/product-showcase';
import { Quality } from '@/components/quality';
import { SunyaBoldText } from '@/components/sunya-bold-text';

export default function Home() {
  return (
    <main>
      <div className='text-center py-8'>
        <h1 className='sr-only'>Welcome to Sunya</h1>
        <SunyaBoldText>Welcome to sunya</SunyaBoldText>
      </div>
      <div className="h-4" />
      <Hero />
      <ProductShowcase />
      <EnhancedCartWrapper />
      <Quality />
      <Newsletter />
    </main>
  );
}
