Wikidata Guessr
===============

Guess the locations of random Wikidata items!

This fork shows only **tourist places in Colombia** in one combined category: monuments, historic sites, and national parks (145 items with image and coordinates). Museums are excluded (no items with photo and coordinates).

Based on [whereami](https://github.com/webdevbrian/whereami), a GeoGuessr reimplementation by [Brian Kinney](http://www.thebriankinney.com/).

Running locally
---------------

No build step is required. Serve the project with a local HTTP server (opening `index.html` directly as a file can cause CORS issues with the Wikidata API).

**Option 1 – Python 3:**
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**Option 2 – Node.js (npx):**
```bash
npx serve .
```
Then open the URL shown in the terminal (e.g. http://localhost:3000).

License: GPLv3+
===============
