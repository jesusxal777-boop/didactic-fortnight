/**
 * DreamByte OS - Desktop Manager
 * Manages desktop environment and desktop icons
 * @module core/desktop-manager
 */

import { windowManager } from './window-manager.js';
import { storage } from './storage-manager.js';

class DesktopManager {
  constructor() {
    this.desktop = null;
    this.apps = new Map();
    this.desktopIcons = [];
  }
  
  /**
   * Initialize desktop
   */
  async initialize() {
    this.desktop = document.getElementById('desktop');
    this.setupDesktopIcons();
    this.setupContextMenu();
  }
  
  /**
   * Setup desktop icons
   */
  setupDesktopIcons() {
    const icons = [
      { id: 'notes', label: 'Notes', icon: '📝', app: 'notes' },
      { id: 'studio', label: 'Studio', icon: '💻', app: 'studio' },
      { id: 'files', label: 'Files', icon: '📁', app: 'files' },
      { id: 'settings', label: 'Settings', icon: '⚙️', app: 'settings' }
    ];
    
    icons.forEach(iconData => {
      this.addDesktopIcon(iconData);
    });
  }
  
  /**
   * Add desktop icon
   */
  addDesktopIcon(options = {}) {
    const {
      id = `icon-${Date.now()}`,
      label = 'App',
      icon = '📦',
      app = null,
      x = 10,
      y = 10
    } = options;
    
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.id = id;
    iconEl.style.position = 'absolute';
    iconEl.style.left = x + 'px';
    iconEl.style.top = y + 'px';
    
    iconEl.innerHTML = `
      <div class="desktop-icon-image">${icon}</div>
      <div class="desktop-icon-label">${label}</div>
    `;
    
    // Double click to open
    iconEl.addEventListener('dblclick', () => {
      if (app) {
        this.launchApp(app);
      }
    });
    
    this.desktop.appendChild(iconEl);
    this.desktopIcons.push({ id, label, icon, app, element: iconEl });
  }
  
  /**
   * Launch application
   */
  launchApp(appName) {
    console.log(`Launching app: ${appName}`);
    
    // Emit event for app launcher to handle
    window.dispatchEvent(new CustomEvent('launchapp', {
      detail: { appName }
    }));
  }
  
  /**
   * Setup context menu
   */
  setupContextMenu() {
    this.desktop.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });
  }
  
  /**
   * Show context menu
   */
  showContextMenu(x, y) {
    const contextMenu = document.getElementById('contextMenu');
    if (!contextMenu) return;
    
    contextMenu.className = 'context-menu active';
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.innerHTML = `
      <div class="context-menu-item">📦 New Folder</div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item">🔄 Refresh</div>
      <div class="context-menu-item">🎨 Change Wallpaper</div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item">⚙️ Settings</div>
    `;
    
    // Close on click outside
    document.addEventListener('click', () => {
      contextMenu.classList.remove('active');
    }, { once: true });
  }
}

// Singleton instance
const desktopManager = new DesktopManager();

/**
 * Initialize desktop manager
 */
async function initializeDesktop() {
  await desktopManager.initialize();
}

export { desktopManager, initializeDesktop, DesktopManager };
