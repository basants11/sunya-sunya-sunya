import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GiftImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function GiftImage({
  src,
  alt,
  className,
  width = 300,
  height = 300,
  priority = false,
}: GiftImageProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        style={{
          filter: 'sepia(20%) brightness(1.1) saturate(1.2)',
        }}
        priority={priority}
      />
    </div>
  );
}