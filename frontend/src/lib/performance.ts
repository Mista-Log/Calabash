/**
 * Performance Monitoring for Calabash
 * Tracks Core Web Vitals and custom metrics
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: 'navigate' | 'reload' | 'back-forward-cache' | 'restore';
}

// Thresholds for Core Web Vitals
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: { good: 2500, needsImprovement: 4000 },
  
  // First Input Delay (FID)
  FID: { good: 100, needsImprovement: 300 },
  
  // Cumulative Layout Shift (CLS)
  CLS: { good: 0.1, needsImprovement: 0.25 },
  
  // First Contentful Paint (FCP)
  FCP: { good: 1800, needsImprovement: 3000 },
  
  // Time to First Byte (TTFB)
  TTFB: { good: 800, needsImprovement: 1800 },
  
  // Interaction to Next Paint (INP)
  INP: { good: 200, needsImprovement: 500 },
};

/**
 * Report web vitals to analytics endpoint
 */
export function reportWebVitals(onPerfEntry?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;

  // Import web-vitals dynamically to avoid bundle size impact
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS((metric: any) => {
      const rating = getRating(metric.value, WEB_VITALS_THRESHOLDS.CLS);
      logMetric({ ...metric, rating } as WebVitalsMetric & { rating: string });
      onPerfEntry?.({ ...metric, rating } as WebVitalsMetric & { rating: string });
    });

    onFCP((metric: any) => {
      const rating = getRating(metric.value, WEB_VITALS_THRESHOLDS.FCP);
      logMetric({ ...metric, rating } as WebVitalsMetric & { rating: string });
      onPerfEntry?.({ ...metric, rating } as WebVitalsMetric & { rating: string });
    });

    onLCP((metric: any) => {
      const rating = getRating(metric.value, WEB_VITALS_THRESHOLDS.LCP);
      logMetric({ ...metric, rating } as WebVitalsMetric & { rating: string });
      onPerfEntry?.({ ...metric, rating } as WebVitalsMetric & { rating: string });
    });

    onTTFB((metric: any) => {
      const rating = getRating(metric.value, WEB_VITALS_THRESHOLDS.TTFB);
      logMetric({ ...metric, rating } as WebVitalsMetric & { rating: string });
      onPerfEntry?.({ ...metric, rating } as WebVitalsMetric & { rating: string });
    });

    onINP((metric: any) => {
      const rating = getRating(metric.value, WEB_VITALS_THRESHOLDS.INP);
      logMetric({ ...metric, rating } as WebVitalsMetric & { rating: string });
      onPerfEntry?.({ ...metric, rating } as WebVitalsMetric & { rating: string });
    });
  }).catch(() => {
    // Web vitals not available, skip monitoring
  });
}

/**
 * Get rating based on threshold
 */
function getRating(
  value: number,
  thresholds: { good: number; needsImprovement: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Log metric to console (development) or analytics (production)
 */
function logMetric(metric: WebVitalsMetric & { rating: string }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value.toFixed(2), metric.rating);
    return;
  }

  // In production, send to analytics endpoint
  // Uncomment when analytics endpoint is available
  // fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     ...metric,
  //     timestamp: Date.now(),
  //     url: window.location.href,
  //     userAgent: navigator.userAgent,
  //   }),
  // }).catch(() => {});
}

/**
 * Measure custom performance metrics
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const startTime = performance.now();
  const result = fn();
  const duration = performance.now() - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Measure async performance metrics
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  const result = await fn();
  const duration = performance.now() - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Track memory usage (Chrome/Edge only)
 */
export function getMemoryUsage(): { 
  usedJSHeapSize: number; 
  totalJSHeapSize: number;
  limit: number;
} | null {
  if (typeof performance === 'undefined' || !(performance as any).memory) {
    return null;
  }
  
  const memory = (performance as any).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    limit: memory.limit,
  };
}

/**
 * Log memory usage (development only)
 */
export function logMemoryUsage(label?: string) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const memory = getMemoryUsage();
  if (!memory) return;
  
  const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
  const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
  
  console.log(
    `[Memory]${label ? ` ${label}` : ''} Used: ${usedMB}MB / ${totalMB}MB`
  );
}

/**
 * Performance observer for long tasks
 */
export function observeLongTasks(callback?: (duration: number) => void) {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Long Task]', entry.duration.toFixed(2), 'ms');
        }
        callback?.(entry.duration);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
    return () => observer.disconnect();
  } catch {
    // Long task observation not supported
    return () => {};
  }
}

/**
 * Resource timing observer for tracking asset load times
 */
export function observeResourceTiming(callback?: (resource: PerformanceResourceTiming) => void) {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        callback?.(entry as PerformanceResourceTiming);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}
