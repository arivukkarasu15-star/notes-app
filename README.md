# Notes App

A lightweight desktop notes app built with HTML, CSS, and JavaScript for the interface, running inside a native window via Python (pywebview) instead of a browser tab.

## Features

- Create, edit, and delete notes
- Search notes by title or content
- Light and dark theme toggle
- Manual save button plus autosave, with "last edited" timestamps
- Notes persist locally between sessions

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Desktop shell:** Python + [pywebview](https://pywebview.flowrl.com/)
- **Storage:** browser localStorage inside the webview

## Running it

```
pip install -r requirements.txt
python app.py
```

This opens the app in its own window, not a browser.

## Files

| File | Purpose |
|---|---|
| `app.py` | Launches the pywebview window |
| `index.html` | App layout |
| `style.css` | Styling and theme variables |
| `script.js` | Note storage, search, and UI logic |
