import type { ReactNode } from 'react';
import type { Swiper as SwiperClass } from 'swiper';

/**
 * Transición entre slides.
 *
 * `fade` funde una imagen con la siguiente en el sitio; `slide` las desplaza.
 * Son los dos que pide el schema de Gallery, y los únicos que el primitivo
 * carga —Swiper trae seis más, y cada uno arrastra su propio CSS.
 */
export type CarouselEffect = 'slide' | 'fade';

/**
 * Rótulos de interfaz del carrusel.
 *
 * No son contenido: no salen de Payload. Viajan como props con valor por
 * defecto en el idioma del cliente, porque escritos a mano acaban en el idioma
 * de la conversación —ya pasó con el pie del site— y nadie lo nota hasta que lo
 * ve el cliente.
 *
 * Los que llevan `{{index}}` y `{{slidesLength}}` son plantillas de Swiper: las
 * sustituye su módulo A11y, así que las llaves dobles van literales.
 */
export type CarouselLabels = {
  /** `aria-label` del contenedor. Describe de qué es la galería. */
  region: string;
  /** Botón de imagen anterior. */
  previous: string;
  /** Botón de imagen siguiente. */
  next: string;
  /** Aviso al pulsar «anterior» estando en la primera. */
  first: string;
  /** Aviso al pulsar «siguiente» estando en la última. */
  last: string;
  /** `aria-label` de cada slide. Plantilla con `{{index}}` y `{{slidesLength}}`. */
  slide: string;
  /** `aria-label` de cada punto de paginación. Plantilla con `{{index}}`. */
  paginationBullet: string;
  /**
   * `aria-roledescription` del contenedor.
   *
   * Está entre los rótulos y no como constante porque **un lector de pantalla
   * lo lee en voz alta**: dejarlo en «carousel» fijo hace que una web francesa
   * anuncie una palabra inglesa. El patrón WAI-ARIA lo documenta en inglés
   * porque la documentación está en inglés, no porque el valor sea una palabra
   * clave — a diferencia de `role`, este atributo es texto para quien escucha.
   */
  roleCarousel: string;
  /** `aria-roledescription` de cada slide. Se lee en voz alta, igual que el anterior. */
  roleSlide: string;
};

/** Props de `CarouselPrimitive`. */
export type CarouselPrimitiveProps = {
  /** Las slides, envueltas cada una en `CarouselSlide`. */
  children: ReactNode;
  /** Rótulos de interfaz. Por defecto, en francés. */
  labels?: Partial<CarouselLabels>;

  /** Flechas de anterior y siguiente. */
  navigation?: boolean;
  /** Puntos de paginación bajo el carrusel. */
  pagination?: boolean;
  /** Navegación con las flechas del teclado. */
  keyboard?: boolean;
  /** Zoom con pellizco y con doble clic. */
  zoom?: boolean;

  /**
   * Avance automático.
   *
   * Es una petición, no una garantía: si el sistema pide movimiento reducido,
   * el primitivo lo ignora.
   */
  autoplay?: boolean;
  /** Milisegundos entre avances automáticos. */
  autoplayDelay?: number;
  /** Al llegar a la última, vuelve a la primera. */
  loop?: boolean;
  /** Cómo se pasa de una slide a la siguiente. */
  effect?: CarouselEffect;
  /** Cuántas slides se ven a la vez. */
  slidesPerView?: number;
  /** Separación entre slides, en píxeles. */
  spaceBetween?: number;
  /** Slide por la que empieza. */
  initialSlide?: number;

  /**
   * Carrusel de miniaturas que gobierna a éste.
   *
   * Quien lo pasa es `GallerySliderThumbs`, que monta los dos y conecta el de
   * abajo con el de arriba. `null` mientras el de miniaturas aún no ha montado.
   */
  thumbs?: SwiperClass | null;
  /**
   * Recibe la instancia de Swiper al montar.
   *
   * Existe para conectar dos carruseles entre sí. Es la única rendija por la
   * que asoma la librería, y por eso el tipo se reexporta desde aquí: un bloque
   * que la necesite no tiene que importar nada de `swiper`.
   */
  onSwiper?: (swiper: SwiperClass) => void;
  /** Se llama con el índice de la slide activa cada vez que cambia. */
  onSlideChange?: (indice: number) => void;

  /** Clases del contenedor. */
  className?: string;
};

/**
 * La instancia de Swiper, renombrada.
 *
 * Se reexporta para que ningún bloque tenga que importar de `swiper`: la regla
 * de HU-011 es que la librería solo se toca desde este primitivo, y un
 * `import type` cuenta como tocarla —el día que se cambie de librería habría
 * que perseguir esos tipos por todo el catálogo de bloques.
 */
export type CarouselInstance = SwiperClass;
