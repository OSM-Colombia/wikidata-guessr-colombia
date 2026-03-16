Wikidata Guessr
===============

Guess the locations of random Wikidata items!

This fork shows only **tourist places in Colombia** in one combined category: monuments, historic sites, and national parks (145 items with image and coordinates). Museums are excluded (no items with photo and coordinates).

Based on [whereami](https://github.com/webdevbrian/whereami), a GeoGuessr reimplementation by [Brian Kinney](http://www.thebriankinney.com/).

Cómo aparecer en el juego (Wikidata + Commons)
-----------------------------------------------

Las fotos se suben a **Wikimedia Commons** como siempre. Para que un lugar salga en el juego, hace falta que su **ítem en Wikidata** tenga estas propiedades:

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| **P18** (imagen) | Imagen principal del lugar (archivo de Commons) | `Monumento a Bolívar.jpg` |
| **P17** (país) | Debe ser **Q739** (Colombia) | Q739 |
| **P625** (coordenadas) | Ubicación geográfica | Punto con lat/lon |
| **P31** (instancia de) | Tipo de lugar: monumento (**Q33506**), sitio histórico (**Q839954**) o parque nacional (**Q46169**) | Q33506, Q839954 o Q46169 |

Resumen: sube la foto a Commons, luego en el ítem de Wikidata del lugar añade **P18** con el nombre del archivo en Commons, **P17** = Colombia, **P625** = coordenadas, y **P31** (o una subclase vía P279) = monumento, sitio histórico o parque nacional. Sin P18 y P625 el ítem no entra en la consulta.

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
