/**
 * DreamByte OS - Control Center Manager
 * Manages quick settings and system controls
 * @module core/control-center
 */

import { themeManager } from './theme-manager.js';
import { storage } from './storage-manager.js';

class ControlCenterManager {
  constructor() {
    this.controlCenter = null;
    this.controlCenterBtn = null;
    this.volume = 100;
    this.brightness = 100;
  }
  
  /**
   * Initialize control center
   */
  async initialize() {
    this.controlCenter = document.getElementById('controlCenter');
    this.controlCenterBtn = document.getElementById('controlCenterBtn');
    
    // Load saved values
    this.volume = storage.getLocal('volume', 100);
    this.brightness = storage.getLocal('brightness', 100);
    
    this.setupEventListeners();
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Control center button
    this.controlCenterBtn.addEventListener('click', () => {
      this.controlCenter.classList.toggle('show');
    });
    
    // Close button
    const closeBtn = document.getElementById('closeControlCenter');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.controlCenter.classList.remove('show');
      });
    }
    
    // Volume control
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) {
      volumeControl.value = this.volume;
      volumeControl.addEventListener('input', (e) => {
        this.setVolume(parseInt(e.target.value));
      });
    }
    
    // Brightness control
    const brightnessControl = document.getElementById('brightnessControl');
    if (brightnessControl) {
      brightnessControl.value = this.brightness;
      brightnessControl.addEventListener('input', (e) => {
        this.setBrightness(parseInt(e.target.value));
      });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeManager.toggleDarkMode();
        this.updateThemeUI();
      });
      this.updateThemeUI();
    }
  }
  
  /**
   * Set volume
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(100, value));
    storage.setLocal('volume', this.volume);
    // TODO: Actually set system volume when Web Audio API is used
  }
  
  /**
   * Set brightness
   */
  setBrightness(value) {
    this.brightness = Math.max(0, Math.min(100, value));
    document.body.style.filter = `brightness(${this.brightness}%)`;
    storage.setLocal('brightness', this.brightness);
  }
  
  /**
   * Update theme UI
   */
  updateThemeUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('.control-icon');
    if (icon) {
      icon.textContent = themeManager.isDarkMode ? '🌙' : '☀️';
    }
    
    if (themeManager.isDarkMode) {
      themeToggle.classList.add('active');
    } else {
      themeToggle.classList.remove('active');
    }
  }
}

// Singleton instance
const controlCenterManager = new ControlCenterManager();

/**
 * Initialize control center
 */
async function initializeControlCenter() {
  await controlCenterManager.initialize();
}

export { controlCenterManager, initializeControlCenter, ControlCenterManager };
