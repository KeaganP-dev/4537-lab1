class TextManager {
    constructor() {
        this.injectText();
    }

    // Method to inject text into specific elements
    injectText() {
        this.setTextContent('home', TEXTCONTENT.home);
        this.setTextContent('indexTitle', TEXTCONTENT.indexTitle);
        this.setTextContent('creatorName', TEXTCONTENT.creatorName);
        this.setTextContent('reader', TEXTCONTENT.reader);
        this.setTextContent('writer', TEXTCONTENT.writer);
        this.setTextContent('readerTitle', TEXTCONTENT.readerTitle);
        this.setTextContent('writerTitle', TEXTCONTENT.writerTitle);
        this.setTextContent('readerHeader', TEXTCONTENT.readerHeader);
        this.setTextContent('writerHeader', TEXTCONTENT.writerHeader);
        this.setTextContent('updated', TEXTCONTENT.updated);
        this.setTextContent('stored', TEXTCONTENT.stored);
        this.setTextContent('addButton', TEXTCONTENT.addButton);
        this.setTextContent('return', TEXTCONTENT.return);
    }

    // Helper method to set text content if the element is present
    setTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
}


class Note {
    constructor(content) {
      this.content = content;
    }
  }
  
  class NotesManager {
    constructor() {
      this.notes = [];
      this.loadNotesFromLocalStorage();  // Load existing notes from local storage
    }
  
    // Add a new note to the list
    addNote(content) {
      const note = new Note(content);
      this.notes.push(note);
      this.saveNotesToLocalStorage();  // Save to local storage after adding
    }
  
    // Remove note by index
    removeNote(index) {
      this.notes.splice(index, 1);  // Remove note at the specified index
      this.saveNotesToLocalStorage();  // Save updated notes
    }
  
    // Get all notes
    getNotes() {
      return this.notes;
    }
  
    // Save notes to local storage
    saveNotesToLocalStorage() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
      appManager.updateStoredAt();  // Update the "stored at" timestamp
    }
  
    // Load notes from local storage
    loadNotesFromLocalStorage() {
      const notes = JSON.parse(localStorage.getItem('notes'));
      if (notes) {
        this.notes = notes;
      }
    }
  }
  
  class AppManager {
    constructor() {
      this.notesManager = new NotesManager();  // Manage notes via NotesManager
      this.textManager = new TextManager();    // Manage text via TextManager
      this.renderNotes();    // Render notes saved in local storage
      this.updateStoredAt(); // Update the "stored at" timestamp
    }
  
    // Add an empty note
    addEmptyNote() {
      const ul = document.getElementById("notes-list");
      const li = document.createElement("li");
  
      // Create input field for the note
      const input = document.createElement("input");
      input.type = "text";
      input.addEventListener("input", () => {
        this.updateNoteContent(li, input.value);
      });
  
      
    console.log("writer");
    // Create a remove button for the note
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove");
    removeButton.textContent = TEXTCONTENT.remove;
    removeButton.addEventListener("click", () => {
        this.removeNoteFromList(li);
    });


  
      // Add the input field and remove button to the list item
      li.appendChild(input);
      li.appendChild(removeButton);

      ul.appendChild(li);
  
      // Add empty note to the NotesManager
      this.notesManager.addNote("");
    }
  
    // Remove a note from the list and local storage
    removeNoteFromList(noteElement) {
      const index = Array.from(noteElement.parentNode.children).indexOf(noteElement);
      this.notesManager.removeNote(index);
      noteElement.remove();
    }
  
    // Update the content of a note in NotesManager
    updateNoteContent(noteElement, content) {
      const index = Array.from(noteElement.parentNode.children).indexOf(noteElement);
      this.notesManager.notes[index].content = content;
      this.notesManager.saveNotesToLocalStorage();
    }
  
    // Render the notes from the NotesManager
    renderNotes() {
      const notes = this.notesManager.getNotes();
      const ul = document.getElementById('notes-list');
      ul.innerHTML = '';  // Clear existing notes
  
      notes.forEach((note, index) => {
        const li = document.createElement("li");
  
        // Create input field for the note content
        const input = document.createElement("input");
        input.type = "text";
        input.value = note.content;
        input.addEventListener("input", () => {
          this.updateNoteContent(li, input.value);
        });
  
        li.appendChild(input);
        if (window.location.href.includes("writer")) {
            // Create remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = TEXTCONTENT.remove;
            removeButton.classList.add("remove");
            removeButton.addEventListener("click", () => {
            this.removeNoteFromList(li);
            });

            li.appendChild(removeButton);
        }
  
        // Add input and remove button to the list item
        ul.appendChild(li);
      });
    }
  
    // Update the "stored at" timestamp
    updateStoredAt() {
      const storedAtElement = document.getElementById('stored');
      const currentTime = new Date().toLocaleString();
      storedAtElement.textContent = storedAtElement.textContent.replace(/:.+$/, `: ${currentTime}`);
    }
  }
  
  // Initialize the AppManager
  const appManager = new AppManager();
  