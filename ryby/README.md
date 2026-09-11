# The Fisher

A static first-person fishing game that works on desktop and mobile.

## Run locally

From this folder, run:

```text
python -m http.server 4173
```

Open `http://localhost:4173/` in a browser.

## Publish worldwide with GitHub Pages

1. Create a GitHub repository.
2. Put this folder in the repository and push the `main` branch.
3. In GitHub, open **Settings > Pages**.
4. Set the source to **GitHub Actions**.
5. The included workflow deploys the site automatically.

The public URL will be shown in the repository's **Actions** or **Pages** section. The game uses relative paths, so it works from a GitHub Pages project URL and can be installed on mobile with **Add to Home Screen**. After the first online visit, the service worker caches the game for offline play.

For PC, open `The-Fisher-PC.html` from the downloaded project folder.
