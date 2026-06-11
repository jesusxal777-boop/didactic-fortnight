/**
 * DreamByte OS - Notes Application
 * Simple note-taking application
 * @module apps/notes-app
 */

import { BaseApp } from '../core/app-framework.js';
import { storage } from '../core/storage-manager.js';

class NotesApp extends BaseApp {
  constructor() {
    super('Notes', '📝');
    this.notes = [];
    this.currentNoteId = null;
  }
  
  async initialize() {
    // Load notes from storage
    this.notes = await storage.getAll('notes') || [];
    
    // Create window
    this.createWindow({
      width: 500,
      height: 600
    });
    
    // Build UI
    this.buildUI();
  }
  
  buildUI() {
    const content = this.getWindowContent();
    
    content.innerHTML = `
      <div class="notes-container">
        <div class="notes-sidebar">
          <button class="notes-new-btn">+ New Note</button>
          <div class="notes-list"></div>
        </div>
        <div class="notes-editor">
          <textarea class="notes-input" placeholder="Start typing..."></textarea>
        </div>
      </div>
    `;
    
    const newBtn = content.querySelector('.notes-new-btn');
    const notesList = content.querySelector('.notes-list');
    const input = content.querySelector('.notes-input');
    
    // New note button
    newBtn.addEventListener('click', () => this.createNote());
    
    // Load notes list
    this.updateNotesList();
  }
  
  createNote() {
    const note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    storage.set('notes', note).then(() => {
      this.notes.push(note);
      this.currentNoteId = note.id;
      this.updateNotesList();
    });
  }
  
  updateNotesList() {
    const notesList = this.getWindowContent().querySelector('.notes-list');
    const input = this.getWindowContent().querySelector('.notes-input');
    
    notesList.innerHTML = '';
    
    this.notes.forEach(note => {
      const item = document.createElement('div');
      item.className = 'notes-item';
      if (note.id === this.currentNoteId) {
        item.classList.add('active');
      }
      
      item.innerHTML = `
        <div class="notes-item-title">${note.title || 'Untitled'}</div>
        <div class="notes-item-preview">${note.content.substring(0, 30)}...</div>
      `;
      
      item.addEventListener('click', () => this.selectNote(note.id));
      notesList.appendChild(item);
    });
    
    // Load current note
    if (this.currentNoteId) {
      const currentNote = this.notes.find(n => n.id === this.currentNoteId);
      if (currentNote) {
        input.value = currentNote.content;
        input.onchange = () => this.saveNote();
      }
    }
  }
  
  selectNote(noteId) {
    this.currentNoteId = noteId;
    this.updateNotesList();
  }
  
  saveNote() {
    const input = this.getWindowContent().querySelector('.notes-input');
    const note = this.notes.find(n => n.id === this.currentNoteId);
    
    if (note) {
      note.content = input.value;
      note.updated = new Date().toISOString();
      storage.set('notes', note);
    }
  }
}

export { NotesApp };
