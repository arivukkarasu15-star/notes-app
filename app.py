import webview

if __name__ == "__main__":
    webview.create_window(
        "Notes", "index.html",
        width=850, height=600, min_size=(500, 400)
    )
    webview.start(private_mode=False)
