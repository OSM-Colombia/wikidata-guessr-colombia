# Wikidata Guessr – Colombia

Adivina en el mapa dónde está cada lugar. Este proyecto es un fork que muestra **solo lugares turísticos de Colombia**: monumentos, sitios históricos y parques nacionales (unos 145 ítems con imagen y coordenadas en Wikidata). Los museos quedan fuera porque no hay ítems con foto y coordenadas en la consulta.

## Origen del proyecto

Este repositorio es un fork de **[wikidata-guessr](https://github.com/blinry/wikidata-guessr)** (por [blinry](https://morr.cc/)), que es quien montó la base del juego: consultas a **Wikidata**, imágenes desde **Wikimedia Commons** y mapas con **OpenStreetMap**. A partir de ese código se adaptó el juego para centrarlo en Colombia y en las categorías indicadas (monumentos, sitios históricos y parques nacionales).

*wikidata-guessr* a su vez está basado en [whereami](https://github.com/webdevbrian/whereami), una reimplementación tipo GeoGuessr de [Brian Kinney](http://www.thebriankinney.com/).

## Cómo aparecer en el juego (Wikidata + Commons)

Las fotos se suben a **Wikimedia Commons** como siempre. Para que un lugar salga en el juego, su **ítem en Wikidata** debe tener estas propiedades:

| Propiedad | Descripción | Ejemplo |
|-----------|-------------|---------|
| **P18** (imagen) | Imagen principal del lugar (archivo de Commons) | `Monumento a Bolívar.jpg` |
| **P17** (país) | Debe ser **Q739** (Colombia) | Q739 |
| **P625** (coordenadas) | Ubicación geográfica | Punto con lat/lon |
| **P31** (instancia de) | Tipo: monumento (**Q33506**), sitio histórico (**Q839954**) o parque nacional (**Q46169**) | Q33506, Q839954 o Q46169 |

En resumen: sube la foto a Commons y en el ítem de Wikidata del lugar añade **P18** (archivo en Commons), **P17** = Colombia, **P625** = coordenadas, y **P31** (o una subclase vía P279) = monumento, sitio histórico o parque nacional. Sin P18 y P625 el ítem no entra en la consulta.

**Ejemplo:** El [Museo del Oro (Bogotá)](https://www.wikidata.org/wiki/Q1109031) en Wikidata tiene P18, P17, P625 y P31 correctamente y sirve de referencia (los museos no entran en el juego por la consulta actual, pero el ítem ilustra las propiedades).

Si en el juego el lugar no se ve bien en el mapa (porque el mapa usa OpenStreetMap), puedes **mapearlo opcionalmente** en [OpenStreetMap](https://www.openstreetmap.org/): añade o mejora el punto de interés (POI) en la zona para que el lugar quede representado en el mapa.

## Cómo ejecutarlo en local

No hace falta ningún paso de compilación. Sirve el proyecto con un servidor HTTP local (abrir `index.html` como archivo puede dar problemas de CORS con la API de Wikidata).

**Opción 1 – Python 3:**
```bash
python3 -m http.server 8000
```
Luego abre http://localhost:8000 en el navegador.

**Opción 2 – Node.js (npx):**
```bash
npx serve .
```
Abre la URL que muestre la terminal (por ejemplo http://localhost:3000).

## Licencia

Este proyecto se distribuye bajo **GPLv3 o posterior** (GPLv3+). Eso significa que puedes usar, modificar y redistribuir el código, y que las obras derivadas deben publicarse bajo la misma licencia. El texto completo de la licencia está en el repositorio; si no ves un archivo `LICENSE`, puedes consultar [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).
