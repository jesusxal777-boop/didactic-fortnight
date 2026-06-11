/**
 * DreamByte OS - Application Framework
 * Manages app registration, lifecycle, and execution
 * @module core/app-framework
 */

import { windowManager } from './window-manager.js';
import { dockManager } from './dock-manager.js';
import { notifications } from './notification-system.js';
import { storage } from './storage-manager.js';

class AppFramework {
  constructor() {
    this.apps = new Map();
    this.runningApps = new Map();
    this.appWindows = new Map();
  }
  
  /**
   * Register an application
   */
  registerApp(appId, appClass) {
    if (this.apps.has(appId)) {
      console.warn(`App ${appId} is already registered`);
      return false;
    }
    
    this.apps.set(appId, appClass);
    console.log(`✓ App registered: ${appId}`);
    return true;
  }
  
  /**
   * Launch an application
   */
  async launchApp(appId) {
    const AppClass = this.apps.get(appId);
    if (!AppClass) {
      console.error(`App ${appId} not found`);
      notifications.error('Error', `Application ${appId} not found`);
      return null;
    }
    
    // If already running, focus window
    if (this.runningApps.has(appId)) {
      const windowId = this.appWindows.get(appId);
      if (windowId) {
        windowManager.focusWindow(windowId);
      }
      return this.runningApps.get(appId);
    }
    
    try {
      // Instantiate app
      const app = new AppClass();
      await app.initialize();
      
      // Mark as running
      this.runningApps.set(appId, app);
      dockManager.setAppRunning(appId, true);
      
      // Track in recent apps
      const recentApps = storage.getLocal('recentApps', []);
      if (!recentApps.includes(appId)) {
        recentApps.push(appId);
      }
      storage.setLocal('recentApps', recentApps);
      
      console.log(`✓ App launched: ${appId}`);
      return app;
      
    } catch (error) {
      console.error(`Failed to launch app ${appId}:`, error);
      notifications.error('Error', `Failed to launch ${appId}`);
      return null;
    }
  }
  
  /**
   * Close an application
   */
  closeApp(appId) {
    const app = this.runningApps.get(appId);
    if (!app) return;
    
    // Call app cleanup
    if (app.destroy) {
      app.destroy();
    }
    
    // Clean up
    this.runningApps.delete(appId);
    this.appWindows.delete(appId);
    dockManager.setAppRunning(appId, false);
    
    console.log(`✓ App closed: ${appId}`);
  }
  
  /**
   * Get running app instance
   */
  getRunningApp(appId) {
    return this.runningApps.get(appId);
  }
  
  /**
   * Register app window
   */
  registerAppWindow(appId, windowId) {
    this.appWindows.set(appId, windowId);
  }
  
  /**
   * Get all running apps
   */
  getRunningApps() {
    return Array.from(this.runningApps.values());
  }
}

// Singleton instance
const appFramework = new AppFramework();

/**
 * Base Application Class
 */
class BaseApp {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon;
    this.windowId = null;
    this.appId = null;
  }
  
  /**
   * Initialize app
   */
  async initialize() {
    // Override in subclasses
  }
  
  /**
   * Create app window
   */
  createWindow(options = {}) {
    const defaultOptions = {
      title: this.name,
      icon: this.icon,
      width: 600,
      height: 500,
      ...options
    };
    
    const windowEl = windowManager.createWindow(defaultOptions);
    this.windowId = windowEl.id;
    
    // Close app when window closes
    const closeBtn = windowEl.querySelector('.window-button.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (this.appId) {
          appFramework.closeApp(this.appId);
        }
      });
    }
    
    return windowEl;
  }
  
  /**
   * Get window element
   */
  getWindow() {
    return windowManager.getWindow(this.windowId);
  }
  
  /**
   * Get window content element
   */
  getWindowContent() {
    return windowManager.getWindowContent(this.windowId);
  }
  
  /**
   * Set window content
   */
  setWindowContent(content) {
    windowManager.setWindowContent(this.windowId, content);
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.windowId) {
      windowManager.closeWindow(this.windowId);
    }
  }
}

export { appFramework, BaseApp };
