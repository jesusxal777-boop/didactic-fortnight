/**
 * DreamByte OS - Settings Application
 * System settings and preferences
 * @module apps/settings-app
 */

import { BaseApp } from '../core/app-framework.js';
import { themeManager } from '../core/theme-manager.js';
import { storage } from '../core/storage-manager.js';

class SettingsApp extends BaseApp {
  constructor() {
    super('Settings', '⚙️');
  }
  
  async initialize() {
    // Create window
    this.createWindow({
      width: 600,
      height: 700
    });
    
    // Build UI
    this.buildUI();
  }
  
  buildUI() {
    const content = this.getWindowContent();
    
    content.innerHTML = `
      <div class="settings-container">
        <div class="settings-nav">
          <div class="settings-nav-item active" data-section="appearance">🎨 Appearance</div>
          <div class="settings-nav-item" data-section="system">🖥️ System</div>
          <div class="settings-nav-item" data-section="about">ℹ️ About</div>
        </div>
        <div class="settings-content">
          <div class="settings-section appearance">
            <h3>Appearance Settings</h3>
            <div class="setting-item">
              <label>Dark Mode</label>
              <input type="checkbox" class="dark-mode-toggle" ${themeManager.isDarkMode ? 'checked' : ''}>
            </div>
            <div class="setting-item">
              <label>Theme Color</label>
              <div class="theme-colors">
                <button class="theme-color-btn" data-color="#0096ff" style="background: #0096ff;"></button>
                <button class="theme-color-btn" data-color="#9d4edd" style="background: #9d4edd;"></button>
                <button class="theme-color-btn" data-color="#06d6a0" style="background: #06d6a0;"></button>
                <button class="theme-color-btn" data-color="#ff7700" style="background: #ff7700;"></button>
              </div>
            </div>
          </div>
          <div class="settings-section system">
            <h3>System Settings</h3>
            <div class="setting-item">
              <label>Storage Used</label>
              <div class="storage-bar"><div class="storage-used" style="width: 35%;"></div></div>
              <span>35% of 50MB</span>
            </div>
          </div>
          <div class="settings-section about">
            <h3>About DreamByte OS</h3>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Build:</strong> 2026.06.11</p>
            <p>A modern web-based desktop environment inspired by Windows 11, macOS, and visionOS.</p>
          </div>
        </div>
      </div>
    `;
    
    // Setup event listeners
    const darkModeToggle = content.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => {
        themeManager.toggleDarkMode();
      });
    }
    
    const themeColorBtns = content.querySelectorAll('.theme-color-btn');
    themeColorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        themeManager.setAccentColor(color);
      });
    });
    
    // Navigation
    const navItems = content.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        const section = item.dataset.section;
        content.querySelectorAll('.settings-section').forEach(s => s.style.display = 'none');
        content.querySelector(`.settings-section.${section}`).style.display = 'block';
      });
    });
  }
}

export { SettingsApp };
