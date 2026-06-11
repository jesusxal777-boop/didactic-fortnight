/**
 * DreamByte OS - Dock Manager
 * Manages dock icons and app indicators
 * @module core/dock-manager
 */

import { storage } from './storage-manager.js';

class DockManager {
  constructor() {
    this.dock = null;
    this.dockIcons = new Map();
    this.pinnedApps = ['notes', 'studio', 'files', 'settings'];
  }
  
  /**
   * Initialize dock
   */
  async initialize() {
    this.dock = document.getElementById('dock');
    
    // Load pinned apps from storage
    const saved = storage.getLocal('pinnedApps', this.pinnedApps);
    this.pinnedApps = saved;
    
    this.populateDock();
  }
  
  /**
   * Populate dock with icons
   */
  populateDock() {
    const appMetadata = {
      notes: { label: 'Notes', icon: '📝' },
      studio: { label: 'Studio', icon: '💻' },
      files: { label: 'Files', icon: '📁' },
      settings: { label: 'Settings', icon: '⚙️' }
    };
    
    this.pinnedApps.forEach(appId => {
      const metadata = appMetadata[appId];
      if (metadata) {
        this.addDockIcon(appId, metadata.label, metadata.icon);
      }
    });
  }
  
  /**
   * Add icon to dock
   */
  addDockIcon(appId, label, icon) {
    if (this.dockIcons.has(appId)) return;
    
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'dock-icon';
    iconWrapper.id = `dock-${appId}`;
    iconWrapper.setAttribute('data-label', label);
    iconWrapper.innerHTML = icon;
    
    // Click to launch
    iconWrapper.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('launchapp', {
        detail: { appName: appId }
      }));
    });
    
    this.dock.appendChild(iconWrapper);
    this.dockIcons.set(appId, {
      element: iconWrapper,
      label,
      icon,
      isRunning: false,
      isActive: false
    });
  }
  
  /**
   * Remove icon from dock
   */
  removeDockIcon(appId) {
    const iconData = this.dockIcons.get(appId);
    if (iconData) {
      iconData.element.remove();
      this.dockIcons.delete(appId);
    }
  }
  
  /**
   * Set app as running
   */
  setAppRunning(appId, isRunning) {
    const iconData = this.dockIcons.get(appId);
    if (!iconData) return;
    
    iconData.isRunning = isRunning;
    
    if (isRunning) {
      iconData.element.classList.add('running');
      iconData.element.classList.add('active');
    } else {
      iconData.element.classList.remove('running');
      iconData.element.classList.remove('active');
    }
  }
  
  /**
   * Set app as active (focused)
   */
  setAppActive(appId, isActive) {
    const iconData = this.dockIcons.get(appId);
    if (!iconData) return;
    
    iconData.isActive = isActive;
    
    if (isActive) {
      iconData.element.classList.add('active');
    } else {
      iconData.element.classList.remove('active');
    }
  }
  
  /**
   * Set badge on dock icon
   */
  setBadge(appId, count) {
    const iconData = this.dockIcons.get(appId);
    if (!iconData) return;
    
    // Remove old badge
    iconData.element.querySelector('.dock-badge')?.remove();
    
    if (count > 0) {
      const badge = document.createElement('div');
      badge.className = 'dock-badge';
      badge.textContent = count;
      iconData.element.appendChild(badge);
    }
  }
  
  /**
   * Pin app to dock
   */
  pinApp(appId) {
    if (!this.pinnedApps.includes(appId)) {
      this.pinnedApps.push(appId);
      storage.setLocal('pinnedApps', this.pinnedApps);
    }
  }
  
  /**
   * Unpin app from dock
   */
  unpinApp(appId) {
    this.pinnedApps = this.pinnedApps.filter(id => id !== appId);
    storage.setLocal('pinnedApps', this.pinnedApps);
    this.removeDockIcon(appId);
  }
}

// Singleton instance
const dockManager = new DockManager();

/**
 * Initialize dock manager
 */
async function initializeDock() {
  await dockManager.initialize();
}

export { dockManager, initializeDock, DockManager };
