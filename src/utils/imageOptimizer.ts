/**
 * Image Optimization Utility
 * Handles responsive image generation, lazy loading, and format conversion
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
}

export interface ResponsiveImageSet {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
}

/**
 * Generate responsive image srcset with multiple breakpoints
 * @param imagePath - Original image path
 * @param options - Optimization options
 * @returns ResponsiveImageSet with srcset and sizes
 */
export function generateResponsiveImage(
  imagePath: string,
  options: ImageOptimizationOptions = {}
): ResponsiveImageSet {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 80,
    formats = ['webp', 'jpeg']
  } = options;

  // Define breakpoints: mobile, tablet, desktop
  const breakpoints = [
    { width: 480, dpi: 1 },
    { width: 768, dpi: 1 },
    { width: 1024, dpi: 2 },
    { width: 1920, dpi: 2 }
  ];

  // Generate srcset string
  const srcset = breakpoints
    .map(bp => `${imagePath}?w=${bp.width}&q=${quality}&f=webp ${bp.width}w`)
    .join(', ');

  // Define sizes for responsive loading
  const sizes = '(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px';

  return {
    src: `${imagePath}?w=${maxWidth}&q=${quality}&f=webp`,
    srcset,
    sizes,
    alt: ''
  };
}

/**
 * Get optimal image format based on browser support
 * @param imagePath - Original image path
 * @returns Image path with appropriate format parameter
 */
export function getOptimalImageFormat(imagePath: string): string {
  // Check browser support for modern formats
  const supportsWebP = canUseWebP();
  const supportsAVIF = canUseAVIF();

  if (supportsAVIF) {
    return `${imagePath}?f=avif`;
  }
  if (supportsWebP) {
    return `${imagePath}?f=webp`;
  }
  return imagePath;
}

/**
 * Check if browser supports WebP format
 */
function canUseWebP(): boolean {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    return canvas.toDataURL('image/webp').indexOf('webp') === 5;
  } catch {
    return false;
  }
}

/**
 * Check if browser supports AVIF format
 */
function canUseAVIF(): boolean {
  // AVIF support detection - simplified for broad compatibility
  // More thorough detection would use canvas or img tag testing
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return /Chrome|Edge|Opera/.test(userAgent);
}

/**
 * Generate picture element HTML for progressive image loading
 * @param imagePath - Original image path
 * @param alt - Alt text for accessibility
 * @param options - Optimization options
 * @returns Picture element HTML string
 */
export function generatePictureElement(
  imagePath: string,
  alt: string,
  options: ImageOptimizationOptions = {}
): string {
  const { maxWidth = 1200, quality = 80 } = options;

  const avifSrcset = `${imagePath}?w=480&q=${quality}&f=avif 480w, ${imagePath}?w=1024&q=${quality}&f=avif 1024w, ${imagePath}?w=${maxWidth}&q=${quality}&f=avif ${maxWidth}w`;
  const webpSrcset = `${imagePath}?w=480&q=${quality}&f=webp 480w, ${imagePath}?w=1024&q=${quality}&f=webp 1024w, ${imagePath}?w=${maxWidth}&q=${quality}&f=webp ${maxWidth}w`;
  const jpegSrcset = `${imagePath}?w=480&q=${quality}&f=jpeg 480w, ${imagePath}?w=1024&q=${quality}&f=jpeg 1024w, ${imagePath}?w=${maxWidth}&q=${quality}&f=jpeg ${maxWidth}w`;

  return `
    <picture>
      <source srcset="${avifSrcset}" type="image/avif" />
      <source srcset="${webpSrcset}" type="image/webp" />
      <img
        src="${imagePath}?w=${maxWidth}&q=${quality}&f=jpeg"
        srcset="${jpegSrcset}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `.trim();
}

/**
 * Calculate optimal image dimensions based on viewport and DPI
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Optimized dimensions
 */
export function calculateImageDimensions(
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: maxWidth, height: maxHeight };
  }

  const devicePixelRatio = window.devicePixelRatio || 1;
  const viewportWidth = window.innerWidth;

  // Calculate responsive width based on viewport
  let targetWidth = Math.min(viewportWidth, maxWidth);

  // Apply device pixel ratio for sharper display on high-DPI screens
  targetWidth = Math.ceil(targetWidth * devicePixelRatio);

  // Maintain aspect ratio
  const aspectRatio = maxWidth / maxHeight;
  const targetHeight = Math.ceil(targetWidth / aspectRatio);

  return {
    width: Math.min(targetWidth, maxWidth),
    height: Math.min(targetHeight, maxHeight)
  };
}

/**
 * Preload critical image for better perceived performance
 * @param imagePath - Image path
 * @param as - Resource type hint
 */
export function preloadImage(
  imagePath: string,
  as: 'image' = 'image'
): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = getOptimalImageFormat(imagePath);
  link.type = 'image/webp';

  document.head.appendChild(link);
}

/**
 * Generate blur placeholder for progressive image loading
 * @param width - Image width
 * @param height - Image height
 * @param color - Base color (hex)
 * @returns Data URI of placeholder
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#31326f'
): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
}
