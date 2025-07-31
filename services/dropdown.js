$(document).ready(() => {
  console.log('Dropdown script loaded');

  // Logo dropdown functionality - this handles the logo click
  const logoDropdown = $('#logoDropdown');
  const logoTrigger = $('.logo-dropdown-trigger');

  // Toggle dropdown on logo click - shows/hides the menu
  logoTrigger.on('click', (e) => {
    e.stopPropagation();
    logoDropdown.toggleClass('show');
  });

  // Close dropdown when clicking outside - prevents it from staying open
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.logo-container').length) {
      logoDropdown.removeClass('show');
    }
  });

  // Handle dropdown item clicks - opens the selected widget
  $('.dropdown-item').on('click', (e) => {
    e.stopPropagation();
    const widgetType = $(e.currentTarget).data('widget');
    openWidget(widgetType);
    logoDropdown.removeClass('show');
  });

  // Widget management - this opens the widgets in the center of the screen
  function openWidget(widgetType) {
    // Close all widgets first so only one is open at a time
    $('.widget-panel').removeClass('show').hide();
    
    // Open the selected widget
    const widgetPanel = $(`#${widgetType}Panel`);
    if (widgetPanel.length) {
      widgetPanel.addClass('show').show();
      
      // Position the widget in the center of the screen
      const windowWidth = $(window).width();
      const windowHeight = $(window).height();
      const panelWidth = widgetPanel.outerWidth();
      const panelHeight = widgetPanel.outerHeight();
      
      const left = (windowWidth - panelWidth) / 2;
      const top = (windowHeight - panelHeight) / 2;
      
      widgetPanel.css({
        left: left + 'px',
        top: top + 'px'
      });
    }
  }

  // Close widget functionality - the X button on each widget
  $('.close-btn').on('click', (e) => {
    const panelType = $(e.currentTarget).data('panel');
    $(`#${panelType}Panel`).removeClass('show').hide();
  });

  // Close widgets when clicking outside - click anywhere to close
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.widget-panel').length && !$(e.target).closest('.logo-container').length) {
      $('.widget-panel').removeClass('show').hide();
    }
  });

  // Search functionality - handles the main search bar
  $('#searchBox').on('keypress', (e) => {
    if (e.which === 13) { // Enter key
      const query = $('#searchBox').val().trim();
      if (query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
      }
    }
  });

  // Search icons functionality - voice search and Google Lens
  $('.search-icon-right').on('click', () => {
    // Voice search functionality (placeholder)
    console.log('Voice search clicked');
  });

  $('.search-icon-lens').on('click', () => {
    // Google Lens functionality (placeholder)
    console.log('Google Lens clicked');
  });

  // Add shortcut functionality - the + button in shortcuts
  $('#addShortcut').on('click', (e) => {
    e.preventDefault();
    // Placeholder for add shortcut functionality
    console.log('Add shortcut clicked');
  });

  // Customize Chrome button functionality - bottom right button
  $('.customize-btn').on('click', () => {
    // Placeholder for customize functionality
    console.log('Customize Chrome clicked');
  });

  // Experiments functionality - the beaker icon
  $('#experiments').on('click', () => {
    chrome.tabs.create({ url: 'chrome://flags/' });
  });

  // Tab items functionality - make the recent tabs clickable
  $('.tab-item').on('click', (e) => {
    const url = $(e.currentTarget).data('url');
    const title = $(e.currentTarget).data('title');
    
    if (url) {
      // Open the URL in a new tab - just like the original Google new tab
      chrome.tabs.create({ url: url });
      console.log('Opening tab:', title, 'at', url);
    }
  });

  // Load real recent tabs from Chrome history - this replaces the static content
  // Add a small delay to ensure extension is fully loaded
  setTimeout(() => {
    loadRecentTabs();
  }, 1000);

  function loadRecentTabs() {
    console.log('Loading recent tabs...');
    
    // Check if chrome.history is available - try multiple ways
    if (typeof chrome === 'undefined' || !chrome.history) {
      console.error('Chrome history API not available');
      showDefaultTabs();
      return;
    }

    // Set a timeout in case the API call takes too long
    const timeout = setTimeout(() => {
      console.log('History API timeout - showing default tabs');
      showDefaultTabs();
    }, 3000); // 3 second timeout

    try {
      // Get recent history items from Chrome
      chrome.history.search({
        text: '', // Empty to get all recent visits
        maxResults: 6, // Show 6 recent tabs
        startTime: Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
      }, (historyItems) => {
        clearTimeout(timeout); // Clear timeout since we got a response
        console.log('History search callback called');
        
        if (chrome.runtime.lastError) {
          console.error('History search error:', chrome.runtime.lastError);
          showDefaultTabs();
          return;
        }
        
        console.log('Found recent tabs:', historyItems);
        
        if (historyItems && historyItems.length > 0) {
          // Clear existing static content
          $('.tabs-content').empty();
          
          // Add real recent tabs
          historyItems.forEach((item, index) => {
            const domain = getDomainFromUrl(item.url);
            const icon = getFaviconForDomain(domain);
            const timeAgo = getTimeAgo(item.lastVisitTime);
            
            const tabHtml = `
              <div class="tab-item" data-url="${item.url}" data-title="${item.title}">
                <div class="tab-icon">${icon}</div>
                <div class="tab-info">
                  <div class="tab-title">${item.title}</div>
                  <div class="tab-url">${domain}</div>
                  <div class="tab-time">You visited ${timeAgo}</div>
                </div>
              </div>
            `;
            
            $('.tabs-content').append(tabHtml);
          });
          
          // Re-bind click events for new tab items
          $('.tab-item').off('click').on('click', (e) => {
            const url = $(e.currentTarget).data('url');
            const title = $(e.currentTarget).data('title');
            
            if (url) {
              chrome.tabs.create({ url: url });
              console.log('Opening real tab:', title, 'at', url);
            }
          });
        } else {
          console.log('No history items found');
          showDefaultTabs();
        }
      });
    } catch (error) {
      console.error('Error calling chrome.history.search:', error);
      clearTimeout(timeout);
      showDefaultTabs();
    }
  }

  // Fallback function to show default tabs if history API fails
  function showDefaultTabs() {
    console.log('Showing default tabs as fallback');
    const defaultTabs = [
      {
        url: 'https://www.google.com/search?q=chrome+extension+development',
        title: 'Chrome Extension Development - Google Search',
        domain: 'google.com',
        icon: 'G',
        timeAgo: '2 hours ago'
      },
      {
        url: 'https://developer.chrome.com/docs/extensions/',
        title: 'Chrome Extensions - Chrome Developers',
        domain: 'developer.chrome.com',
        icon: '🔧',
        timeAgo: '3 hours ago'
      },
      {
        url: 'https://github.com/',
        title: 'GitHub: Let\'s build from here',
        domain: 'github.com',
        icon: '🐙',
        timeAgo: '4 hours ago'
      }
    ];

    $('.tabs-content').empty();
    
    defaultTabs.forEach(tab => {
      const tabHtml = `
        <div class="tab-item" data-url="${tab.url}" data-title="${tab.title}">
          <div class="tab-icon">${tab.icon}</div>
          <div class="tab-info">
            <div class="tab-title">${tab.title}</div>
            <div class="tab-url">${tab.domain}</div>
            <div class="tab-time">You visited ${tab.timeAgo}</div>
          </div>
        </div>
      `;
      
      $('.tabs-content').append(tabHtml);
    });

    // Re-bind click events
    $('.tab-item').off('click').on('click', (e) => {
      const url = $(e.currentTarget).data('url');
      const title = $(e.currentTarget).data('title');
      
      if (url) {
        chrome.tabs.create({ url: url });
        console.log('Opening default tab:', title, 'at', url);
      }
    });
  }

  // Helper function to get domain from URL
  function getDomainFromUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return 'unknown';
    }
  }

  // Helper function to get favicon/icon for domain
  function getFaviconForDomain(domain) {
    // Simple mapping for common domains
    const domainIcons = {
      'google.com': 'G',
      'youtube.com': '▶',
      'github.com': '🐙',
      'stackoverflow.com': '📚',
      'reddit.com': '🤖',
      'twitter.com': '🐦',
      'facebook.com': '📘',
      'instagram.com': '📷',
      'linkedin.com': '💼',
      'amazon.com': '📦',
      'netflix.com': '🎬',
      'spotify.com': '🎵'
    };
    
    return domainIcons[domain] || domain.charAt(0).toUpperCase();
  }

  // Helper function to get time ago string
  function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  console.log('Dropdown events bound successfully');
}); 