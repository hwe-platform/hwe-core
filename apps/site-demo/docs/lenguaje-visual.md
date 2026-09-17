# Lenguaje visual — Camping La Civelle

Qué papel juega cada token y qué patrones se repiten en el diseño.

Los tokens (`src/styles/theme.css`) dicen **qué colores hay**. Este documento
dice **cómo se usan**, que es lo que hace que un componente se parezca al
diseño en lugar de solo mostrar los datos correctos.

**De consulta obligatoria antes de construir cualquier componente o bloque.**
Extraído del export según `specs/figma/analisis.md`, punto 4b.

---

## El átomo más repetido: la etiqueta

Aparece **catorce veces** en la home: como supertítulo del hero, como
antetítulo de cada sección y como título de columna del pie.

```
color de acento · tipografía de cuerpo · negrita · MAYÚSCULAS · muy espaciada
```

| Uso | Tamaño | Espaciado | Veces |
|---|---|---|---|
| Antetítulo de sección | 14px | 3.6px | **10** |
| Supertítulo del hero | 14px | 4.6px | 1 |
| Título de columna del pie | 10px | 1.1px | varias |
| Insignia (categoría de artículo) | 12px | 2px, con fondo de acento al 10% y forma de píldora | 1 |

Está implementada como la primitiva **`Eyebrow`** de core-ui. No se escribe a
mano.

**No es un encabezado.** Acompaña al `<h2>` que viene debajo, no lo sustituye:
por eso su etiqueta HTML por defecto es `<p>`.

---

## Papel de cada token

| Elemento | Token | Ojo con |
|---|---|---|
| **Etiquetas y antetítulos** | `--secondary` (dorado) | Es el error más fácil: parecen encabezados y se ponen con la tipografía de titular en blanco. **No.** Van en dorado, tipografía de cuerpo y pequeñas |
| **Enlaces sobre fondo oscuro** | `--primary-foreground` al 70%, hover a `--secondary` | No blanco puro |
| **Iconos junto a datos** | `--secondary` como trazo | El icono es dorado aunque el texto no lo sea |
| **Fondo del pie** | `--footer` (gris muy oscuro) | Distinto de `--primary` |
| **Barra superior y navegación** | `--background` (crema) con borde `--border` | **Nunca `--primary`.** Ver "El chrome" |
| **Botón principal** | `--secondary` de fondo, texto `--primary-foreground` | El CTA destacado es dorado, y su texto **casi blanco**, no verde |
| **Separadores sobre oscuro** | blanco al 20% | |
| **Fondos alternos de sección** | `--card` ↔ `--muted` al 40% | Se alternan en secciones consecutivas |

---

## El chrome

El marco del site —barra superior, navegación, pie— tiene **su propia escala**,
más pequeña que la del contenido. Confundirlas es lo que hace que una web "con
los colores buenos" no se parezca al diseño.

### Las dos barras son claras, no verdes

Ninguna de las dos usa el color de marca de fondo. Las dos van sobre
`--background` (crema) separadas por `--border`. El verde aparece **solo en el
texto**, para marcar lo activo:

| | Altura | Fondo | Texto |
|---|---|---|---|
| Barra superior | 48px móvil / 40px | `--background` | `--muted-foreground` a 11px |
| Navegación | 64px | `--background` | `--foreground`, y `--primary` en activo y hover |

La navegación se queda fija a `top-40px`, justo bajo la barra superior, y al
hacerlo gana sombra.

### La escala tipográfica del chrome

Muy por debajo de la del contenido. Nada aquí usa `text-sm` del sistema:

```
enlaces de servicio   11px · medium   · versalitas · tracking-wide
entradas de menú      11px · bold     · versalitas · tracking-[1.16px]
hijos de desplegable  12px · medium
botón de reserva      11px · bold     · versalitas · tracking-[1.2px] · 28px de alto
```

### La sección activa se marca con un subrayado dorado

Barra de 2px pegada al borde inferior de la entrada, en `--secondary`. Al pasar
por encima se insinúa al 50%. **No** se marca con fondo ni con negrita extra.

### Desplegables

`rounded-2xl`, sombra grande, borde `--border` y fondo `--background`. Cada hijo
lleva un borde izquierdo transparente que vira a dorado al pasar por encima. A
partir de 6 hijos pasa a **dos columnas** de 440px; a partir de la séptima
entrada del menú se alinea a la derecha para no salirse de la pantalla.

### Botón de acento

`--secondary` de fondo y `--primary-foreground` de texto — casi blanco sobre
oro. **El tema declara `--secondary-foreground` en verde oscuro y el diseño no
lo usa nunca**: es un resto del tema por defecto de shadcn. En este site ese
token se ha corregido a `#fcfcf1` para que la primitiva `Button` dé el par que
el diseño pide sin casos especiales.

### El logo viene en blanco

El export solo trae la versión blanca, y le aplica `invert` cada vez que la pone
sobre fondo claro. En Payload van **las dos versiones**: `logo` la oscura, para
las barras; `logoInverted` la blanca, para el pie y el menú móvil. El
componente no lleva filtros: el color del logo es un dato del cliente.

---

## Ritmo y contenedor

Constantes en **todas** las secciones de contenido:

```
contenedor   max-w-[1440px] · mx-auto · px-4 sm:px-6 lg:px-8
ritmo        py-16 md:py-24 lg:py-32
```

No se inventa espaciado por sección. Si una necesita otro, es una excepción que
hay que justificar.

---

## Jerarquía tipográfica

| Nivel | Tipografía | Notas |
|---|---|---|
| Titulares (h1–h6) | `--heading-font` (serif), negrita | Escala fluida con `clamp()`, ya en `globals.css` |
| Cuerpo y etiquetas | `--body-font` (sans) | |
| Párrafo destacado | cuerpo a 20–22px | Abre varias secciones editoriales |
| Cita | cuerpo en cursiva | Reseñas |

El titular de sección suele partirse en **dos líneas**, con la segunda en color
de acento. Es un recurso deliberado, no un salto accidental.

---

## Otros patrones

- **Botón**: `rounded-2xl`, `px-8 py-3.5`, con flecha a la derecha. Tres
  variantes: sólido primario, sólido de acento y contorno.
- **Enlace "ver todo"**: texto grande en negrita con borde inferior al 20% del
  color primario, más flecha.
- **Icono en marco circular**: círculo con borde fino y el icono centrado.
  Tamaños de 48 a 96px según la sección.
- **Tarjeta con imagen de fondo**: degradado de negro desde abajo para que el
  texto se lea, con el contenido anclado al borde inferior.

---

## Errores cometidos al no tener este documento

Se registran para que no se repitan:

1. **El pie se construyó leyendo la historia de usuario, no el diseño.** Los
   títulos de columna salieron en blanco con tipografía de titular, cuando el
   diseño los quiere como etiquetas doradas. Los datos eran correctos y el
   resultado no se parecía.
2. **No se pintó el bloque de contacto**, aunque el editor lo había rellenado
   en `site-config` y el diseño lo pone como primera columna del pie.
3. **Las redes y los pagos salieron como texto plano**, cuando el diseño usa
   iconos circulares e insignias.
4. **La barra superior se pintó verde.** El diseño la quiere crema con texto
   gris de 11px. El fallo venía de este mismo documento, que en su primera
   versión decía "barra superior: `--primary`" — se escribió de memoria en
   lugar de leer el export. Un documento con el dato mal es peor que no
   tenerlo: da confianza.
5. **El botón dorado salió con texto verde oscuro.** Se usó la primitiva
   `Button` con su par `--secondary` / `--secondary-foreground`, sin comprobar
   que el diseño nunca usa ese par. El error estaba en el token del cliente,
   no en la primitiva.
6. **La navegación se construyó sin estado activo ni subrayado**, que es lo
   único que en este diseño indica dónde estás.
7. **Los rótulos fijos del pie quedaron en castellano** ("Contacto",
   "Síguenos") dentro de un site en francés. Se escribieron en el idioma de la
   conversación, no en el del cliente.
8. **Se sembraron 6 entradas de menú de las 8 del diseño y 2 columnas de pie
   de las 5.** Faltaba contenido, no código: la mitad de lo que parecía un
   fallo de maquetación era el seed incompleto. Conviene descartar eso antes
   de tocar componentes.
