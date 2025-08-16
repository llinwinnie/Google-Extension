// Performance monitoring utility to track cache effectiveness and API performance
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    };
    
    // Load metrics from storage
    this.loadMetrics();
    
    // Save metrics periodically
    setInterval(() => this.saveMetrics(), 30000); // Save every 30 seconds
  }

  // Record a cache hit
  recordCacheHit() {
    this.metrics.cacheHits++;
    this.saveMetrics();
  }

  // Record a cache miss
  recordCacheMiss() {
    this.metrics.cacheMisses++;
    this.saveMetrics();
  }

  // Record API call with response time
  recordAPICall(responseTime) {
    this.metrics.apiCalls++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.apiCalls;
    this.saveMetrics();
  }

  // Get cache hit rate percentage
  getCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? Math.round((this.metrics.cacheHits / total) * 100) : 0;
  }

  // Get performance summary
  getPerformanceSummary() {
    return {
      cacheHitRate: this.getCacheHitRate(),
      totalRequests: this.metrics.cacheHits + this.metrics.cacheMisses,
      averageResponseTime: Math.round(this.metrics.averageResponseTime),
      cacheEfficiency: this.getCacheEfficiency()
    };
  }

  // Calculate cache efficiency (time saved vs time spent)
  getCacheEfficiency() {
    if (this.metrics.cacheHits === 0) return 0;
    
    // Estimate time saved from cache hits (assuming 50ms saved per hit)
    const timeSaved = this.metrics.cacheHits * 50;
    const timeSpent = this.metrics.totalResponseTime;
    
    return timeSpent > 0 ? Math.round((timeSaved / timeSpent) * 100) : 0;
  }

  // Save metrics to storage
  saveMetrics() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 'performanceMetrics': this.metrics });
    }
  }

  // Load metrics from storage
  loadMetrics() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['performanceMetrics'], (result) => {
        if (result.performanceMetrics) {
          this.metrics = { ...this.metrics, ...result.performanceMetrics };
        }
      });
    }
  }

  // Reset metrics
  resetMetrics() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    };
    this.saveMetrics();
  }

  // Log performance summary to console
  logPerformanceSummary() {
    const summary = this.getPerformanceSummary();
    console.log('🚀 Performance Summary:', summary);
    console.log(`📊 Cache Hit Rate: ${summary.cacheHitRate}%`);
    console.log(`⚡ Average Response Time: ${summary.averageResponseTime}ms`);
    console.log(`💾 Cache Efficiency: ${summary.cacheEfficiency}%`);
  }
}

// Create global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Log performance summary every 5 minutes
setInterval(() => {
  performanceMonitor.logPerformanceSummary();
}, 5 * 60 * 1000);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PerformanceMonitor, performanceMonitor };
}
