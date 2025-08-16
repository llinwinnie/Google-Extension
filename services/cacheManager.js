// Cache management widget for monitoring and controlling cache performance
class CacheManager {
  constructor() {
    this.isVisible = false;
    this.init();
  }

  init() {
    // Create cache manager widget
    this.createWidget();
    this.bindEvents();
    this.updateMetrics();
    
    // Update metrics every 30 seconds
    setInterval(() => this.updateMetrics(), 30000);
  }

  createWidget() {
    const widgetHtml = `
      <div class="widget-panel" id="cacheManagerPanel" style="display: none;">
        <div class="panel-header">
          <span>🚀 Cache Manager</span>
          <button class="close-btn" data-panel="cacheManager">×</button>
        </div>
        <div class="panel-body">
          <div class="cache-stats">
            <div class="stat-item">
              <span class="stat-label">Cache Hit Rate:</span>
              <span class="stat-value" id="cacheHitRate">-</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Requests:</span>
              <span class="stat-value" id="totalRequests">-</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg Response Time:</span>
              <span class="stat-value" id="avgResponseTime">-</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cache Efficiency:</span>
              <span class="stat-value" id="cacheEfficiency">-</span>
            </div>
          </div>
          
          <div class="cache-actions">
            <button id="clearCacheBtn" class="cache-btn">🗑️ Clear Cache</button>
            <button id="resetMetricsBtn" class="cache-btn">📊 Reset Metrics</button>
            <button id="refreshMetricsBtn" class="cache-btn">🔄 Refresh</button>
          </div>
          
          <div class="cache-info">
            <p><strong>Cache Benefits:</strong></p>
            <ul>
              <li>⚡ Faster API responses</li>
              <li>🌐 Reduced network requests</li>
              <li>💾 Lower bandwidth usage</li>
              <li>🔋 Better battery life</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Add to the page
    $('body').append(widgetHtml);
  }

  bindEvents() {
    // Clear cache button
    $(document).on('click', '#clearCacheBtn', () => {
      this.clearCache();
    });
    
    // Reset metrics button
    $(document).on('click', '#resetMetricsBtn', () => {
      this.resetMetrics();
    });
    
    // Refresh metrics button
    $(document).on('click', '#refreshMetricsBtn', () => {
      this.updateMetrics();
    });
  }

  updateMetrics() {
    if (typeof performanceMonitor !== 'undefined') {
      const summary = performanceMonitor.getPerformanceSummary();
      
      $('#cacheHitRate').text(`${summary.cacheHitRate}%`);
      $('#totalRequests').text(summary.totalRequests);
      $('#avgResponseTime').text(`${summary.averageResponseTime}ms`);
      $('#cacheEfficiency').text(`${summary.cacheEfficiency}%`);
      
      // Color code the hit rate
      const hitRateElement = $('#cacheHitRate');
      if (summary.cacheHitRate >= 80) {
        hitRateElement.css('color', '#4CAF50'); // Green
      } else if (summary.cacheHitRate >= 60) {
        hitRateElement.css('color', '#FF9800'); // Orange
      } else {
        hitRateElement.css('color', '#F44336'); // Red
      }
    }
  }

  clearCache() {
    if (typeof apiCache !== 'undefined') {
      apiCache.clear();
      console.log('Cache cleared successfully');
      
      // Show confirmation
      this.showNotification('Cache cleared successfully!', 'success');
      
      // Update metrics
      this.updateMetrics();
    }
  }

  resetMetrics() {
    if (typeof performanceMonitor !== 'undefined') {
      performanceMonitor.resetMetrics();
      console.log('Performance metrics reset');
      
      // Show confirmation
      this.showNotification('Performance metrics reset!', 'success');
      
      // Update metrics
      this.updateMetrics();
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = $(`
      <div class="cache-notification ${type}">
        ${message}
        <button class="notification-close">×</button>
      </div>
    `);
    
    // Add to page
    $('body').append(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.fadeOut(() => notification.remove());
    }, 3000);
    
    // Manual close button
    notification.find('.notification-close').on('click', () => {
      notification.fadeOut(() => notification.remove());
    });
  }

  show() {
    $('#cacheManagerPanel').addClass('show').show();
    this.isVisible = true;
    this.updateMetrics();
  }

  hide() {
    $('#cacheManagerPanel').removeClass('show').hide();
    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

// Create global cache manager instance
const cacheManager = new CacheManager();

// Add cache manager to dropdown menu
$(document).ready(() => {
  // Add cache manager item to dropdown
  const dropdownMenu = $('#logoDropdown');
  if (dropdownMenu.length) {
    const cacheItem = $('<div class="dropdown-item" data-widget="cacheManager">🚀 Cache Manager</div>');
    dropdownMenu.append(cacheItem);
  }
  
  // Handle cache manager widget opening
  $(document).on('click', '[data-widget="cacheManager"]', (e) => {
    e.stopPropagation();
    cacheManager.show();
    $('#logoDropdown').removeClass('show');
  });
  
  // Handle cache manager widget closing
  $(document).on('click', '[data-panel="cacheManager"]', () => {
    cacheManager.hide();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CacheManager, cacheManager };
}
