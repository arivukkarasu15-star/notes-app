let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeId = null;
let selectionMode = false;
const selectedIds = new Set();

const noteList = document.getElementById("noteList");
const noteCount = document.getElementById("noteCount");
const noResults = document.getElementById("noResults");
const selectBtn = document.getElementById("selectBtn");
const bulkActions = document.getElementById("bulkActions");
const selectedCount = document.getElementById("selectedCount");
const searchInput = document.getElementById("searchInput");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const timestamp = document.getElementById("timestamp");
const emptyState = document.getElementById("emptyState");
const editorContent = document.getElementById("editorContent");
const sidebarResizer = document.getElementById("sidebarResizer");

const savedSidebarWidth = Number(localStorage.getItem("sidebarWidth"));
if (savedSidebarWidth >= 220 && savedSidebarWidth <= 600) {
  document.documentElement.style.setProperty("--sidebar-width", `${savedSidebarWidth}px`);
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function relativeTime(ms) {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return min + "m ago";
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + "d ago";
  return new Date(ms).toLocaleDateString();
}

function renderNotes() {
  const query = searchInput.value.trim().toLowerCase();
  noteList.innerHTML = "";

  const visibleNotes = notes
    .filter(note => (note.title + " " + note.body).toLowerCase().includes(query));

  noteCount.textContent = notes.length;
  noResults.hidden = visibleNotes.length > 0 || !query;
  bulkActions.hidden = !selectionMode;
  selectedCount.textContent = `${selectedIds.size} selected`;
  selectBtn.textContent = selectionMode ? "Done" : "Select";
  selectBtn.classList.toggle("active", selectionMode);

  visibleNotes
    .forEach(note => {
      const li = document.createElement("li");
      const isSelected = selectedIds.has(note.id);
      li.className = "note-card" + (note.id === activeId ? " active" : "") + (isSelected ? " selected" : "");
      li.style.setProperty("--card-tag", `hsl(${note.hue}, 45%, 55%)`);
      li.addEventListener("click", () => {
        if (selectionMode) {
          toggleNoteSelection(note.id);
        } else {
          selectNote(note.id);
        }
      });

      if (selectionMode) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "note-select";
        checkbox.checked = isSelected;
        checkbox.setAttribute("aria-label", `Select ${note.title || "Untitled"}`);
        checkbox.addEventListener("click", event => event.stopPropagation());
        checkbox.addEventListener("change", () => toggleNoteSelection(note.id));
        li.appendChild(checkbox);
      }

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = note.title || "Untitled";

      const snippet = document.createElement("div");
      snippet.className = "snippet";
      snippet.textContent = note.body.slice(0, 60) || "No content";

      const time = document.createElement("div");
      time.className = "time";
      time.textContent = relativeTime(note.updatedAt);

      li.append(title, snippet, time);
      noteList.appendChild(li);
    });
}

function toggleNoteSelection(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }
  renderNotes();
}

function selectNote(id) {
  activeId = id;
  const note = notes.find(n => n.id === id);
  titleInput.value = note.title;
  bodyInput.value = note.body;
  timestamp.textContent = "Edited " + relativeTime(note.updatedAt);
  emptyState.hidden = true;
  editorContent.classList.add("visible");
  document.body.classList.add("note-open");
  renderNotes();
}

function closeEditor() {
  activeId = null;
  document.body.classList.remove("note-open");
  emptyState.hidden = false;
  editorContent.classList.remove("visible");
  renderNotes();
}

function createNote() {
  const now = Date.now();
  const note = { id: now, title: "", body: "", updatedAt: now, hue: Math.floor(Math.random() * 360) };
  notes.unshift(note);
  saveNotes();
  selectNote(note.id);
  titleInput.focus();
}

document.getElementById("newBtn").onclick = createNote;
document.getElementById("emptyNewBtn").onclick = createNote;
document.getElementById("backBtn").onclick = closeEditor;

document.getElementById("deleteBtn").onclick = () => {
  notes = notes.filter(n => n.id !== activeId);
  saveNotes();
  closeEditor();
};

selectBtn.onclick = () => {
  selectionMode = !selectionMode;
  selectedIds.clear();
  renderNotes();
};

document.getElementById("deleteSelectedBtn").onclick = () => {
  if (selectedIds.size === 0) return;

  notes = notes.filter(note => !selectedIds.has(note.id));
  const deletedActiveNote = selectedIds.has(activeId);
  selectedIds.clear();
  saveNotes();

  if (deletedActiveNote) {
    closeEditor();
  } else {
    renderNotes();
  }
};

function updateActiveNote() {
  const note = notes.find(n => n.id === activeId);
  if (!note) return;
  note.title = titleInput.value;
  note.body = bodyInput.value;
  note.updatedAt = Date.now();
  timestamp.textContent = "Edited " + relativeTime(note.updatedAt);
  saveNotes();
  renderNotes();
}

titleInput.oninput = updateActiveNote;
bodyInput.oninput = updateActiveNote;

const saveBtn = document.getElementById("saveBtn");
saveBtn.onclick = () => {
  updateActiveNote();
  timestamp.textContent = "Saved just now";
  saveBtn.classList.add("saved");
  setTimeout(() => {
    saveBtn.classList.remove("saved");
    closeEditor();
  }, 350);
};

searchInput.oninput = renderNotes;

const themeBtn = document.getElementById("themeBtn");
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

sidebarResizer.addEventListener("pointerdown", event => {
  if (window.innerWidth <= 660) return;

  const initialWidth = document.querySelector(".sidebar").getBoundingClientRect().width;
  const startX = event.clientX;
  sidebarResizer.classList.add("dragging");
  sidebarResizer.setPointerCapture(event.pointerId);

  const resizeSidebar = moveEvent => {
    const maxWidth = Math.min(600, window.innerWidth * 0.55);
    const nextWidth = Math.min(maxWidth, Math.max(220, initialWidth + moveEvent.clientX - startX));
    document.documentElement.style.setProperty("--sidebar-width", `${nextWidth}px`);
  };

  const stopResizing = () => {
    const finalWidth = document.querySelector(".sidebar").getBoundingClientRect().width;
    localStorage.setItem("sidebarWidth", Math.round(finalWidth));
    sidebarResizer.classList.remove("dragging");
    sidebarResizer.removeEventListener("pointermove", resizeSidebar);
    sidebarResizer.removeEventListener("pointerup", stopResizing);
    sidebarResizer.removeEventListener("pointercancel", stopResizing);
  };

  sidebarResizer.addEventListener("pointermove", resizeSidebar);
  sidebarResizer.addEventListener("pointerup", stopResizing);
  sidebarResizer.addEventListener("pointercancel", stopResizing);
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    if (activeId) saveBtn.click();
  }
});

renderNotes();
closeEditor();
