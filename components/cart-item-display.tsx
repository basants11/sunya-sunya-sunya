/**
 * Cart Item Display Component
 * Displays individual cart items with luxury styling and smooth animations
 */

'use client';

import { useCart } from '@/lib/cart/use-cart';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';

export interface CartItemDisplayProps {
  productId: number;
  grams: number;
  fruitName: string;
  onRemove?: (productId: number) => void;
}

/**
 * Get fruit icon based on fruit name
 */
function getFruitIcon(fruitName: string): string {
  const lowerName = fruitName.toLowerCase();
  
  if (lowerName.includes('mango')) return '🥭';
  if (lowerName.includes('apple')) return '🍎';
  if (lowerName.includes('banana')) return '🍌';
  if (lowerName.includes('orange')) return '🍊';
  if (lowerName.includes('strawberry')) return '🍓';
  if (lowerName.includes('kiwi')) return '🥝';
  if (lowerName.includes('pineapple')) return '🍍';
  if (lowerName.includes('grape')) return '🍇';
  if (lowerName.includes('cherry')) return '🍒';
  if (lowerName.includes('peach')) return '🍑';
  if (lowerName.includes('watermelon')) return '🍉';
  if (lowerName.includes('lemon')) return '🍋';
  if (lowerName.includes('pear')) return '🍐';
  if (lowerName.includes('plum')) return '🍑';
  if (lowerName.includes('blueberry')) return '🫐';
  if (lowerName.includes('cranberry')) return '🫐';
  if (lowerName.includes('dragon')) return '🐉';
  if (lowerName.includes('papaya')) return '🍈';
  if (lowerName.includes('cashew')) return '🥜';
  if (lowerName.includes('almond')) return '🥜';
  
  return '🍎'; // Default apple icon
}

/**
 * Cart item display component
 */
export function CartItemDisplay({
  productId,
  grams,
  fruitName,
  onRemove,
}: CartItemDisplayProps) {
  const { removeItem } = useCart();
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = React.useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(productId);
      onRemove?.(productId);
    }, 300);
  }, [productId, removeItem, onRemove]);

  const fruitIcon = getFruitIcon(fruitName);

  return (
    <AnimatePresence mode="wait">
      {!isRemoving && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="group relative flex items-center gap-4 p-4 bg-background rounded-xl border border-border/50 hover:border-border transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {/* Fruit Icon */}
          <motion.div
            className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 flex items-center justify-center text-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {fruitIcon}
          </motion.div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <motion.h3
              className="text-sm font-semibold text-foreground truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {fruitName}
            </motion.h3>
            <motion.p
              className="text-xs text-muted-foreground mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {grams}g
            </motion.p>
          </div>

          {/* Remove Button */}
          <motion.button
            onClick={handleRemove}
            className="flex-shrink-0 p-2 rounded-full hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label={`Remove ${fruitName} from cart`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {/* Subtle gradient border on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 pointer-events-none"
            initial={false}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Cart items list component
 */
export interface CartItemsListProps {
  items: Array<{
    productId: number;
    grams: number;
    fruitName: string;
  }>;
  onRemove?: (productId: number) => void;
}

export function CartItemsList({ items, onRemove }: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4"
      >
        <motion.div
          className="text-4xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🛒
        </motion.div>
        <p className="text-sm text-muted-foreground">Your cart is empty</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <CartItemDisplay
              productId={item.productId}
              grams={item.grams}
              fruitName={item.fruitName}
              onRemove={onRemove}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
