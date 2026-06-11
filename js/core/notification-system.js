/**
 * DreamByte OS - Notification System
 * Handle toasts, alerts, and notifications
 * @module core/notification-system
 */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.defaultDuration = 5000;
  }
  
  /**
   * Initialize notification system
   */
  async initialize() {
    this.container = document.getElementById('notificationCenter');
  }
  
  /**
   * Show notification
   */
  show(options = {}) {
    const {
      type = 'info',
      title = 'Notification',
      message = '',
      duration = this.defaultDuration,
      icon = this.getIconForType(type)
    } = options;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close">✕</button>
      <div class="notification-progress"></div>
    `;
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.remove(notification);
    });
    
    this.container.appendChild(notification);
    this.notifications.push(notification);
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration);
    }
    
    return notification;
  }
  
  /**
   * Show info notification
   */
  info(title, message) {
    return this.show({ type: 'info', title, message });
  }
  
  /**
   * Show success notification
   */
  success(title, message) {
    return this.show({ type: 'success', title, message });
  }
  
  /**
   * Show warning notification
   */
  warning(title, message) {
    return this.show({ type: 'warning', title, message });
  }
  
  /**
   * Show error notification
   */
  error(title, message) {
    return this.show({ type: 'error', title, message });
  }
  
  /**
   * Remove notification
   */
  remove(notification) {
    notification.classList.add('closing');
    setTimeout(() => {
      notification.remove();
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }
  
  /**
   * Get icon for notification type
   */
  getIconForType(type) {
    const icons = {
      info: 'ℹ️',
      success: '✓',
      warning: '⚠️',
      error: '✕'
    };
    return icons[type] || icons.info;
  }
  
  /**
   * Clear all notifications
   */
  clearAll() {
    this.notifications.forEach(n => this.remove(n));
  }
}

// Singleton instance
const notifications = new NotificationSystem();

/**
 * Initialize notification system
 */
async function initializeNotifications() {
  await notifications.initialize();
}

export { notifications, initializeNotifications, NotificationSystem };
