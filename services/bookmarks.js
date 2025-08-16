$(document).ready(() => {
  console.log('Bookmarks script loaded');

  // Load bookmarks when the page loads
  loadBookmarks();

  // Handle "All Bookmarks" click
  $('.bookmarks-overflow').on('click', () => {
    chrome.tabs.create({ url: 'chrome://bookmarks/' });
  });
});

function loadBookmarks() {
  // Use cached bookmarks data if available, otherwise fetch from Chrome API
  apiCache.chromeAPIWithCache(chrome.bookmarks.getTree, {}, { maxAge: 5 * 60 * 1000 }) // Cache bookmarks for 5 minutes
    .then((bookmarkTreeNodes) => {
      const bookmarks = [];
      
      // Extract bookmarks from the tree structure
      function extractBookmarks(nodes) {
        for (let node of nodes) {
          if (node.url) {
            // This is a bookmark
            bookmarks.push({
              title: node.title || 'Untitled',
              url: node.url,
              id: node.id
            });
          } else if (node.children) {
            // This is a folder, recurse into it
            extractBookmarks(node.children);
          }
        }
      }
      
      extractBookmarks(bookmarkTreeNodes);
      
      // Display bookmarks (limit to first 10 for space)
      displayBookmarks(bookmarks.slice(0, 10));
    })
    .catch((error) => {
      console.error('Error loading bookmarks:', error);
      // Show default bookmarks if API fails
      displayBookmarks([]);
    });
}

function displayBookmarks(bookmarks) {
  const container = $('.bookmarks-container');
  container.empty();
  
  if (bookmarks.length === 0) {
    // Show some default bookmarks if none exist
    const defaultBookmarks = [
      { title: 'Gmail', url: 'https://mail.google.com', icon: 'G' },
      { title: 'YouTube', url: 'https://youtube.com', icon: 'Y' },
      { title: 'Maps', url: 'https://maps.google.com', icon: 'M' },
      { title: 'Drive', url: 'https://drive.google.com', icon: 'D' }
    ];
    
    defaultBookmarks.forEach(bookmark => {
      const bookmarkElement = createBookmarkElement(bookmark);
      container.append(bookmarkElement);
    });
  } else {
    bookmarks.forEach(bookmark => {
      const bookmarkElement = createBookmarkElement(bookmark);
      container.append(bookmarkElement);
    });
  }
}

function createBookmarkElement(bookmark) {
  // Extract domain for icon
  let domain = '';
  let icon = '';
  
  try {
    const url = new URL(bookmark.url);
    domain = url.hostname.replace('www.', '');
    icon = domain.charAt(0).toUpperCase();
  } catch (e) {
    icon = 'B';
  }
  
  const element = $(`
    <a href="${bookmark.url}" class="bookmark-item" target="_blank">
      <div class="bookmark-icon">${icon}</div>
      <span class="bookmark-text">${bookmark.title}</span>
    </a>
  `);
  
  // Add click handler to open in new tab
  element.on('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: bookmark.url });
  });
  
  return element;
}

// Listen for bookmark changes
chrome.bookmarks.onCreated.addListener(() => {
  loadBookmarks();
});

chrome.bookmarks.onRemoved.addListener(() => {
  loadBookmarks();
});

chrome.bookmarks.onChanged.addListener(() => {
  loadBookmarks();
});

console.log('Bookmarks events bound successfully'); 