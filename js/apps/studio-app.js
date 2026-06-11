/**
 * DreamByte OS - Studio Application
 * Code editor with HTML, CSS, and JavaScript support
 * @module apps/studio-app
 */

import { BaseApp } from '../core/app-framework.js';
import { storage } from '../core/storage-manager.js';

class StudioApp extends BaseApp {
  constructor() {
    super('Studio', '💻');
    this.currentProject = null;
    this.html = '';
    this.css = '';
    this.js = '';
  }
  
  async initialize() {
    // Load project from storage
    const saved = await storage.getLocal('studioProject', null);
    if (saved) {
      this.html = saved.html || '';
      this.css = saved.css || '';
      this.js = saved.js || '';
    }
    
    // Create window
    this.createWindow({
      width: 1000,
      height: 700
    });
    
    // Build UI
    this.buildUI();
  }
  
  buildUI() {
    const content = this.getWindowContent();
    
    content.innerHTML = `
      <div class="studio-container">
        <div class="studio-editors">
          <div class="studio-editor-section">
            <div class="studio-editor-header">HTML</div>
            <textarea class="studio-editor html-editor" placeholder="<html></html>"></textarea>
          </div>
          <div class="studio-editor-section">
            <div class="studio-editor-header">CSS</div>
            <textarea class="studio-editor css-editor" placeholder="body { }"></textarea>
          </div>
          <div class="studio-editor-section">
            <div class="studio-editor-header">JavaScript</div>
            <textarea class="studio-editor js-editor" placeholder="console.log();"></textarea>
          </div>
        </div>
        <div class="studio-preview">
          <div class="studio-preview-header">Preview</div>
          <iframe class="studio-iframe" sandbox="allow-scripts"></iframe>
        </div>
      </div>
    `;
    
    const htmlEditor = content.querySelector('.html-editor');
    const cssEditor = content.querySelector('.css-editor');
    const jsEditor = content.querySelector('.js-editor');
    const iframe = content.querySelector('.studio-iframe');
    
    // Set initial values
    htmlEditor.value = this.html;
    cssEditor.value = this.css;
    jsEditor.value = this.js;
    
    // Update preview on change
    const updatePreview = () => {
      this.html = htmlEditor.value;
      this.css = cssEditor.value;
      this.js = jsEditor.value;
      this.renderPreview(iframe);
      this.saveProject();
    };
    
    htmlEditor.addEventListener('input', updatePreview);
    cssEditor.addEventListener('input', updatePreview);
    jsEditor.addEventListener('input', updatePreview);
    
    // Initial preview
    this.renderPreview(iframe);
  }
  
  renderPreview(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${this.css}</style>
      </head>
      <body>
        ${this.html}
        <script>${this.js}</script>
      </body>
      </html>
    `;
    
    doc.open();
    doc.write(html);
    doc.close();
  }
  
  saveProject() {
    storage.setLocal('studioProject', {
      html: this.html,
      css: this.css,
      js: this.js
    });
  }
}

export { StudioApp };
