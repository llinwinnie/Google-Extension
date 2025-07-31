$(document).ready(() => {
  console.log('Customize script loaded');

  // Handle customize button click
  $('.customize-btn').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCustomizeMenu();
  });

  // Close customize menu when clicking outside
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.customize-menu').length && 
        !$(e.target).closest('.customize-btn').length) {
      $('.customize-menu').remove();
    }
  });
});

function openCustomizeMenu() {
  // Remove any existing menus
  $('.customize-menu').remove();
  
  // Create customize menu
  const menu = $(`
    <div class="customize-menu" style="position: fixed; top: 0; right: 0; height: 100vh; width: 400px; background: #3c4043; z-index: 10000; box-shadow: -2px 0 8px rgba(0,0,0,0.3); overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px; border-bottom: 1px solid #5f6368;">
        <span style="color: #e8eaed; font-size: 18px; font-weight: 500;">Customize Chrome</span>
        <button class="close-customize" style="background: none; border: none; color: #9aa0a6; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="padding: 24px;">
        <!-- Appearance Section -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #e8eaed; font-size: 16px; font-weight: 500; margin-bottom: 16px;">Appearance</h3>
          
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="color: #e8eaed; font-size: 14px;">Dark Theme for Google Chrome</span>
              <span style="color: #9aa0a6; font-size: 12px;">↗</span>
            </div>
            <span style="color: #9aa0a6; font-size: 12px;">Current theme you have installed</span>
          </div>
          
          <button class="change-theme-btn" style="background: #8ab4f8; color: #202124; border: none; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">🖼️</span>
            Change theme
          </button>
          
          <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 4px; margin-bottom: 12px;">
              <button class="theme-btn" data-theme="light" style="flex: 1; background: #5f6368; color: #e8eaed; border: none; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>☀️</span>
                Light
              </button>
              <button class="theme-btn active" data-theme="dark" style="flex: 1; background: #8ab4f8; color: #202124; border: none; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>🌙</span>
                Dark
              </button>
              <button class="theme-btn" data-theme="device" style="flex: 1; background: #5f6368; color: #e8eaed; border: none; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>✓</span>
                Device
              </button>
            </div>
          </div>
          
          <button class="reset-btn" style="background: none; border: 1px solid #5f6368; color: #e8eaed; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">🔄</span>
            Reset to Default Chrome
          </button>
        </div>
        
        <!-- Custom Background Color Section -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #e8eaed; font-size: 16px; font-weight: 500; margin-bottom: 16px;">Custom Background</h3>
          
          <div style="margin-bottom: 16px;">
            <label style="color: #e8eaed; font-size: 14px; display: block; margin-bottom: 8px;">Background Color (Hex)</label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="text" id="customColor" placeholder="#202124" style="flex: 1; background: #5f6368; border: 1px solid #5f6368; color: #e8eaed; padding: 8px 12px; border-radius: 6px; font-size: 14px; outline: none;">
              <input type="color" id="colorPicker" style="width: 40px; height: 40px; border: none; border-radius: 6px; cursor: pointer;">
            </div>
          </div>
          
          <button class="apply-color-btn" style="background: #8ab4f8; color: #202124; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;">
            Apply Color
          </button>
        </div>
        
        <!-- Toolbar Section -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #e8eaed; font-size: 16px; font-weight: 500; margin-bottom: 16px;">Toolbar</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #5f6368;">
            <span style="color: #e8eaed; font-size: 14px;">Show bookmarks bar</span>
            <span style="color: #9aa0a6; font-size: 16px;">→</span>
          </div>
        </div>
        
        <!-- Shortcuts Section -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #e8eaed; font-size: 16px; font-weight: 500; margin-bottom: 16px;">Shortcuts</h3>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="color: #e8eaed; font-size: 14px;">Show shortcuts</span>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="shortcuts" value="my" checked style="accent-color: #8ab4f8;">
              <span style="color: #e8eaed; font-size: 14px;">My shortcuts</span>
            </label>
            <span style="color: #9aa0a6; font-size: 12px; margin-left: 24px;">Shortcuts are curated by you</span>
          </div>
          
          <div>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="shortcuts" value="visited" style="accent-color: #8ab4f8;">
              <span style="color: #e8eaed; font-size: 14px;">Most visited sites</span>
            </label>
            <span style="color: #9aa0a6; font-size: 12px; margin-left: 24px;">Shortcuts are suggested based on websites you visit often</span>
          </div>
        </div>
        
        <!-- Cards Section -->
        <div style="margin-bottom: 32px;">
          <h3 style="color: #e8eaed; font-size: 16px; font-weight: 500; margin-bottom: 16px;">Cards</h3>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="color: #e8eaed; font-size: 14px;">Show cards</span>
            <label class="toggle-switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          
          <div>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" checked style="accent-color: #8ab4f8;">
              <span style="color: #e8eaed; font-size: 14px;">Continue with these tabs</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `);
  
  $('body').append(menu);
  
  // Add toggle switch styles
  const toggleStyles = `
    <style>
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
      }
      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #5f6368;
        transition: .4s;
        border-radius: 20px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .slider {
        background-color: #8ab4f8;
      }
      input:checked + .slider:before {
        transform: translateX(20px);
      }
    </style>
  `;
  $('head').append(toggleStyles);
  
  // Handle close button
  menu.find('.close-customize').on('click', () => {
    menu.remove();
  });
  
  // Handle theme buttons
  menu.find('.theme-btn').on('click', function() {
    menu.find('.theme-btn').removeClass('active').css({
      'background': '#5f6368',
      'color': '#e8eaed'
    });
    $(this).addClass('active').css({
      'background': '#8ab4f8',
      'color': '#202124'
    });
    
    const theme = $(this).data('theme');
    applyTheme(theme);
  });
  
  // Handle color picker
  menu.find('#colorPicker').on('change', function() {
    const color = $(this).val();
    menu.find('#customColor').val(color);
  });
  
  // Handle custom color input
  menu.find('#customColor').on('input', function() {
    const color = $(this).val();
    if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
      menu.find('#colorPicker').val(color);
    }
  });
  
  // Handle apply color button
  menu.find('.apply-color-btn').on('click', function() {
    const color = menu.find('#customColor').val();
    if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
      applyCustomColor(color);
    } else {
      alert('Please enter a valid hex color (e.g., #202124)');
    }
  });
  
  // Handle reset button
  menu.find('.reset-btn').on('click', function() {
    resetToDefault();
  });
}

function applyTheme(theme) {
  switch(theme) {
    case 'light':
      $('body').css('background', '#ffffff');
      $('body').css('color', '#202124');
      break;
    case 'dark':
      $('body').css('background', '#202124');
      $('body').css('color', '#e8eaed');
      break;
    case 'device':
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $('body').css('background', '#202124');
        $('body').css('color', '#e8eaed');
      } else {
        $('body').css('background', '#ffffff');
        $('body').css('color', '#202124');
      }
      break;
  }
  
  // Save theme preference
  chrome.storage.local.set({ theme: theme });
}

function applyCustomColor(color) {
  $('body').css('background', color);
  
  // Save custom color
  chrome.storage.local.set({ customColor: color });
  
  // Show success message
  showNotification('Background color applied successfully!');
}

function resetToDefault() {
  $('body').css('background', '#202124');
  $('body').css('color', '#e8eaed');
  
  // Clear saved preferences
  chrome.storage.local.remove(['theme', 'customColor']);
  
  showNotification('Reset to default Chrome theme');
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

// Load saved preferences on page load
$(document).ready(() => {
  chrome.storage.local.get(['theme', 'customColor'], (result) => {
    if (result.customColor) {
      $('body').css('background', result.customColor);
    } else if (result.theme) {
      applyTheme(result.theme);
    }
  });
});

console.log('Customize events bound successfully'); 