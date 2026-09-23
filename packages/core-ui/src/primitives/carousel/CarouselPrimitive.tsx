'use client';

import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs,
  Zoom,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/effect-fade';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { cn } from '../../lib/cn';

import type { SwiperModule } from 'swiper/types';
import type {
  CarouselEffect,
  CarouselInstance,
  CarouselLabels,
  CarouselPrimitiveProps,
} from './carousel-primitive.types';

/**
 * Rótulos por defecto, en el idioma del primer site.
 *
 * «Photo précédente» y «Photo suivante» son **literales del export de Figma**
 * (`figma-makes/la-civelle/src/app/MobileHomePage.tsx`, los `aria-label` de las
 * flechas de la galería). El resto no tiene fuente en el export porque el
 * export no los tiene: son avisos que solo oye un lector de pantalla.
 */
const ROTULOS: CarouselLabels = {
  region: 'Galerie photos',
  previous: 'Photo précédente',
  next: 'Photo suivante',
  first: 'Première photo',
  last: 'Dernière photo',
  slide: 'Photo {{index}} sur {{slidesLength}}',
  paginationBullet: 'Aller à la photo {{index}}',
  roleCarousel: 'carrousel',
  roleSlide: 'diapositive',
};

/** Milisegundos que tarda una slide en dar paso a la siguiente. */
const VELOCIDAD_MS = 400;

/** Sin transición: el cambio es instantáneo, que es lo que pide quien la desactiva. */
const VELOCIDAD_SIN_MOVIMIENTO_MS = 0;

/** Milisegundos entre avances automáticos, si nadie dice otra cosa. */
const AUTOPLAY_DELAY_MS = 3000;

/**
 * Los colores de los controles de Swiper, atados a los tokens del cliente.
 *
 * Swiper pinta flechas y puntos leyendo sus propias variables CSS, y la suya por
 * defecto es `#007aff` —el azul de iOS—, así que **sin esto los controles salen
 * azules en cualquier site**, ajenos a su paleta.
 *
 * Van como propiedades arbitrarias de Tailwind y no como `style={}` porque
 * `codigo.md` prohíbe el estilo en línea. Tailwind las encuentra al escanear
 * `dist/`, que es lo que declara el `@source` del site.
 *
 * Los tokens son los del contrato de la plataforma: el export de La Civelle
 * pinta las flechas de la galería con `bg-card/90` y `text-foreground`, y marca
 * la miniatura activa con el color de acento.
 */
const TOKENS_DE_CONTROL = [
  '[--swiper-navigation-color:var(--color-foreground)]',
  '[--swiper-pagination-color:var(--color-primary)]',
  '[--swiper-pagination-bullet-inactive-color:var(--color-foreground)]',
  '[--swiper-pagination-bullet-inactive-opacity:0.3]',
].join(' ');

/** Qué módulos hacen falta, uno por capacidad pedida. */
type CapacidadesActivas = {
  navigation: boolean;
  pagination: boolean;
  keyboard: boolean;
  zoom: boolean;
  autoplay: boolean;
  thumbs: boolean;
  fade: boolean;
};

/**
 * Los módulos de Swiper que se **activan** en esta instancia.
 *
 * A11y va siempre y no se puede apagar: un carrusel sin el patrón ARIA es un
 * montón de imágenes que un lector de pantalla no sabe recorrer. Los demás
 * entran solo si alguien los pide, y no entrar significa que Swiper no engancha
 * su comportamiento ni sus manejadores de evento.
 *
 * **Ojo con lo que esto no hace:** los ocho se importan estáticamente arriba, así
 * que los ocho se empaquetan. Esta tabla decide qué corre, no qué pesa.
 */
function modulosDe(capacidades: CapacidadesActivas): SwiperModule[] {
  const candidatos: Array<[boolean, SwiperModule]> = [
    [true, A11y],
    [capacidades.navigation, Navigation],
    [capacidades.pagination, Pagination],
    [capacidades.keyboard, Keyboard],
    [capacidades.zoom, Zoom],
    [capacidades.autoplay, Autoplay],
    [capacidades.thumbs, Thumbs],
    [capacidades.fade, EffectFade],
  ];

  return candidatos.filter(([activa]) => activa).map(([, modulo]) => modulo);
}

/**
 * Configuración del módulo A11y a partir de los rótulos.
 *
 * Es el patrón WAI-ARIA de carrusel entero, y lo pone el módulo en vez de
 * escribirlo a mano sobre el DOM: los atributos van en el contenedor y en cada
 * slide, y Swiper los mantiene al vuelo cuando el carrusel gira.
 */
function a11yDe(rotulos: CarouselLabels) {
  return {
    enabled: true,
    containerRole: 'region',
    containerRoleDescriptionMessage: rotulos.roleCarousel,
    containerMessage: rotulos.region,
    slideRole: 'group',
    itemRoleDescriptionMessage: rotulos.roleSlide,
    slideLabelMessage: rotulos.slide,
    prevSlideMessage: rotulos.previous,
    nextSlideMessage: rotulos.next,
    firstSlideMessage: rotulos.first,
    lastSlideMessage: rotulos.last,
    paginationBulletMessage: rotulos.paginationBullet,
  };
}

/**
 * Configuración de partida del carrusel.
 *
 * Los valores por defecto van en una tabla y no en la desestructuración de las
 * props **porque cada `= valor` cuenta como un camino** para la regla de
 * complejidad de `codigo.md`: catorce defaults dejaban el componente en 20,
 * doblando el límite, sin una sola bifurcación de lógica real.
 */
const POR_DEFECTO = {
  navigation: false,
  pagination: false,
  keyboard: false,
  zoom: false,
  autoplay: false,
  autoplayDelay: AUTOPLAY_DELAY_MS,
  loop: true,
  effect: 'slide' as CarouselEffect,
  slidesPerView: 1,
  spaceBetween: 0,
  initialSlide: 0,
  thumbs: null as CarouselInstance | null,
};

/** La configuración del carrusel, ya con los valores por defecto puestos. */
type ConfigCarrusel = typeof POR_DEFECTO;

/**
 * Mezcla las props con la tabla de arriba, ignorando las que llegan `undefined`.
 *
 * **Un `{ ...POR_DEFECTO, ...props }` a secas no vale**: el spread copia también
 * las claves cuyo valor es `undefined` y pisa el valor por defecto, al revés que
 * la desestructuración con `= valor`. Y lo que va a hacer `GalleryBlock` es
 * pasar los campos de Payload tal cual —`loop={bloque.loop}`—, que llegan
 * `undefined` en cuanto el editor no toca uno. Sin este filtro, un bucle que el
 * schema declara `true` llegaba a Swiper como `undefined` y se apagaba solo, y
 * `thumbs` pasaba de `null` a `undefined`, lo que cargaba el módulo Thumbs para
 * unas miniaturas que no existen.
 */
function conValoresPorDefecto(props: CarouselPrimitiveProps): ConfigCarrusel {
  const config = { ...POR_DEFECTO };

  for (const clave of Object.keys(POR_DEFECTO) as Array<keyof ConfigCarrusel>) {
    const valor = props[clave];

    // Cada clave tiene el mismo tipo a los dos lados, pero el índice genérico
    // no lo ve; comprobarlo clave a clave serían doce ramas y ninguna decisión.
    if (valor !== undefined) (config as Record<string, unknown>)[clave] = valor;
  }

  return config;
}

/**
 * Traduce la configuración del primitivo a las opciones que espera Swiper.
 *
 * Vive fuera del componente para que lo que decide —qué se enciende y con qué
 * valor— se pueda leer de un tirón, sin el ruido del JSX alrededor.
 */
function opcionesDe(config: ConfigCarrusel, menosMovimiento: boolean) {
  // Una preferencia de accesibilidad gana a la configuración del bloque.
  const autoplayActivo = config.autoplay && !menosMovimiento;
  const esFundido = config.effect === 'fade';

  return {
    modules: modulosDe({
      navigation: config.navigation,
      pagination: config.pagination,
      keyboard: config.keyboard,
      zoom: config.zoom,
      autoplay: autoplayActivo,
      thumbs: config.thumbs !== null,
      fade: esFundido,
    }),
    navigation: config.navigation,
    pagination: config.pagination ? { clickable: true } : false,
    keyboard: config.keyboard,
    zoom: config.zoom,
    autoplay: autoplayActivo ? { delay: config.autoplayDelay, disableOnInteraction: false } : false,
    loop: config.loop,
    effect: config.effect,
    fadeEffect: esFundido ? { crossFade: true } : undefined,
    // El fundido cruza una slide con otra en el mismo hueco, así que más de una
    // a la vez no significa nada: Swiper las apila y se ve una sola.
    slidesPerView: esFundido ? 1 : config.slidesPerView,
    spaceBetween: config.spaceBetween,
    initialSlide: config.initialSlide,
    speed: menosMovimiento ? VELOCIDAD_SIN_MOVIMIENTO_MS : VELOCIDAD_MS,
    thumbs: config.thumbs ? { swiper: config.thumbs } : undefined,
  };
}

/**
 * Carrusel reutilizable. El único sitio del proyecto que habla con Swiper.
 *
 * No es un bloque: es un primitivo que cualquier bloque puede consumir. Gallery
 * lo usa tres veces —el carrusel principal, la barra de miniaturas y el visor a
 * pantalla completa—, y detrás vienen las reseñas y los logos del pie. Si
 * mañana se cambia Swiper por otra cosa, se toca este archivo y ninguno más.
 *
 * Los módulos de Swiper **se activan** con lo que pidan las props, pero los ocho
 * se empaquetan siempre: son imports estáticos y el tree-shaking no puede quitar
 * lo que `modulosDe` referencia. Lo que sí se ahorra una galería en rejilla es
 * Swiper entero, porque las variantes estáticas no pasan por aquí.
 *
 * @example
 * <CarouselPrimitive navigation pagination labels={{ region: 'Galerie du camping' }}>
 *   {fotos.map((foto) => (
 *     <CarouselSlide key={foto.id}>
 *       <Image src={foto.url} alt={foto.alt} />
 *     </CarouselSlide>
 *   ))}
 * </CarouselPrimitive>
 */
export function CarouselPrimitive(props: CarouselPrimitiveProps) {
  const { children, labels, onSwiper, onSlideChange, className } = props;
  const config = conValoresPorDefecto(props);
  const menosMovimiento = usePrefersReducedMotion();

  return (
    <Swiper
      className={cn(TOKENS_DE_CONTROL, className)}
      a11y={a11yDe({ ...ROTULOS, ...labels })}
      onSwiper={onSwiper}
      // `realIndex` y no `activeIndex`: en bucle Swiper clona slides por los
      // extremos, y `activeIndex` las cuenta. Quien escucha quiere la foto.
      onSlideChange={(swiper) => onSlideChange?.(swiper.realIndex)}
      {...opcionesDe(config, menosMovimiento)}
    >
      {children}
    </Swiper>
  );
}

/**
 * Una slide del carrusel.
 *
 * Es `SwiperSlide` con otro nombre. Se reexporta para que ningún bloque tenga
 * que importar de `swiper`: la regla de HU-011 es que la librería solo se toca
 * desde este primitivo.
 */
export const CarouselSlide = SwiperSlide;
