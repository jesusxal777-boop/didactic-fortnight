/**
 * DreamByte OS - Window Manager
 * Handles window creation, dragging, resizing, and lifecycle
 * @module core/window-manager
 */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.focusedWindow = null;
    this.nextZIndex = 200;
    this.container = null;
    this.modalOverlay = null;
  }
  
  /**
   * Initialize window manager
   */
  async initialize() {
    this.container = document.getElementById('windowContainer');
    this.modalOverlay = document.getElementById('modalOverlay');
  }
  
  /**
   * Create a new window
   */
  createWindow(options = {}) {
    const {
      id = `window-${Date.now()}`,
      title = 'Window',
      icon = '📄',
      width = 600,
      height = 500,
      x = 100,
      y = 100,
      minWidth = 300,
      minHeight = 200,
      maximizable = true,
      minimizable = true,
      resizable = true,
      onClose = null,
      onMinimize = null,
      onMaximize = null
    } = options;
    
    // Create window element
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = id;
    windowEl.style.width = width + 'px';
    windowEl.style.height = height + 'px';
    windowEl.style.left = x + 'px';
    windowEl.style.top = y + 'px';
    windowEl.style.zIndex = this.nextZIndex;
    
    windowEl.innerHTML = `
      <div class="window-title-bar">
        <div class="window-title">
          <span class="window-icon">${icon}</span>
          <span class="window-title-text">${title}</span>
        </div>
        <div class="window-controls">
          ${minimizable ? '<button class="window-button minimize" title="Minimize">−</button>' : ''}
          ${maximizable ? '<button class="window-button maximize" title="Maximize">□</button>' : ''}
          <button class="window-button close" title="Close">✕</button>
        </div>
      </div>
      <div class="window-content"></div>
      <div class="window-footer"></div>
      ${resizable ? `
        <div class="resize-handle top"></div>
        <div class="resize-handle bottom"></div>
        <div class="resize-handle left"></div>
        <div class="resize-handle right"></div>
        <div class="resize-handle top-left"></div>
        <div class="resize-handle top-right"></div>
        <div class="resize-handle bottom-left"></div>
        <div class="resize-handle bottom-right"></div>
      ` : ''}
    `;
    
    // Add to DOM
    this.container.appendChild(windowEl);
    
    // Store window data
    const windowData = {
      id,
      element: windowEl,
      title,
      icon,
      width,
      height,
      minWidth,
      minHeight,
      maximizable,
      minimizable,
      resizable,
      isMaximized: false,
      isMinimized: false,
      isDragging: false,
      isResizing: false,
      onClose,
      onMinimize,
      onMaximize
    };
    
    this.windows.set(id, windowData);
    
    // Setup event listeners
    this.setupWindowEvents(id);
    
    // Focus window
    this.focusWindow(id);
    
    return windowEl;
  }
  
  /**
   * Setup window event listeners
   */
  setupWindowEvents(id) {
    const windowData = this.windows.get(id);
    const windowEl = windowData.element;
    const titleBar = windowEl.querySelector('.window-title-bar');
    const closeBtn = windowEl.querySelector('.window-button.close');
    const minimizeBtn = windowEl.querySelector('.window-button.minimize');
    const maximizeBtn = windowEl.querySelector('.window-button.maximize');
    const resizeHandles = windowEl.querySelectorAll('.resize-handle');
    
    // Click to focus
    windowEl.addEventListener('mousedown', () => this.focusWindow(id));
    
    // Dragging
    titleBar.addEventListener('mousedown', (e) => this.startDrag(e, id));
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeWindow(id));
    }
    
    // Minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.minimizeWindow(id));
    }
    
    // Maximize button
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => this.maximizeWindow(id));
    }
    
    // Resizing
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => this.startResize(e, id, handle));
    });
  }
  
  /**
   * Start dragging window
   */
  startDrag(e, id) {
    const windowData = this.windows.get(id);
    if (windowData.isMaximized) return;
    
    windowData.isDragging = true;
    const windowEl = windowData.element;
    const rect = windowEl.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    const moveFn = (moveEvent) => {
      windowEl.style.left = (moveEvent.clientX - startX) + 'px';
      windowEl.style.top = (moveEvent.clientY - startY) + 'px';
    };
    
    const stopFn = () => {
      windowData.isDragging = false;
      document.removeEventListener('mousemove', moveFn);
      document.removeEventListener('mouseup', stopFn);
    };
    
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', stopFn);
  }
  
  /**
   * Start resizing window
   */
  startResize(e, id, handle) {
    const windowData = this.windows.get(id);
    windowData.isResizing = true;
    const windowEl = windowData.element;
    const rect = windowEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;
    const startLeft = rect.left;
    const startTop = rect.top;
    
    const handleClass = handle.className.split(' ').find(c => c !== 'resize-handle');
    
    const resizeFn = (resizeEvent) => {
      const deltaX = resizeEvent.clientX - startX;
      const deltaY = resizeEvent.clientY - startY;
      
      if (handleClass.includes('right')) {
        windowEl.style.width = Math.max(windowData.minWidth, startWidth + deltaX) + 'px';
      }
      if (handleClass.includes('bottom')) {
        windowEl.style.height = Math.max(windowData.minHeight, startHeight + deltaY) + 'px';
      }
      if (handleClass.includes('left')) {
        const newWidth = startWidth - deltaX;
        if (newWidth >= windowData.minWidth) {
          windowEl.style.width = newWidth + 'px';
          windowEl.style.left = (startLeft + deltaX) + 'px';
        }
      }
      if (handleClass.includes('top')) {
        const newHeight = startHeight - deltaY;
        if (newHeight >= windowData.minHeight) {
          windowEl.style.height = newHeight + 'px';
          windowEl.style.top = (startTop + deltaY) + 'px';
        }
      }
    };
    
    const stopFn = () => {
      windowData.isResizing = false;
      document.removeEventListener('mousemove', resizeFn);
      document.removeEventListener('mouseup', stopFn);
    };
    
    document.addEventListener('mousemove', resizeFn);
    document.addEventListener('mouseup', stopFn);
  }
  
  /**
   * Focus window
   */
  focusWindow(id) {
    // Remove focus from other windows
    this.windows.forEach((windowData) => {
      windowData.element.classList.remove('focused');
    });
    
    // Focus this window
    const windowData = this.windows.get(id);
    if (!windowData) return;
    
    windowData.element.classList.add('focused');
    windowData.element.style.zIndex = this.nextZIndex++;
    this.focusedWindow = id;
    
    // Update modal overlay
    if (this.modalOverlay) {
      this.modalOverlay.classList.add('active');
    }
  }
  
  /**
   * Minimize window
   */
  minimizeWindow(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;
    
    windowData.isMinimized = !windowData.isMinimized;
    windowData.element.classList.toggle('minimized');
    
    if (windowData.onMinimize) {
      windowData.onMinimize(windowData.isMinimized);
    }
  }
  
  /**
   * Maximize/Restore window
   */
  maximizeWindow(id) {
    const windowData = this.windows.get(id);
    if (!windowData || !windowData.maximizable) return;
    
    windowData.isMaximized = !windowData.isMaximized;
    windowData.element.classList.toggle('maximized');
    
    if (windowData.onMaximize) {
      windowData.onMaximize(windowData.isMaximized);
    }
  }
  
  /**
   * Close window
   */
  closeWindow(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;
    
    // Call onClose callback
    if (windowData.onClose) {
      windowData.onClose();
    }
    
    // Remove window
    windowData.element.classList.add('closing');
    setTimeout(() => {
      windowData.element.remove();
      this.windows.delete(id);
      
      // Update modal overlay
      if (this.windows.size === 0 && this.modalOverlay) {
        this.modalOverlay.classList.remove('active');
      }
    }, 300);
  }
  
  /**
   * Get window by ID
   */
  getWindow(id) {
    return this.windows.get(id)?.element;
  }
  
  /**
   * Get window content area
   */
  getWindowContent(id) {
    return this.windows.get(id)?.element.querySelector('.window-content');
  }
  
  /**
   * Set window content
   */
  setWindowContent(id, content) {
    const contentEl = this.getWindowContent(id);
    if (!contentEl) return;
    
    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else {
      contentEl.innerHTML = '';
      contentEl.appendChild(content);
    }
  }
  
  /**
   * Get all windows
   */
  getAllWindows() {
    return Array.from(this.windows.values());
  }
  
  /**
   * Close all windows
   */
  closeAllWindows() {
    const ids = Array.from(this.windows.keys());
    ids.forEach(id => this.closeWindow(id));
  }
}

// Singleton instance
const windowManager = new WindowManager();

/**
 * Initialize window manager
 */
async function initializeWindowManager() {
  await windowManager.initialize();
}

export { windowManager, initializeWindowManager, WindowManager };
