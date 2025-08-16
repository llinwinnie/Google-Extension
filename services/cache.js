// Cache service for optimizing API calls and reducing redundant network requests
class APICache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes default cache time
    this.maxSize = 100; // Maximum number of cached items
    
    // Load cached data from storage on initialization
    this.loadFromStorage();
    
    // Clean up expired cache entries periodically
    setInterval(() => this.cleanup(), 60000); // Clean up every minute
  }

  // Generate a cache key from URL and parameters
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  // Check if cached data exists and is still valid
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if cache has expired
    if (Date.now() - item.timestamp > item.maxAge) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cached data
  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp <= item.maxAge) {
      return item.data;
    }
    return null;
  }

  // Store data in cache
  set(key, data, maxAge = this.maxAge) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      maxAge: maxAge
    });
    
    // Save to storage for persistence across sessions
    this.saveToStorage();
  }

  // Remove specific cache entry
  delete(key) {
    this.cache.delete(key);
    this.saveToStorage();
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.saveToStorage();
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.maxAge) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  // Save cache to chrome storage for persistence
  saveToStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const cacheData = {};
      for (const [key, item] of this.cache.entries()) {
        cacheData[key] = item;
      }
      chrome.storage.local.set({ 'apiCache': cacheData });
    }
  }

  // Load cache from chrome storage
  loadFromStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['apiCache'], (result) => {
        if (result.apiCache) {
          for (const [key, item] of Object.entries(result.apiCache)) {
            this.cache.set(key, item);
          }
        }
      });
    }
  }

  // Cache-aware fetch function
  async fetchWithCache(url, options = {}, cacheOptions = {}) {
    const key = this.generateKey(url, options.params);
    const maxAge = cacheOptions.maxAge || this.maxAge;
    
    // Check cache first
    if (this.has(key)) {
      console.log('Cache hit for:', url);
      if (typeof performanceMonitor !== 'undefined') {
        performanceMonitor.recordCacheHit();
      }
      return this.get(key);
    }
    
    try {
      console.log('Cache miss for:', url);
      if (typeof performanceMonitor !== 'undefined') {
        performanceMonitor.recordCacheMiss();
      }
      
      const startTime = Date.now();
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      // Record API call performance
      if (typeof performanceMonitor !== 'undefined') {
        performanceMonitor.recordAPICall(responseTime);
      }
      
      // Cache the successful response
      this.set(key, data, maxAge);
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  // Cache-aware Chrome API calls
  async chromeAPIWithCache(apiMethod, params = {}, cacheOptions = {}) {
    const key = this.generateKey(apiMethod, params);
    const maxAge = cacheOptions.maxAge || this.maxAge;
    
    // Check cache first
    if (this.has(key)) {
      console.log('Cache hit for Chrome API:', apiMethod);
      if (typeof performanceMonitor !== 'undefined') {
        performanceMonitor.recordCacheHit();
      }
      return this.get(key);
    }
    
    return new Promise((resolve, reject) => {
      try {
        if (typeof performanceMonitor !== 'undefined') {
          performanceMonitor.recordCacheMiss();
        }
        
        const startTime = Date.now();
        // Call the Chrome API
        apiMethod(params, (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          
          const responseTime = Date.now() - startTime;
          
          // Record API call performance
          if (typeof performanceMonitor !== 'undefined') {
            performanceMonitor.recordAPICall(responseTime);
          }
          
          // Cache the successful response
          this.set(key, result, maxAge);
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Create global cache instance
const apiCache = new APICache();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APICache, apiCache };
}
