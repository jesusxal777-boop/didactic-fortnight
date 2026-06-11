/**
 * DreamByte OS - Storage Manager
 * Unified storage system using LocalStorage and IndexedDB
 * @module core/storage-manager
 */

const STORAGE_PREFIX = 'dreambye_';
const DB_NAME = 'DreamByteOS';
const DB_VERSION = 1;

class StorageManager {
  constructor() {
    this.db = null;
    this.stores = ['windows', 'apps', 'files', 'projects', 'settings'];
  }
  
  /**
   * Initialize IndexedDB
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
          }
        });
      };
    });
  }
  
  /**
   * Save to localStorage
   */
  setLocal(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage full or disabled:', e);
    }
  }
  
  /**
   * Get from localStorage
   */
  getLocal(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
      return defaultValue;
    }
  }
  
  /**
   * Remove from localStorage
   */
  removeLocal(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }
  }
  
  /**
   * Save to IndexedDB
   */
  async set(store, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('IndexedDB not initialized'));
      
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = data.id ? objectStore.put(data) : objectStore.add(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  /**
   * Get from IndexedDB
   */
  async get(store, key) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('IndexedDB not initialized'));
      
      const transaction = this.db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  /**
   * Get all from store
   */
  async getAll(store) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('IndexedDB not initialized'));
      
      const transaction = this.db.transaction([store], 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  /**
   * Delete from IndexedDB
   */
  async delete(store, key) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('IndexedDB not initialized'));
      
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  
  /**
   * Clear store
   */
  async clear(store) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('IndexedDB not initialized'));
      
      const transaction = this.db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Singleton instance
const storage = new StorageManager();

/**
 * Initialize storage manager
 */
async function initializeStorage() {
  try {
    await storage.initialize();
  } catch (error) {
    console.warn('Failed to initialize IndexedDB, using LocalStorage only:', error);
  }
}

export { storage, initializeStorage, StorageManager };
