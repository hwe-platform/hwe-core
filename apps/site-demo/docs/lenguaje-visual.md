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
| **Barra superior** | `--primary` con texto `--primary-foreground` | |
| **Botón principal** | `--secondary` de fondo | El CTA destacado es dorado, no verde |
| **Separadores sobre oscuro** | blanco al 20% | |
| **Fondos alternos de sección** | `--card` ↔ `--muted` al 40% | Se alternan en secciones consecutivas |

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
