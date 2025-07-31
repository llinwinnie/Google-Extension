$(document).ready(() => {
  console.log('Shortcuts script loaded');

  // Handle add shortcut button click
  $('#addShortcut').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAddShortcutDialog();
  });

  // Close dialog when clicking outside
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.shortcut-dialog').length && 
        !$(e.target).closest('#addShortcut').length) {
      $('.shortcut-dialog').remove();
    }
  });
});

function openAddShortcutDialog() {
  // Remove any existing dialogs
  $('.shortcut-dialog').remove();
  
  // Create add shortcut dialog
  const dialog = $(`
    <div class="shortcut-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #3c4043; border-radius: 12px; padding: 24px; min-width: 400px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <span style="color: #e8eaed; font-size: 18px; font-weight: 500;">Add shortcut</span>
        <button class="close-shortcut" style="background: none; border: none; color: #9aa0a6; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="color: #e8eaed; font-size: 14px; display: block; margin-bottom: 8px;">Name</label>
        <input type="text" id="shortcutName" placeholder="Enter shortcut name" style="width: 100%; background: #5f6368; border: 1px solid #5f6368; color: #e8eaed; padding: 12px; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 16px;">
        
        <label style="color: #e8eaed; font-size: 14px; display: block; margin-bottom: 8px;">URL</label>
        <input type="url" id="shortcutUrl" placeholder="https://example.com" style="width: 100%; background: #5f6368; border: 1px solid #5f6368; color: #e8eaed; padding: 12px; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 20px;">
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="cancel-shortcut" style="background: none; border: 1px solid #5f6368; color: #e8eaed; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer;">Cancel</button>
        <button class="save-shortcut" style="background: #8ab4f8; color: #202124; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">Save</button>
      </div>
    </div>
  `);
  
  $('body').append(dialog);
  
  // Handle close button
  dialog.find('.close-shortcut, .cancel-shortcut').on('click', () => {
    dialog.remove();
  });
  
  // Handle save button
  dialog.find('.save-shortcut').on('click', () => {
    const name = dialog.find('#shortcutName').val().trim();
    const url = dialog.find('#shortcutUrl').val().trim();
    
    if (!name || !url) {
      alert('Please enter both name and URL');
      return;
    }
    
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    addShortcut(name, url);
    dialog.remove();
    showNotification('Shortcut added successfully!');
  });
  
  // Handle Enter key
  dialog.find('input').on('keypress', (e) => {
    if (e.which === 13) {
      dialog.find('.save-shortcut').click();
    }
  });
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function addShortcut(name, url) {
  // Get existing shortcuts
  chrome.storage.local.get(['shortcuts'], (result) => {
    const shortcuts = result.shortcuts || [];
    
    // Add new shortcut
    shortcuts.push({
      name: name,
      url: url,
      icon: getDomainIcon(url)
    });
    
    // Save shortcuts
    chrome.storage.local.set({ shortcuts: shortcuts }, () => {
      // Update the shortcuts display
      updateShortcutsDisplay();
    });
  });
}

function getDomainIcon(url) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.charAt(0).toUpperCase();
  } catch (e) {
    return 'W';
  }
}

function updateShortcutsDisplay() {
  chrome.storage.local.get(['shortcuts'], (result) => {
    const shortcuts = result.shortcuts || [];
    const container = $('.shortcuts');
    
    // Clear existing shortcuts (except the add shortcut button)
    container.find('.shortcut:not(#addShortcut)').remove();
    
    // Add saved shortcuts
    shortcuts.forEach((shortcut, index) => {
      const shortcutElement = $(`
        <a href="${shortcut.url}" class="shortcut" target="_blank" data-index="${index}">
          <div class="shortcut-icon">${shortcut.icon}</div>
          <span>${shortcut.name}</span>
        </a>
      `);
      
      // Insert before the add shortcut button
      container.find('#addShortcut').before(shortcutElement);
    });
  });
}

function showNotification(message) {
  const notification = $(`
    <div style="position: fixed; top: 20px; right: 20px; background: #34a853; color: white; padding: 12px 16px; border-radius: 8px; z-index: 10001; font-size: 14px;">
      ${message}
    </div>
  `);
  
  $('body').append(notification);
  
  setTimeout(() => {
    notification.fadeOut(() => notification.remove());
  }, 3000);
}

// Load existing shortcuts on page load
$(document).ready(() => {
  updateShortcutsDisplay();
});

console.log('Shortcuts events bound successfully'); 