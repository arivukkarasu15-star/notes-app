let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeId = null;

const noteList = document.getElementById("noteList");
const searchInput = document.getElementById("searchInput");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const timestamp = document.getElementById("timestamp");
const emptyState = document.getElementById("emptyState");
const editorContent = document.getElementById("editorContent");

function save() {
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

function render() {
  const query = searchInput.value.trim().toLowerCase();
  noteList.innerHTML = "";

  notes
    .filter(n => (n.title + " " + n.body).toLowerCase().includes(query))
    .forEach(note => {
      const li = document.createElement("li");
      li.className = "note-card" + (note.id === activeId ? " active" : "");
      li.style.setProperty("--card-tag", `hsl(${note.hue}, 45%, 55%)`);
      li.onclick = () => selectNote(note.id);

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

function selectNote(id) {
  activeId = id;
  const note = notes.find(n => n.id === id);
  titleInput.value = note.title;
  bodyInput.value = note.body;
  timestamp.textContent = "Edited " + relativeTime(note.updatedAt);
  emptyState.style.display = "none";
  editorContent.classList.add("visible");
  render();
}

function closeEditor() {
  activeId = null;
  emptyState.style.display = "flex";
  editorContent.classList.remove("visible");
  render();
}

function createNote() {
  const now = Date.now();
  const note = { id: now, title: "", body: "", updatedAt: now, hue: Math.floor(Math.random() * 360) };
  notes.unshift(note);
  save();
  selectNote(note.id);
  titleInput.focus();
}

document.getElementById("newBtn").onclick = createNote;
document.getElementById("emptyNewBtn").onclick = createNote;

document.getElementById("deleteBtn").onclick = () => {
  notes = notes.filter(n => n.id !== activeId);
  save();
  closeEditor();
};

function updateActiveNote() {
  const note = notes.find(n => n.id === activeId);
  if (!note) return;
  note.title = titleInput.value;
  note.body = bodyInput.value;
  note.updatedAt = Date.now();
  timestamp.textContent = "Edited " + relativeTime(note.updatedAt);
  save();
  render();
}

titleInput.oninput = updateActiveNote;
bodyInput.oninput = updateActiveNote;

const saveBtn = document.getElementById("saveBtn");
saveBtn.onclick = () => {
  updateActiveNote();
  timestamp.textContent = "Saved just now";
  saveBtn.classList.add("saved");
  setTimeout(() => saveBtn.classList.remove("saved"), 900);
};

searchInput.oninput = render;

const themeBtn = document.getElementById("themeBtn");
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    if (activeId) saveBtn.click();
  }
});

render();
closeEditor();
