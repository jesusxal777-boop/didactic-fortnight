/**
 * DreamByte OS - Start Menu Manager
 * Handles start menu, app search, and app launch
 * @module core/start-menu
 */

import { storage } from './storage-manager.js';

class StartMenuManager {
  constructor() {
    this.startMenu = null;
    this.startBtn = null;
    this.searchInput = null;
    this.recentApps = [];
    this.allApps = [
      { id: 'notes', name: 'Notes', icon: '📝' },
      { id: 'studio', name: 'Studio', icon: '💻' },
      { id: 'files', name: 'Files', icon: '📁' },
      { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];
  }
  
  /**
   * Initialize start menu
   */
  async initialize() {
    this.startMenu = document.getElementById('startMenu');
    this.startBtn = document.getElementById('startBtn');
    this.searchInput = document.getElementById('appSearch');
    
    // Load recent apps
    this.recentApps = storage.getLocal('recentApps', []);
    
    this.setupEventListeners();
    this.populateApps();
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Start button toggle
    this.startBtn.addEventListener('click', () => {
      this.startMenu.classList.toggle('show');
    });
    
    // Close button
    const closeBtn = document.getElementById('closeStartMenu');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.startMenu.classList.remove('show');
      });
    }
    
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filterApps(e.target.value);
      });
    }
  }
  
  /**
   * Populate apps in start menu
   */
  populateApps() {
    // Populate pinned apps
    const pinnedContainer = document.getElementById('pinnedAppsContainer');
    if (pinnedContainer) {
      pinnedContainer.innerHTML = '';
      this.allApps.forEach(app => {
        const tile = this.createAppTile(app);
        pinnedContainer.appendChild(tile);
      });
    }
    
    // Populate recent apps
    const recentContainer = document.getElementById('recentAppsContainer');
    if (recentContainer) {
      recentContainer.innerHTML = '';
      this.recentApps.slice(-5).reverse().forEach(appId => {
        const app = this.allApps.find(a => a.id === appId);
        if (app) {
          const item = this.createAppItem(app);
          recentContainer.appendChild(item);
        }
      });
    }
  }
  
  /**
   * Create app tile (for pinned apps)
   */
  createAppTile(app) {
    const tile = document.createElement('button');
    tile.className = 'app-tile';
    tile.innerHTML = `
      <div class="app-tile-icon">${app.icon}</div>
      <div class="app-tile-label">${app.name}</div>
    `;
    
    tile.addEventListener('click', () => {
      this.launchApp(app.id);
    });
    
    return tile;
  }
  
  /**
   * Create app item (for recent apps)
   */
  createAppItem(app) {
    const item = document.createElement('button');
    item.className = 'app-item';
    item.innerHTML = `
      <div class="app-item-icon">${app.icon}</div>
      <div class="app-item-details">
        <div class="app-item-name">${app.name}</div>
        <div class="app-item-meta">Recently opened</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      this.launchApp(app.id);
    });
    
    return item;
  }
  
  /**
   * Filter apps based on search
   */
  filterApps(query) {
    const tiles = document.querySelectorAll('.app-tile');
    const items = document.querySelectorAll('.app-item');
    const lowerQuery = query.toLowerCase();
    
    tiles.forEach(tile => {
      const label = tile.querySelector('.app-tile-label').textContent;
      if (label.toLowerCase().includes(lowerQuery)) {
        tile.classList.remove('hidden');
      } else {
        tile.classList.add('hidden');
      }
    });
    
    items.forEach(item => {
      const name = item.querySelector('.app-item-name').textContent;
      if (name.toLowerCase().includes(lowerQuery)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
  
  /**
   * Launch application
   */
  launchApp(appId) {
    // Add to recent apps
    if (!this.recentApps.includes(appId)) {
      this.recentApps.push(appId);
    }
    storage.setLocal('recentApps', this.recentApps);
    
    // Close start menu
    this.startMenu.classList.remove('show');
    
    // Emit launch event
    window.dispatchEvent(new CustomEvent('launchapp', {
      detail: { appName: appId }
    }));
  }
}

// Singleton instance
const startMenuManager = new StartMenuManager();

/**
 * Initialize start menu
 */
async function initializeStartMenu() {
  await startMenuManager.initialize();
}

export { startMenuManager, initializeStartMenu, StartMenuManager };
