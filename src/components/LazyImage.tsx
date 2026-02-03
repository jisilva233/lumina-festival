import React, { useState, useEffect, useRef } from 'react';
import { generateResponsiveImage, generateBlurPlaceholder } from '../utils/imageOptimizer';

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 * Optimized image component with lazy loading, blur placeholder, and responsive images
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  quality = 80,
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const responsiveImage = generateResponsiveImage(src, {
    maxWidth: width,
    maxHeight: height,
    quality
  });

  const blurPlaceholder = generateBlurPlaceholder(width, height);

  useEffect(() => {
    if (priority) {
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (error) {
    return (
      <div
        className={`bg-gray-300 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <img
          src={blurPlaceholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(10px)', transform: 'scale(1.1)' }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isLoaded ? responsiveImage.src : blurPlaceholder}
        srcSet={isLoaded ? responsiveImage.srcset : undefined}
        sizes={isLoaded ? responsiveImage.sizes : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default LazyImage;
