# Análisis del Figma Make — Camping La Civelle

Inventario del export `figma-makes/la-civelle/`, aplicando el método de
`specs/figma/analisis.md` (hwe-tools).

**Fuente:** 3 páginas, 2319 líneas de JSX, 55 imágenes y 1 vídeo.
Vive aquí y no en hwe-tools porque son datos de un cliente (DEC-002).

---

## Resumen

**~24 secciones de contenido que se reducen a 10 patrones.** Cinco componentes
cubren 18 de esas 24.

| Patrón | Usos | Dónde |
|---|---|---|
| **Split media/texto invertible** | **7** | Home ×4 (Intro, Restaurant, Piscine, Accès), Le Camping ×2, ficha ×1 |
| **Hero con overlay** | **3** | Home (vídeo), Le Camping, ficha |
| **Grid de iconos en círculo** | **3** | Home ×2 (3 y 6 col), Le Camping (5 col) |
| **Grid de tarjetas imagen+cuerpo** | **3** | Actualités, Découvrez aussi, otra location |
| **Grid de tarjetas-imagen con overlay** | **2** | Hébergements (5/7), Alentours (4 col) |

De un solo uso: reseñas, galería cuadrada de Instagram, carrusel, barra de
estadísticas, barra de specs, galería con miniaturas, lista de equipamiento,
composición de habitaciones, tarjetas de condiciones, tabla de disponibilidad.

---

## Home (13 secciones)

| # | Sección | Patrón | Contenido destacado |
|---|---|---|---|
| 1 | Hero vídeo | pantalla completa, vídeo de fondo + doble oscurecimiento | «Capbreton · Landes · Atlantique». **Sin `<h1>` de texto**: el título es el logo |
| 2 | Nav principal sticky | barra de 64px, pasa a fija al hacer scroll | 8 entradas, dos con desplegable a 2 columnas |
| 3 | Intro editorial | split 5/7 + sub-grid de 2 temas | «Bienvenue au Camping La Civelle, votre camping à Capbreton au cœur des Landes». **Medallón «Depuis 30 Ans»** sobre la imagen |
| 4 | Pourquoi choisir La Civelle | 3 col, icono circular, sin tarjeta | «Au cœur de la forêt landaise», «À 800 m des plages», «Esprit familial & convivial» |
| 5 | Nos Hébergements | tarjetas-imagen overlay, 5/7 | «Nos Emplacements», «Nos Locations» |
| 6 | Avis / GuestSuite | 3 tarjetas de reseña | «4,8 / 5 · 328 avis vérifiés». Sophie M., Marc L., Julie D. |
| 7 | Le Restaurant | split 7/5, imagen izquierda | Tarjeta de horarios: «Déjeuner 12h00 · 14h30», «Dîner 19h00 · 22h00» |
| 8 | La Piscine | split 5/7 **invertido** | Mini-tarjetas: «Eau chauffée / 26 °C», «Aquagym / Juil. – Août» |
| 9 | Activités & Services | grid de 6 iconos con tarjeta | Épicerie, vélos, laverie, loisirs, barbecues, animations |
| 10 | Découvrez les alentours | tarjetas-imagen overlay, 4 col | Capbreton, Surf & Plages, Pays Basque, Gastronomie |
| 11 | Actualités | 3 tarjetas imagen arriba | 3 artículos. **Imágenes de Unsplash por URL**, no locales |
| 12 | Accès & Localisation | split 7/5, **medio = iframe** | «Route de la Plage · 40130 Capbreton». Coche, tren y avión |
| 13 | Instagram | galería cuadrada 6 fotos | CTA «@camping_lacivelle» en la misma fila que el título |

## Le Camping (6 secciones)

Hero con breadcrumb de 2 niveles · «Un havre de paix dans les Landes» (split
50/50 con **carrusel**) · «Services & équipements» (split invertido, carrusel) ·
banda CTA a sangre completa · «Nos Engagements & Valeurs» (**5 columnas** de
iconos) · «Découvrez aussi» (3 tarjetas imagen arriba).

Exclusivo: **barra de estadísticas** con filete lateral — «11 hectares», «800 m»,
«+30 ans».

## Ficha de alojamiento (6 bloques)

Hero con breadcrumb de **3 niveles** · barra de specs de 4 celdas · módulo intro
split 5/7 con **galería de miniaturas y contador** · composición de habitaciones ·
lista de equipamiento con estado incluido/no incluido · tarjetas de condiciones ·
tabla de disponibilidad y precios · «Notre autre location».

---

## Chrome (compartido por las tres páginas)

Barra superior fija (Aide, Contact, Webcams, Se connecter, idioma, Réserver) ·
menú móvil en panel lateral · navegación sticky · **widget de reservas fijo
abajo** · pie con asistente virtual, 5 columnas, partners, redes y legales ·
botones flotantes de chat y volver arriba.

**El breadcrumb NO es chrome**: vive dentro del hero de cada página.
**La tabla de disponibilidad tampoco**: es un bloque de la ficha, distinto del
widget fijo inferior.

---

## Assets e iconos

55 imágenes (47 PNG, 7 JPG) y el vídeo del hero. **Nombres de fichero en hash**,
sin semántica: el `alt` hay que deducirlo de dónde se usa cada imagen.

Tres iconos SVG propios fuera del set de `lucide-react`: `EauChauffeeIcon`,
`EspritFamilialIcon`, `AnimationsEteIcon`.

---

## Tokens

**Ya transferidos al 100%** a `src/styles/theme.css`. Los valores del export y
los del site son idénticos: `--primary: #0b665d`, `--secondary: #c9a87c`, Bitter
y Inter, `--radius: 1rem`. Lo único que faltaba para el parecido visual es la
composición.

---

## Qué no se copia, y por qué

| Del export | Por qué no |
|---|---|
| Hero de la home **sin `<h1>`** de texto | Deja la página sin encabezado legible. Hay que decidir dónde vive el `<h1>` (HU-009) |
| Clases `items-left`, `justify-left` | **No existen** en Tailwind. Lo que se ve es el valor por defecto, no un diseño |
| Le Camping: dos capas de imagen superpuestas | La de abajo, al 20% de opacidad, queda invisible bajo la otra. Residuo del export |
| Contenedor de botón vacío en la nav | Tiene animación de ancho y opacidad pero no contiene nada |
| Selectores del widget de reservas | Cambian el texto mostrado pero no filtran nada |
| **MUI + Emotion + Radix** (25+ paquetes) | `core-ui` tiene tres dependencias. Las composiciones se reescriben con las primitivas propias |

---

## Mapeo sección → bloque

| Patrón del Figma | Bloque | Historia |
|---|---|---|
| Split media/texto | `media-text` con ejes `media`, `split`, `reverse`, `align` y slots `aside` y `sobreLaImagen` | HU-009 |
| Hero | `hero` con ejes `variant`, `title`, `align`, `breadcrumbs` | HU-009 |
| Grid de iconos | `icon-grid` con `columns` y `variant` | HU-010 |
| Tarjetas (ambas anatomías) | `card-grid` con `card: overlay \| stacked` | HU-010 |
| Reseñas | `reviews-grid` | HU-010 |
| Actualités | `blog` | HU-010 |
| Instagram | `instagram` | HU-011 |
| Galería, mapa, specs, equipamiento, ficha | `gallery`, `map`, `spec-bar`, `accommodation-detail` | HU-011 |

**Sin bloque asignado todavía** — se reportan, no se improvisan:

- **Carrusel** — absorbido como valor del eje `media` de `media-text`
- **Barra de estadísticas** — absorbida por el slot `aside` de `media-text`
- **Composición de habitaciones**, **tarjetas de condiciones** y **tabla de
  disponibilidad** — piezas de la ficha de alojamiento, a decidir en HU-011 si
  son bloques propios o partes del template
