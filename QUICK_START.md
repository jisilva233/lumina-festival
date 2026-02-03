# Quick Start Guide - Performance Optimized Build

## TL;DR - Get Started in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Preview the optimized build
npm run preview
```

---

## Common Commands

```bash
# Development with hot reload (port 3000)
npm run dev

# Production build (optimized)
npm run build

# Preview production build locally
npm run preview

# Check TypeScript for errors
npm run typecheck

# Analyze bundle composition
npm run analyze

# Run tests
npm run test

# Run linting
npm run lint
```

---

## What's Been Optimized

### ✅ Images
- Automatic lazy loading
- Responsive breakpoints (480px, 768px, 1024px)
- Format negotiation (AVIF → WebP → JPEG)
- Blur placeholders for perceived performance
- Use `<LazyImage>` component instead of `<img>`

### ✅ JavaScript
- Code split by vendor (React, icons, AI, animation)
- Production minification
- Tree shaking enabled
- Lazy loading for non-critical components

### ✅ CSS
- Production minification
- Tailwind CSS optimized (via CDN)
- Font preload hints

### ✅ Monitoring
- Web Vitals tracking (LCP, FID, CLS, etc.)
- Performance metrics collection
- Long task detection

### ✅ Build Output
- Brotli compression (preferred)
- Gzip compression (fallback)
- Source maps disabled in production
- Console/debugger removed in production

---

## Using New Components

### LazyImage Component

```typescript
import { LazyImage } from '@/src/components/LazyImage';

// Automatically optimized with lazy loading
<LazyImage
  src="/images/event.jpg"
  alt="Event description"
  width={800}
  height={600}
/>

// With options
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={800}
  quality={85}
  priority={true}  // For above-fold images
/>
```

### Web Vitals Monitoring

```typescript
import { useWebVitals } from '@/src/hooks/useWebVitals';

function App() {
  useWebVitals((metric) => {
    console.log(`${metric.name}: ${metric.value.toFixed(2)}ms`);
  });

  return <div>{/* Your app */}</div>;
}
```

### Performance Monitor

```typescript
import { performanceMonitor } from '@/src/utils/performanceMonitor';

// Measure custom operations
const result = await performanceMonitor.measureAsyncOperation(
  'API Call',
  async () => {
    return fetch('/api/events').then(r => r.json());
  }
);

// Report all metrics
performanceMonitor.reportMetrics();
```

---

## Build Output Structure

After running `npm run build`, your `dist/` folder will contain:

```
dist/
├── js/
│   ├── vendor.[hash].js          # React, React-DOM
│   ├── icons.[hash].js           # Lucide React
│   ├── ai.[hash].js              # Google GenAI
│   ├── animation.[hash].js       # Framer Motion
│   ├── [name].[hash].js          # Your code
│   ├── *.js.gz                   # Gzip compressed
│   └── *.js.br                   # Brotli compressed
├── css/
│   ├── style.[hash].css
│   ├── *.css.gz
│   └── *.css.br
├── images/
│   └── [optimized images]
├── fonts/
│   └── [preloaded fonts]
└── index.html
```

---

## Performance Audit

### Lighthouse Audit (Recommended)

```bash
# Install Lighthouse globally (one time)
npm install -g lighthouse

# Run audit on development server
npm run dev
# In another terminal:
lighthouse http://localhost:3000 --view

# Run audit on production preview
npm run preview
# In another terminal:
lighthouse http://localhost:4173 --view
```

### Expected Scores

With all optimizations:
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 90+

### Bundle Size Analysis

```bash
# Generate interactive bundle visualization
npm run analyze
```

---

## Environment Setup

### Required Environment Variables

Create `.env.local` (not committed):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_MERCADO_PAGO_PUBLIC_KEY=your_mp_key
GEMINI_API_KEY=your_gemini_key
```

See `.env.example` for all variables.

---

## Troubleshooting

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styles not loading
```bash
# Clear dist folder
rm -rf dist
npm run build
```

### Performance issues in development
```bash
# Restart dev server
npm run dev
```

### Can't measure performance
```bash
# Check your browser supports Web Vitals API
# Use Chrome/Edge (latest versions)
# Check browser console for errors
```

---

## Performance Targets

### Core Web Vitals (Google's metrics)
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size Goals
- **Total JavaScript:** < 200KB gzipped
- **Total CSS:** < 50KB gzipped
- **All assets:** < 300KB gzipped

### Load Time Goals
- **First Paint:** < 1.8s
- **Page Load:** < 3s

---

## Next Steps

1. **Read full documentation:**
   - `PERFORMANCE.md` - Detailed optimization guide
   - `DATABASE_OPTIMIZATION.md` - Database improvements
   - `IMPLEMENTATION_SUMMARY.md` - Complete overview

2. **Deploy to production:**
   - Run `npm run build`
   - Deploy `dist/` folder to CDN
   - Enable gzip/brotli compression on server

3. **Monitor in production:**
   - Set up analytics for Web Vitals
   - Configure performance budgets
   - Monitor Core Web Vitals dashboard

4. **Optimize database:**
   - Follow DATABASE_OPTIMIZATION.md recommendations
   - Create recommended indexes
   - Implement query caching

---

## Support & Resources

- [Vite Documentation](https://vitejs.dev/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Image Optimization Best Practices](https://web.dev/image-optimization/)
- [React Performance](https://react.dev/reference/react/lazy)

---

## Key Files to Know

- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings
- `App.tsx` - Main application with optimizations
- `src/components/LazyImage.tsx` - Optimized image component
- `src/hooks/useWebVitals.ts` - Performance tracking
- `src/utils/performanceMonitor.ts` - Metrics collection
- `lighthouse.config.js` - Lighthouse CI settings

---

**Last Updated:** January 31, 2025
**Version:** 1.0
**Status:** Production Ready ✅
