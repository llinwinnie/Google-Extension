$(document).ready(() => {
  console.log('Profile script loaded');

  // Load user's profile picture
  loadUserProfile();

  // Handle profile picture click
  $('#profileMenu').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openGoogleAccountMenu();
  });

  // Handle apps menu click
  $('#appsMenu').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openGoogleAppsMenu();
  });

  // Close menus when clicking outside
  $(document).on('click', (e) => {
    if (!$(e.target).closest('.google-menu').length && 
        !$(e.target).closest('#profileMenu').length &&
        !$(e.target).closest('#appsMenu').length) {
      $('.google-menu').remove();
    }
  });
});

function loadUserProfile() {
  const profilePic = $('#userProfilePic');
  
  // Try to get the user's actual profile picture from Chrome
  // First, try to get from Chrome's identity API
  if (chrome.identity) {
    chrome.identity.getProfileUserInfo((userInfo) => {
      if (userInfo.email) {
        // Try to get profile picture from Google's API
        getGoogleProfilePicture(userInfo.email);
      } else {
        // Fallback to initial-based profile
        createInitialBasedProfile();
      }
    });
  } else {
    // Fallback to initial-based profile
    createInitialBasedProfile();
  }
}

function getGoogleProfilePicture(email) {
  // Try to fetch profile picture from Google's API
  // Note: This requires additional permissions and OAuth setup
  // For now, we'll use a fallback approach
  
  // You can implement this later with proper OAuth setup
  // For now, we'll use the initial-based approach
  createInitialBasedProfile();
}

function createInitialBasedProfile() {
  const profilePic = $('#userProfilePic');
  
  // Try to get user's name from Chrome storage or use email
  chrome.storage.local.get(['userName', 'userEmail'], (result) => {
    let userInitial = 'W'; // Default
    let userName = 'Winnie'; // Default
    
    if (result.userName) {
      userName = result.userName;
      userInitial = userName.charAt(0).toUpperCase();
    } else if (result.userEmail) {
      userName = result.userEmail.split('@')[0];
      userInitial = userName.charAt(0).toUpperCase();
    }
    
    // Use a consistent color based on the user's name
    const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#ff6d01', '#46bdc6', '#7baaf7', '#f28b82'];
    const colorIndex = userName.length % colors.length;
    const selectedColor = colors[colorIndex];
    
    profilePic.html(`
      <div style="width: 100%; height: 100%; background: ${selectedColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; cursor: pointer;">
        ${userInitial}
      </div>
    `);
    
    // Store the user info for consistency
    chrome.storage.local.set({ 
      userName: userName,
      userInitial: userInitial,
      userColor: selectedColor
    });
  });
}

function openGoogleAccountMenu() {
  // Remove any existing menus
  $('.google-menu').remove();
  
  // Create Google account menu (similar to original)
  const menu = $(`
    <div class="google-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #3c4043; border-radius: 8px; padding: 24px; min-width: 400px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <span style="color: #9aa0a6; font-size: 14px;">winnie08wl@gmail.com</span>
        <button class="close-menu" style="background: none; border: none; color: #9aa0a6; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #4285f4; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">W</div>
        <div style="color: #e8eaed; font-size: 20px; margin-bottom: 16px;">Hi, Winnie!</div>
        <button style="background: none; border: 1px solid #5f6368; color: #e8eaed; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Manage your Google Account</button>
      </div>
      
      <div style="border-top: 1px solid #5f6368; padding-top: 16px;">
        <div style="color: #9aa0a6; font-size: 12px; margin-bottom: 8px;">Hide more accounts</div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #ea4335; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">W</div>
          <div>
            <div style="color: #e8eaed; font-size: 14px;">Winnie Lin</div>
            <div style="color: #9aa0a6; font-size: 12px;">llin.winnie@gmail.com</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #4285f4; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">W</div>
          <div>
            <div style="color: #e8eaed; font-size: 14px;">Winnie Lin</div>
            <div style="color: #9aa0a6; font-size: 12px;">winnie88wl@gmail.com</div>
          </div>
        </div>
      </div>
      
      <div style="border-top: 1px solid #5f6368; padding-top: 16px; margin-top: 16px;">
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer;">
          <span style="color: #9aa0a6; font-size: 16px;">+</span>
          <span style="color: #e8eaed; font-size: 14px;">Add another account</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer;">
          <span style="color: #9aa0a6; font-size: 16px;">→</span>
          <span style="color: #e8eaed; font-size: 14px;">Sign out of all accounts</span>
        </div>
      </div>
      
      <div style="border-top: 1px solid #5f6368; padding-top: 16px; margin-top: 16px; text-align: center;">
        <span style="color: #9aa0a6; font-size: 12px;">Privacy Policy</span>
        <span style="color: #9aa0a6; font-size: 12px; margin: 0 8px;">•</span>
        <span style="color: #9aa0a6; font-size: 12px;">Terms of Service</span>
      </div>
    </div>
  `);
  
  $('body').append(menu);
  
  // Handle close button
  menu.find('.close-menu').on('click', () => {
    menu.remove();
  });
}

function openGoogleAppsMenu() {
  // Remove any existing menus
  $('.google-menu').remove();
  
  // Create Google apps menu
  const menu = $(`
    <div class="google-menu" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #3c4043; border-radius: 8px; padding: 24px; min-width: 400px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <span style="color: #e8eaed; font-size: 18px; font-weight: 500;">Google apps</span>
        <button class="close-menu" style="background: none; border: none; color: #9aa0a6; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #ea4335; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">G</div>
          <span style="color: #e8eaed; font-size: 12px;">Gmail</span>
        </div>
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #4285f4; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">D</div>
          <span style="color: #e8eaed; font-size: 12px;">Drive</span>
        </div>
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #34a853; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">C</div>
          <span style="color: #e8eaed; font-size: 12px;">Calendar</span>
        </div>
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #fbbc04; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">M</div>
          <span style="color: #e8eaed; font-size: 12px;">Maps</span>
        </div>
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #ea4335; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">Y</div>
          <span style="color: #e8eaed; font-size: 12px;">YouTube</span>
        </div>
        <div class="app-item" style="text-align: center; cursor: pointer; padding: 12px; border-radius: 8px; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; background: #4285f4; border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">P</div>
          <span style="color: #e8eaed; font-size: 12px;">Photos</span>
        </div>
      </div>
    </div>
  `);
  
  $('body').append(menu);
  
  // Handle close button
  menu.find('.close-menu').on('click', () => {
    menu.remove();
  });
  
  // Handle app item clicks
  menu.find('.app-item').on('click', function() {
    const appName = $(this).find('span').text();
    const appUrls = {
      'Gmail': 'https://mail.google.com',
      'Drive': 'https://drive.google.com',
      'Calendar': 'https://calendar.google.com',
      'Maps': 'https://maps.google.com',
      'YouTube': 'https://youtube.com',
      'Photos': 'https://photos.google.com'
    };
    
    if (appUrls[appName]) {
      chrome.tabs.create({ url: appUrls[appName] });
      menu.remove();
    }
  });
  
  // Add hover effects
  menu.find('.app-item').hover(
    function() { $(this).css('background', '#5f6368'); },
    function() { $(this).css('background', 'transparent'); }
  );
}

console.log('Profile events bound successfully'); 