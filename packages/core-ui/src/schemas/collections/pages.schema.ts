import { z } from 'zod';
import { mediaRefSchema } from './media.schema';
import { payloadIdSchema } from '../payload-id.schema';
import { seoSchema, personalizationEntrySchema } from '../common.schema';

/**
 * Schemas de bloque.
 *
 * Los cinco que el editor ya puede usar (HU-005) tienen sus campos definidos
 * aquí. El resto siguen siendo placeholders con solo `blockType`, lo justo
 * para que `pageBlockSchema` valide de qué tipo es el bloque; su schema
 * completo llega cuando el bloque se construye de verdad (HU-009 en adelante).
 */

/** Enlace con texto, destino y estilo de botón. Compartido por varios bloques. */
export const blockLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link']).default('primary'),
  /**
   * Icono a la derecha del texto, del set de la primitiva `Icon`.
   *
   * Es opcional porque no todos los botones lo llevan: en el Figma la flecha
   * acompaña a los CTA de sección pero no al de reservar.
   */
  icon: z.string().optional(),
});

/**
 * Dominios cuyo contenido se puede incrustar en un `<iframe>`.
 *
 * Con la URL libre, quien edite el panel puede meter dentro de una página
 * nuestra cualquier documento —incluido un `data:text/html` con su propio
 * script— y el visitante lo verá bajo el dominio del cliente. El `sandbox`
 * del componente impide que ese marco toque nuestro origen, pero no que
 * exista. Hasta que haya CSP, la lista es el único filtro.
 *
 * Crece **a propósito**: añadir un proveedor es un acto deliberado, no el
 * efecto colateral de que alguien pegue una URL.
 */
export const DOMINIOS_INCRUSTABLES = [
  'www.google.com',
  'maps.google.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
] as const;

/**
 * Si una URL se puede incrustar: https y de un dominio de la lista.
 *
 * Vive junto al schema y no en el componente porque el dato inválido se
 * rechaza **al escribir**, que es el criterio del resto del modelo. El
 * componente la vuelve a usar como segunda barrera, para lo que se guardó
 * antes de que existiera esta regla.
 */
export function esUrlIncrustable(valor: string): boolean {
  try {
    const { protocol, hostname } = new URL(valor);
    return protocol === 'https:' && DOMINIOS_INCRUSTABLES.includes(hostname as never);
  } catch {
    return false;
  }
}

/** Cabecera opcional que comparten los bloques con título y subtítulo. */
const blockHeadingSchema = {
  title: z.string().optional(),
  subtitle: z.string().optional(),
};

/** Imagen + texto en dos columnas. */
export const mediaTextBlockSchema = z
  .object({
    blockType: z.literal('media-text'),
    ...blockHeadingSchema,

    /**
     * Segunda línea del titular, en color de acento.
     *
     * El diseño parte el titular en dos y tiñe la segunda mitad; el lenguaje
     * visual lo califica de recurso deliberado, no de salto accidental. Vacío
     * deja el titular en una sola línea.
     */
    titleAccent: z.string().optional(),

    /**
     * Fondo de la sección.
     *
     * Las secciones del diseño alternan fondo para separarse entre sí: en La
     * Civelle salen cuatro sobre `card`, dos sobre `muted` y una sin fondo.
     */
    background: z.enum(['default', 'muted', 'none']).default('default'),

    /**
     * Identifica esta instancia ante el registry de slots del site.
     *
     * Los slots son huecos que rellena **código del cliente**, no datos, así que
     * no pueden viajar por Payload. Lo que viaja es este identificador: el site
     * mapea `slotId` → slots en su `slot-registry.ts` y se lo pasa al
     * `BlockRenderer`. Sin él, un override tendría que aplicarse a todas las
     * instancias del bloque en lugar de a la que el editor eligió.
     */
    slotId: z.string().optional(),
    /**
     * Contenido richText serializado por Payload (Lexical).
     *
     * Opcional: en el Figma hay secciones de solo titular e imagen. Ojo, que en
     * Zod 4 un `z.unknown()` suelto **exige la clave**, al revés que en Zod 3.
     */
    content: z.unknown().optional(),

    /**
     * Qué se pinta en la columna del medio. **Eje estructural**: cada valor tiene
     * su propio componente, resuelto por mapa. En La Civelle salen los tres: fotos
     * en la mayoría, el mapa de Google en "Accès" y carruseles en Le Camping.
     */
    media: z.enum(['image', 'embed', 'carousel']).default('image'),
    /** Imagen única, cuando `media` es `image`. */
    image: mediaRefSchema.optional(),
    /** Imágenes del carrusel, cuando `media` es `carousel`. */
    images: z.array(mediaRefSchema).optional(),
    /** URL del contenido incrustado, cuando `media` es `embed`. */
    embedUrl: z
      .string()
      .refine(esUrlIncrustable, {
        message: `Solo se puede incrustar https de: ${DOMINIOS_INCRUSTABLES.join(', ')}`,
      })
      .optional(),

    /**
     * Columnas que ocupa el medio sobre doce. **Número, no enumeración**: el
     * diseño de La Civelle ya usa tres repartos distintos —5 en la intro, 7 en
     * Restaurant y Piscine, 6 en Le Camping—, y fijar la lista de lo visto se
     * rompería con el primer cliente que quiera otro.
     */
    split: z.number().int().min(1).max(11).default(6),
    /** Invierte el orden de las columnas. En el Figma: Piscine y Mobile Home. */
    reverse: z.boolean().default(false),
    /**
     * Línea corta de acento a la izquierda del antetítulo.
     *
     * Es un eje y no un adorno constante: de los diecisiete antetítulos del
     * diseño de referencia la llevan dos —la intro de la home
     * (`App.tsx:548`) y la de Le Camping (`LeCampingPage.tsx:111`)—, así que
     * ponerla siempre sería tan falso como no ponerla nunca.
     */
    eyebrowRule: z.boolean().default(false),
    /** Alineación vertical de las dos columnas. */
    align: z.enum(['start', 'center']).default('center'),
    /**
     * Proporción del marco del medio. Varía entre secciones —4/5 en la intro,
     * apaisada en Restaurant—, así que va como eje y no como valor fijo.
     *
     * Las tres son proporciones reales. Hubo un cuarto valor, `auto`, que se
     * retiró: el marco no tiene más hijo que una imagen en posición absoluta,
     * así que sin proporción se quedaba a cero de alto y no pintaba nada. Un
     * valor que no dibuja no es un valor del eje.
     */
    ratio: z.enum(['portrait', 'landscape', 'square']).default('landscape'),
    /** De cero a dos en el Figma; la lista no tiene tope por diseño. */
    ctas: z.array(blockLinkSchema).default([]),
  })
  /**
   * Cada tipo de medio exige el suyo.
   *
   * Sin esto, un bloque con `media: 'carousel'` y ninguna imagen pasaría la
   * validación y luego no pintaría nada: el editor guardaría tan contento y el
   * fallo aparecería en la web. Es el mismo criterio que el resto del modelo —
   * que el dato inválido se rechace al escribir, no al leer.
   */
  .superRefine((bloque, ctx) => {
    const exigido = { image: 'image', embed: 'embedUrl', carousel: 'images' } as const;
    const campo = exigido[bloque.media];
    const valor = bloque[campo];
    const vacio = valor === undefined || (Array.isArray(valor) && valor.length === 0);

    if (vacio) {
      ctx.addIssue({
        code: 'custom',
        path: [campo],
        message: `Un bloque con media "${bloque.media}" necesita ${campo}`,
      });
    }
  });

/**
 * Rejilla de iconos con etiqueta, para listar servicios o características.
 *
 * Cuatro apariciones en el diseño de referencia y dos ejes reales: cuántos
 * caben en una fila y si cada uno va suelto o dentro de una tarjeta.
 */
export const iconGridBlockSchema = z.object({
  blockType: z.literal('icon-grid'),
  ...blockHeadingSchema,
  /**
   * Cuántos iconos caben en una fila en pantalla grande.
   *
   * **Número, no enumeración.** La Civelle ya usa tres valores —3 en «Pourquoi
   * choisir», 5 en «Nos Engagements» y 6 en «Activités & Services»—, así que
   * fijar la lista de lo visto se rompería con el primer cliente que quiera
   * otro. El dominio es el de la retícula de Tailwind.
   *
   * La rampa responsive **se deriva de este número**, no es otro eje: hasta
   * tres arranca en una columna y a partir de cuatro arranca en dos, que es lo
   * que hace el export.
   */
  columns: z.number().int().min(1).max(12).default(3),
  /**
   * Si cada icono va suelto sobre el fondo o dentro de una tarjeta.
   *
   * **Eje estructural**: el icono suelto y el icono en tarjeta no comparten
   * envoltorio, así que van por mapa —`IconGridBare` e `IconGridCard`— y no
   * por `if`. Lo que comparten es el interior del item: marco circular,
   * etiqueta y descripción opcional.
   */
  variant: z.enum(['bare', 'card']).default('bare'),
  /**
   * Párrafo de entrada entre el titular y la rejilla.
   *
   * Distinto de `subtitle`, que es el antetítulo —una línea corta de
   * contexto sobre el titular—. Este va debajo y es texto corrido; en el
   * diseño lo lleva «Activités & Services» y no lo llevan las otras tres.
   */
  description: z.string().optional(),
  /** Fondo de la sección. Las secciones alternan para separarse entre sí. */
  background: z.enum(['default', 'muted', 'none']).default('default'),
  /** Botón bajo la rejilla. Dos de las cuatro del diseño lo llevan. */
  ctas: z.array(blockLinkSchema).default([]),
  items: z.array(
    z.object({
      /**
       * Nombre del icono. Lo resuelve el bloque contra el registro del site
       * primero y contra el set de la primitiva `Icon` después, porque los
       * SVG propios de un cliente no pueden viajar por Payload.
       */
      icon: z.string(),
      label: z.string(),
      description: z.string().optional(),
    }),
  ),
});

/** Grid de tarjetas con imagen. */
/**
 * Una tarjeta con imagen.
 *
 * Compartida entre `card-grid` y `blog`: las dos pintan la misma anatomía,
 * y un artículo resuelto no es más que una tarjeta con fecha. Tener dos formas
 * para lo mismo obligaría a mantener dos tarjetas.
 */
const cardItemSchema = z.object({
  image: mediaRefSchema,
  title: z.string(),
  /** Segunda línea bajo el titular. */
  subtitle: z.string().optional(),
  /** Etiqueta corta sobre el titular: categoría, zona, tipo. */
  tag: z.string().optional(),
  url: z.string().optional(),
  /** Fecha ya formateada. La da quien resuelve, no la tarjeta. */
  date: z.string().optional(),
  /** Texto del enlace. Sin él la tarjeta no pinta llamada a la acción. */
  readMoreLabel: z.string().optional(),
  /**
   * Tratamiento de la llamada a la acción.
   *
   * Es un eje y no un valor fijo: el diseño de referencia usa las dos formas
   * en secciones contiguas —botón relleno en «Nos Hébergements», enlace
   * suelto en «Les Alentours»— así que elegir una sería elegir por el cliente
   * siguiente.
   */
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link']).default('link'),
});

/**
 * Rejilla de tarjetas con imagen.
 *
 * Cinco apariciones en el diseño de referencia y dos anatomías distintas: el
 * texto sobre la imagen o debajo de ella. El array se llama `items` y no
 * `cards` porque `blog` reutiliza la misma tarjeta, y dos nombres para el
 * mismo concepto confunden.
 */
export const cardGridBlockSchema = z.object({
  blockType: z.literal('card-grid'),
  ...blockHeadingSchema,
  /** Párrafo de entrada entre el titular y la rejilla. */
  description: z.string().optional(),
  /** Fondo de la sección. Las secciones alternan para separarse entre sí. */
  background: z.enum(['default', 'muted', 'none']).default('default'),
  /**
   * Anatomía de la tarjeta. **Eje estructural**: el texto sobre la imagen y el
   * texto debajo no comparten esqueleto —uno va en absoluto sobre un degradado
   * y el otro en flujo normal—, así que van por mapa y no por `if`.
   */
  card: z.enum(['overlay', 'stacked']).default('stacked'),
  /** Cuántas tarjetas caben en una fila. El diseño usa 3 y 4. */
  columns: z.number().int().min(1).max(6).default(3),
  /**
   * Reparto asimétrico, en columnas de doce por tarjeta.
   *
   * Vacío deja la rejilla uniforme. Con valores, manda sobre `columns` y se
   * recorre en ciclo: `[5, 7]` reproduce «Nos Hébergements», que es la única
   * sección del diseño donde las tarjetas no miden lo mismo.
   */
  spans: z.array(z.number().int().min(1).max(11)).default([]),
  /**
   * De dónde salen las tarjetas.
   *
   * Hoy el bloque solo pinta `items`: el campo existe para que el editor
   * configure la colección, y la resolución la hará el resolver del site.
   * `core-ui` no consulta Payload —es una librería de UI— y por eso el dato
   * llega ya resuelto.
   */
  source: z.enum(['manual', 'accommodations', 'entities', 'articles']).default('manual'),
  /** Qué pedirle a la colección, cuando `source` no es manual. */
  sourceConfig: z
    .object({
      category: z.string().optional(),
      limit: z.number().int().positive().optional(),
      featured: z.boolean().optional(),
    })
    .optional(),
  items: z.array(cardItemSchema).default([]),
  /** Enlace al final de la sección, bajo la rejilla. */
  ctas: z.array(blockLinkSchema).default([]),
});

/** Texto libre. */
export const richTextBlockSchema = z.object({
  blockType: z.literal('rich-text'),
  /** Contenido richText serializado por Payload (Lexical). */
  content: z.unknown(),
});

/** Llamada a la acción con uno o varios botones. */
export const ctaBlockSchema = z.object({
  blockType: z.literal('cta'),
  ...blockHeadingSchema,
  links: z.array(blockLinkSchema),
});

export const reviewsGridBlockSchema = z.object({ blockType: z.literal('reviews-grid') });
export const servicesGridBlockSchema = z.object({ blockType: z.literal('services-grid') });
export const accommodationsGridBlockSchema = z.object({
  blockType: z.literal('accommodations-grid'),
});
export const environmentGridBlockSchema = z.object({ blockType: z.literal('environment-grid') });
export const galleryBlockSchema = z.object({ blockType: z.literal('gallery') });
export const mapBlockSchema = z.object({ blockType: z.literal('map') });
export const instagramBlockSchema = z.object({ blockType: z.literal('instagram') });
/**
 * Listado de artículos del blog.
 *
 * **El primer bloque de referencia**: no lleva contenido, lleva la consulta.
 * El editor dice qué quiere —los últimos, los destacados, los de una
 * categoría— y quien resuelve es el site, porque `core-ui` no habla con
 * Payload. Los artículos ya resueltos llegan en `items`, con la misma forma
 * que las tarjetas de `card-grid`: comparten anatomía y no hace falta una
 * tarjeta aparte.
 */
export const blogBlockSchema = z.object({
  blockType: z.literal('blog'),
  ...blockHeadingSchema,
  /** Párrafo de entrada entre el titular y las tarjetas. */
  description: z.string().optional(),
  /** Fondo de la sección. Las secciones alternan para separarse entre sí. */
  background: z.enum(['default', 'muted', 'none']).default('default'),
  /** Qué artículos se piden. */
  source: z.enum(['latest', 'featured', 'byCategory']).default('latest'),
  /** Categoría, cuando `source` es `byCategory`. */
  category: z.string().optional(),
  /** Cuántos se piden. Tres es lo que muestra el diseño de referencia. */
  limit: z.number().int().positive().max(24).default(3),
  /** Si hay enlace al listado completo bajo las tarjetas. */
  showMoreLink: z.boolean().default(false),
  /** Destino de ese enlace. Sin él no se pinta aunque `showMoreLink` esté. */
  showMoreUrl: z.string().optional(),
  /** Texto de ese enlace. En el diseño, «Voir toutes les actualités». */
  showMoreLabel: z.string().optional(),
  /**
   * Artículos ya resueltos, en forma de tarjeta.
   *
   * No lo rellena el editor: lo inyecta el site antes de renderizar. Por eso
   * tiene valor por defecto — un bloque recién creado es válido y se queda
   * vacío hasta que alguien lo resuelva.
   */
  items: z.array(cardItemSchema).default([]),
});
export const faqBlockSchema = z.object({ blockType: z.literal('faq') });
export const embedBlockSchema = z.object({ blockType: z.literal('embed') });

/**
 * Cabecera de una página.
 *
 * **No es un bloque**: es un grupo de campos de `pages`, así que no aparece en
 * la unión de abajo. Vive aquí, junto al resto del documento, y `blocks/hero/`
 * lo reexporta en lugar de redefinirlo — duplicarlo reproduciría la divergencia
 * entre Zod y Payload que ya costó cara, y el test de paridad no la vería
 * porque solo compara el primer nivel.
 *
 * `titleMode` y `align` son ejes **independientes** de `variant`. En el Figma
 * de La Civelle van correlacionados —el hero de vídeo lleva logo y centrado, los
 * de imagen llevan texto a la izquierda—, pero esa correlación es de un cliente,
 * no del sistema: separarlos cuesta lo mismo y absorbe diseños no vistos.
 */
export const heroSchema = z.object({
  /** **Eje estructural**: cada valor tiene su componente, resuelto por mapa. */
  variant: z.enum(['video', 'image', 'minimal', 'none']),
  media: mediaRefSchema.optional(),
  /**
   * Supertítulo sobre el titular. En el Figma es la línea de localización
   * —"Capbreton · Landes · Atlantique"— y aparece en los tres heros, con logo
   * y con texto, así que es una pieza propia y no el subtítulo reubicado.
   */
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  /**
   * Qué hace de título visible. Con `logo` el nombre del site sustituye al
   * titular, como en la home del Figma — y entonces el `<h1>` se pinta igual,
   * oculto, porque una página sin encabezado legible es un fallo de
   * accesibilidad y SEO que no se copia.
   */
  titleMode: z.enum(['text', 'logo']).default('text'),
  align: z.enum(['left', 'center']).default('left'),
  showBreadcrumbs: z.boolean().default(false),
});

/** Unión discriminada de todos los bloques disponibles en un `blocks` field. */
export const pageBlockSchema = z.discriminatedUnion('blockType', [
  mediaTextBlockSchema,
  iconGridBlockSchema,
  cardGridBlockSchema,
  reviewsGridBlockSchema,
  servicesGridBlockSchema,
  accommodationsGridBlockSchema,
  environmentGridBlockSchema,
  galleryBlockSchema,
  mapBlockSchema,
  instagramBlockSchema,
  blogBlockSchema,
  ctaBlockSchema,
  faqBlockSchema,
  richTextBlockSchema,
  embedBlockSchema,
]);

/**
 * Referencia superficial a una página, usada por `parent` para evitar la
 * auto-referencia completa de `pageSchema` (y el ciclo de tipos que eso
 * generaría en TypeScript estricto). Payload puebla relaciones self-referencing
 * a poca profundidad — esta forma es suficiente para breadcrumbs y navegación.
 */
const pageLiteRefSchema = z.object({
  id: payloadIdSchema,
  title: z.string(),
  slug: z.string(),
});

/** Documento de la colección `pages`: páginas con page builder de bloques. */
export const pageSchema = z.object({
  id: payloadIdSchema,
  title: z.string(),
  slug: z.string(),
  type: z.enum(['home', 'landing', 'static', 'listing', 'contact', 'faq']),
  parent: z.union([payloadIdSchema, pageLiteRefSchema]).optional(),

  hero: heroSchema.optional(),

  blocks: z.array(pageBlockSchema).default([]),

  /** Todos sus campos son opcionales, así que un SEO sin rellenar no viaja. */
  seo: seoSchema
    .extend({
      noIndex: z.boolean().default(false),
      canonicalUrl: z.string().optional(),
    })
    .optional(),

  personalization: z.array(personalizationEntrySchema).optional(),
});

/**
 * Forma de escritura de una página: lo que llega a un `beforeChange` de Payload
 * en un `create`. Sin `id` (Payload lo asigna) y con los campos localizados
 * ya resueltos al locale activo.
 */
export const pageInputSchema = pageSchema.omit({ id: true });

/** Forma de escritura en un `update`: Payload solo manda los campos que cambian. */
export const pageUpdateSchema = pageInputSchema.partial();
