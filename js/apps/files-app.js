/**
 * DreamByte OS - Files Application
 * Virtual file system browser
 * @module apps/files-app
 */

import { BaseApp } from '../core/app-framework.js';
import { storage } from '../core/storage-manager.js';

class FilesApp extends BaseApp {
  constructor() {
    super('Files', '📁');
    this.currentPath = '/';
    this.files = [];
  }
  
  async initialize() {
    // Load files from storage
    this.files = await storage.getAll('files') || [];
    
    // Create window
    this.createWindow({
      width: 700,
      height: 600
    });
    
    // Build UI
    this.buildUI();
  }
  
  buildUI() {
    const content = this.getWindowContent();
    
    content.innerHTML = `
      <div class="files-container">
        <div class="files-toolbar">
          <button class="files-btn-new">+ New Folder</button>
          <input type="text" class="files-search" placeholder="Search files...">
        </div>
        <div class="files-breadcrumb">
          <span class="breadcrumb-item">Home</span>
        </div>
        <div class="files-grid"></div>
      </div>
    `;
    
    this.updateFilesList();
  }
  
  updateFilesList() {
    const grid = this.getWindowContent().querySelector('.files-grid');
    grid.innerHTML = '';
    
    this.files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <div class="file-icon">${file.isFolder ? '📁' : '📄'}</div>
        <div class="file-name">${file.name}</div>
      `;
      
      item.addEventListener('dblclick', () => {
        if (file.isFolder) {
          this.openFolder(file.id);
        }
      });
      
      grid.appendChild(item);
    });
  }
  
  openFolder(folderId) {
    this.currentPath += folderId + '/';
    this.updateFilesList();
  }
}

export { FilesApp };
