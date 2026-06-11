/**
 * DreamByte OS - Module Loader
 * Central entry point for ES6 module system
 * @module core/module-loader
 */

// Import all core modules
import { initializeDesktop } from './desktop-manager.js';
import { initializeWindowManager } from './window-manager.js';
import { initializeDock } from './dock-manager.js';
import { initializeStartMenu } from './start-menu.js';
import { initializeControlCenter } from './control-center.js';
import { initializeThemeManager } from './theme-manager.js';
import { initializeStorage } from './storage-manager.js';
import { initializeNotifications } from './notification-system.js';

/**
 * Main initialization function
 * Sets up all DreamByte OS systems
 */
async function initializeDreamByteOS() {
  try {
    console.log('🌙 DreamByte OS - Initializing...');
    
    // Initialize storage first (dependency for other modules)
    await initializeStorage();
    console.log('✓ Storage initialized');
    
    // Initialize theme system
    await initializeThemeManager();
    console.log('✓ Theme system initialized');
    
    // Initialize notification system
    await initializeNotifications();
    console.log('✓ Notification system initialized');
    
    // Initialize window manager (core system)
    await initializeWindowManager();
    console.log('✓ Window manager initialized');
    
    // Initialize desktop environment
    await initializeDesktop();
    console.log('✓ Desktop environment initialized');
    
    // Initialize dock
    await initializeDock();
    console.log('✓ Dock initialized');
    
    // Initialize start menu
    await initializeStartMenu();
    console.log('✓ Start menu initialized');
    
    // Initialize control center
    await initializeControlCenter();
    console.log('✓ Control center initialized');
    
    // Set up global event listeners
    setupGlobalEvents();
    
    // Update time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
    
    // Mark as ready
    document.body.classList.add('ready');
    console.log('✅ DreamByte OS Ready!');
    
  } catch (error) {
    console.error('❌ Failed to initialize DreamByte OS:', error);
    showErrorMessage('Failed to initialize DreamByte OS. Please refresh the page.');
  }
}

/**
 * Set up global event listeners
 */
function setupGlobalEvents() {
  // Close menus on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
    }
  });
  
  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    const startMenu = document.getElementById('startMenu');
    const controlCenter = document.getElementById('controlCenter');
    const startBtn = document.getElementById('startBtn');
    const controlCenterBtn = document.getElementById('controlCenterBtn');
    
    if (startMenu?.classList.contains('show') && 
        !startMenu.contains(e.target) && 
        !startBtn.contains(e.target)) {
      startMenu.classList.remove('show');
    }
    
    if (controlCenter?.classList.contains('show') && 
        !controlCenter.contains(e.target) && 
        !controlCenterBtn.contains(e.target)) {
      controlCenter.classList.remove('show');
    }
  });
  
  // Prevent default context menu on desktop
  document.getElementById('desktop')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // TODO: Show custom context menu
  });
}

/**
 * Close all open menus
 */
function closeAllMenus() {
  document.getElementById('startMenu')?.classList.remove('show');
  document.getElementById('controlCenter')?.classList.remove('show');
}

/**
 * Update time display in topbar
 */
function updateTimeDisplay() {
  const timeDisplay = document.getElementById('timeDisplay');
  if (!timeDisplay) return;
  
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  timeDisplay.textContent = formatter.format(now);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <div class="notification-icon">⚠️</div>
    <div class="notification-content">
      <div class="notification-title">Error</div>
      <div class="notification-message">${message}</div>
    </div>
  `;
  document.getElementById('notificationCenter')?.appendChild(notification);
  
  setTimeout(() => notification.remove(), 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDreamByteOS);
} else {
  initializeDreamByteOS();
}

export { initializeDreamByteOS, closeAllMenus };
