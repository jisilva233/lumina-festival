/**
 * Performance Monitoring Utility
 * Tracks and reports application performance metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private isEnabled: boolean = typeof window !== 'undefined' && 'PerformanceObserver' in window;

  /**
   * Initialize performance monitoring
   */
  public init(): void {
    if (!this.isEnabled) return;

    this.initializeNavigationTiming();
    this.initializeResourceTiming();
    this.initializeLongTasks();
  }

  /**
   * Measure custom operation performance
   */
  public measureOperation(
    operationName: string,
    operation: () => void | Promise<void>
  ): PerformanceMetric {
    const startTime = performance.now();

    try {
      operation();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;

      return this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Measure async operation performance
   */
  public async measureAsyncOperation(
    operationName: string,
    operation: () => Promise<void>
  ): Promise<PerformanceMetric> {
    const startTime = performance.now();

    try {
      await operation();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;

      return this.recordMetric({
        name: operationName,
        value: duration,
        unit: 'ms',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get navigation timing metrics
   */
  public getNavigationTiming(): Record<string, number> {
    if (!this.isEnabled) return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!navigation) return {};

    const nav = navigation as any;

    return {
      'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
      'TCP Connection': navigation.connectEnd - navigation.connectStart,
      'TLS Handshake': navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
      'Request Time': navigation.responseStart - navigation.requestStart,
      'Response Time': navigation.responseEnd - navigation.responseStart,
      'DOM Processing': nav.domComplete - nav.domInteractive,
      'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      'Page Load': navigation.loadEventEnd - navigation.loadEventStart,
      'Total Navigation': navigation.loadEventEnd - navigation.fetchStart
    };
  }

  /**
   * Get resource timing metrics
   */
  public getResourceTiming(): ResourceTiming[] {
    if (!this.isEnabled) return [];

    return performance
      .getEntriesByType('resource')
      .map((entry) => ({
        name: entry.name,
        duration: entry.duration,
        size: (entry as PerformanceResourceTiming).transferSize || 0,
        type: (entry as PerformanceResourceTiming).initiatorType || 'unknown'
      }));
  }

  /**
   * Get bundle size information
   */
  public getBundleSize(): Record<string, number> {
    if (!this.isEnabled) return {};

    const resources = this.getResourceTiming();
    const bundleSize: Record<string, number> = {};

    resources.forEach((resource) => {
      const ext = resource.name.split('.').pop() || 'unknown';
      bundleSize[ext] = (bundleSize[ext] || 0) + resource.size;
    });

    return bundleSize;
  }

  /**
   * Get all recorded metrics
   */
  public getAllMetrics(): Record<string, PerformanceMetric[]> {
    const result: Record<string, PerformanceMetric[]> = {};

    this.metrics.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * Get metric statistics
   */
  public getMetricStats(metricName: string): { avg: number; min: number; max: number; count: number } | null {
    const metrics = this.metrics.get(metricName);

    if (!metrics || metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  /**
   * Clear recorded metrics
   */
  public clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Report metrics to console
   */
  public reportMetrics(): void {
    const navigationTiming = this.getNavigationTiming();
    const bundleSize = this.getBundleSize();

    console.group('Performance Metrics');
    console.table(navigationTiming);
    console.table(bundleSize);

    this.metrics.forEach((metrics, name) => {
      const stats = this.getMetricStats(name);
      if (stats) {
        console.log(`${name}:`, stats);
      }
    });

    console.groupEnd();
  }

  /**
   * Report metrics to analytics service
   */
  public reportToAnalytics(
    analyticsCallback: (metrics: Record<string, PerformanceMetric[]>) => void
  ): void {
    analyticsCallback(this.getAllMetrics());
  }

  private recordMetric(metric: PerformanceMetric): PerformanceMetric {
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }

    this.metrics.get(metric.name)?.push(metric);
    return metric;
  }

  private initializeNavigationTiming(): void {
    if (document.readyState === 'complete') {
      this.reportNavigationTiming();
    } else {
      window.addEventListener('load', () => this.reportNavigationTiming());
    }
  }

  private reportNavigationTiming(): void {
    const timing = this.getNavigationTiming();
    Object.entries(timing).forEach(([name, value]) => {
      this.recordMetric({
        name: `Navigation: ${name}`,
        value,
        unit: 'ms',
        timestamp: Date.now()
      });
    });
  }

  private initializeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          this.recordMetric({
            name: `Resource: ${resource.name}`,
            value: resource.duration,
            unit: 'ms',
            timestamp: Date.now()
          });
        }
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    } catch (error) {
      console.warn('Resource timing observer failed:', error);
    }
  }

  private initializeLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: 'Long Task',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now()
          });
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);
    } catch (error) {
      console.warn('Long task observer not available:', error);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
