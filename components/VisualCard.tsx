import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ReactNode } from 'react';

interface VisualCardProps extends React.ComponentProps<'div'> {
  imageSrc?: string;
  imageAlt?: string;
  imagePlacement?: 'top' | 'background' | 'side';
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function VisualCard({
  imageSrc,
  imageAlt = '',
  imagePlacement = 'top',
  title,
  description,
  children,
  className,
  ...props
}: VisualCardProps) {
  if (imagePlacement === 'background' && imageSrc) {
    return (
      <Card className={cn('relative overflow-hidden', className)} {...props}>
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.85) saturate(1.2) opacity(0.2)' }}
          />
        </div>
        <div className="relative z-10" style={{backgroundColor: 'var(--card)', opacity: 0.9, backdropFilter: 'blur(4px)'}}>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          {children && <CardContent>{children}</CardContent>}
        </div>
      </Card>
    );
  }

  if (imagePlacement === 'side' && imageSrc) {
    return (
      <Card className={cn('flex', className)} {...props}>
        <div className="w-1/3 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={200}
            height={200}
            className="object-cover w-full h-full rounded-l-xl"
            style={{ filter: 'brightness(0.95) saturate(1.1)' }}
          />
        </div>
        <div className="flex-1">
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          {children && <CardContent>{children}</CardContent>}
        </div>
      </Card>
    );
  }

  // Default to top placement
  return (
    <Card className={className} {...props}>
      {imageSrc && (
        <div className="px-6 pt-6">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={300}
            height={200}
            className="object-cover w-full h-48 rounded-lg"
            style={{ filter: 'brightness(0.95) saturate(1.1)' }}
          />
        </div>
      )}
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
