import React, { useEffect, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  priority = false,
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-white text-emerald-800 p-4 text-center"
        role="img"
        aria-label={alt}
      >
        <ShoppingBasket className="w-8 h-8 text-emerald-700/70 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-emerald-900/80 line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
