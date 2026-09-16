# Colecciones y globals de Payload

Configs de Payload derivados de los schemas Zod de `@hwe-platform/core-ui`
(DEC-004: Zod es la fuente de verdad, Payload deriva de él, nunca al revés).

La derivación no es automática: los schemas Zod modelan la **forma de lectura**
(lo que Payload devuelve) y no llevan la metainformación que un config necesita
(`localized`, `required`, labels, destino de los `upload`/`relationship`). Por eso
los configs se escriben a mano y un **test de paridad** comprueba que los campos
de cada config coinciden con las claves de su schema Zod. Si alguien añade un
campo en un sitio y no en el otro, el test falla.

## TODO Hito 5 — antes de extraer estas colecciones a core-ui

Revisar qué campos son **base obligatorio** y cuáles **extensión por tipo de web**
antes de mover nada a `@hwe-platform/core-ui`.

Hoy el modelo está calcado del primer cliente de referencia (un camping). Campos
como `accommodations.specs.petFriendly`, `type: 'emplacement'` o el bloque de
`booking` con `engine: mastercamping` son de dominio camping, no universales. Un
hotel urbano necesitaría otros (categoría de habitación, régimen de pensión,
check-in/check-out) y no usaría la mitad de los actuales.

Sacar esto a core-ui tal cual condenaría a cada cliente a arrastrar campos que no
le sirven, que es justo lo que DEC-007 quiere evitar. La decisión de qué es núcleo
y qué es extensión hay que tomarla **antes** de la extracción, no después.

Seguimiento: issue "Definir schemas base vs extensiones por tipo de web" (hito-5)
y `docs/arquitectura/schemas-base-extensiones.md` en hwe-tools.
