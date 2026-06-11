/**
 * DreamByte OS - Theme Manager
 * Manages themes, colors, and appearance settings
 * @module core/theme-manager
 */

import { storage } from './storage-manager.js';

class ThemeManager {
  constructor() {
    this.currentTheme = 'default';
    this.isDarkMode = true;
    this.themes = {
      default: { name: 'Default', primary: '#0096ff' },
      purple: { name: 'Purple', primary: '#9d4edd' },
      green: { name: 'Green', primary: '#06d6a0' },
      orange: { name: 'Orange', primary: '#ff7700' },
      pink: { name: 'Pink', primary: '#ff006e' },
      cyan: { name: 'Cyan', primary: '#00d9ff' }
    };
    this.wallpapers = [
      'default', 'purple', 'green', 'orange', 'pink', 'cyan'
    ];
  }
  
  /**
   * Initialize theme manager
   */
  async initialize() {
    // Load saved theme
    const savedTheme = storage.getLocal('theme', 'default');
    const savedMode = storage.getLocal('darkMode', true);
    
    this.currentTheme = savedTheme;
    this.isDarkMode = savedMode;
    
    this.applyTheme(this.currentTheme, this.isDarkMode);
    this.setupEventListeners();
  }
  
  /**
   * Apply theme
   */
  applyTheme(theme, isDark = true) {
    const html = document.documentElement;
    const body = document.body;
    
    // Set theme attribute
    html.setAttribute('data-theme', theme);
    
    // Set light/dark mode
    if (isDark) {
      body.classList.remove('light');
    } else {
      body.classList.add('light');
    }
    
    this.currentTheme = theme;
    this.isDarkMode = isDark;
    
    // Save preference
    storage.setLocal('theme', theme);
    storage.setLocal('darkMode', isDark);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme, isDark }
    }));
  }
  
  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    this.applyTheme(this.currentTheme, !this.isDarkMode);
  }
  
  /**
   * Set wallpaper
   */
  setWallpaper(wallpaper) {
    if (!this.wallpapers.includes(wallpaper)) return;
    
    document.body.setAttribute('data-wallpaper', wallpaper);
    storage.setLocal('wallpaper', wallpaper);
    
    window.dispatchEvent(new CustomEvent('wallpaperchange', {
      detail: { wallpaper }
    }));
  }
  
  /**
   * Get wallpaper
   */
  getWallpaper() {
    return storage.getLocal('wallpaper', 'default');
  }
  
  /**
   * Set accent color
   */
  setAccentColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    storage.setLocal('accentColor', color);
  }
  
  /**
   * Get available themes
   */
  getThemes() {
    return this.themes;
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleDarkMode();
        this.updateThemeToggleUI();
      });
    }
  }
  
  /**
   * Update theme toggle UI
   */
  updateThemeToggleUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.control-icon');
      if (icon) {
        icon.textContent = this.isDarkMode ? '🌙' : '☀️';
      }
    }
  }
}

// Singleton instance
const themeManager = new ThemeManager();

/**
 * Initialize theme manager
 */
async function initializeThemeManager() {
  await themeManager.initialize();
}

export { themeManager, initializeThemeManager, ThemeManager };
