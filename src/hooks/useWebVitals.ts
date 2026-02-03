import { useEffect } from 'react';

export interface WebVitalsMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Custom hook for measuring Core Web Vitals
 * Reports LCP, FID, and CLS metrics
 */
export function useWebVitals(
  onMetric?: (metric: WebVitalsMetrics) => void
): void {
  useEffect(() => {
    // Report Web Vitals using web-vitals library if available
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Largest Contentful Paint
        getLCP((metric: any) => {
          const rating = metric.value < 2500 ? 'good' : metric.value < 4000 ? 'needs-improvement' : 'poor';
          onMetric?.({
            name: 'LCP',
            value: metric.value,
            rating,
            delta: metric.delta,
            id: metric.id
          });
        });

        // First Input Delay
        getFID((metric: any) => {
          const rating = metric.value < 100 ? 'good' : metric.value < 300 ? 'needs-improvement' : 'poor';
          onMetric?.({
            name: 'FID',
            value: metric.value,
            rating,
            delta: metric.delta,
            id: metric.id
          });
        });

        // Cumulative Layout Shift
        getCLS((metric: any) => {
          const rating = metric.value < 0.1 ? 'good' : metric.value < 0.25 ? 'needs-improvement' : 'poor';
          onMetric?.({
            name: 'CLS',
            value: metric.value,
            rating,
            delta: metric.delta,
            id: metric.id
          });
        });

        // First Contentful Paint
        getFCP((metric: any) => {
          const rating = metric.value < 1800 ? 'good' : metric.value < 3000 ? 'needs-improvement' : 'poor';
          onMetric?.({
            name: 'FCP',
            value: metric.value,
            rating,
            delta: metric.delta,
            id: metric.id
          });
        });

        // Time to First Byte
        getTTFB((metric: any) => {
          const rating = metric.value < 600 ? 'good' : metric.value < 1200 ? 'needs-improvement' : 'poor';
          onMetric?.({
            name: 'TTFB',
            value: metric.value,
            rating,
            delta: metric.delta,
            id: metric.id
          });
        });
      }).catch((error) => {
        console.warn('Failed to import web-vitals:', error);
      });
    } catch (error) {
      console.warn('Web Vitals not available:', error);
    }
  }, [onMetric]);
}

/**
 * Alternative: Manual Web Vitals measurement
 * Useful when web-vitals library is not available
 */
export function useManualWebVitals(
  onMetric?: (metric: WebVitalsMetrics) => void
): void {
  useEffect(() => {
    // Measure Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          const value = lastEntry.renderTime || lastEntry.loadTime || 0;

          onMetric?.({
            name: 'LCP',
            value,
            rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor'
          });
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const e = entry as any;
            if (!e.hadRecentInput) {
              clsValue += e.value || 0;
              onMetric?.({
                name: 'CLS',
                value: clsValue,
                rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
              });
            }
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance Observer not available:', error);
        return;
      }
    }
  }, [onMetric]);
}
