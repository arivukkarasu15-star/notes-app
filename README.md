# Notes App

A lightweight notes app built with HTML, CSS, and JavaScript. It runs as a website on Netlify and can also be opened in a native desktop window using Python (pywebview).

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

### Run as a website locally

This is a static site and does not need a build step. From the project folder, start any static file server, for example:

```
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

### Deploy to Netlify

The included `netlify.toml` publishes the project folder directly; no build command or environment variables are needed. In Netlify, choose **Add new site → Import an existing project**, connect this repository, and deploy with the default settings. For a manual deploy, drag the project folder into Netlify Drop.

Notes are stored in the current browser's local storage. They stay in that browser on that device and are not synced between devices or users.

### Run as a desktop app

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
