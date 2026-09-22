import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../lib/cn';

import type { VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

const buttonVariants = cva(
  // Ni peso ni cuerpo aquí: los pone quien corresponda —los tokens en los
  // botones, la variante en los enlaces—. Dos dueños para la misma propiedad
  // dependerían del orden de la hoja, que es justo lo que ya falló.
  'inline-flex items-center justify-center gap-2 rounded-lg font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        /**
         * Texto y flecha, sin fondo ni caja.
         *
         * No es un `ghost` sin relleno: `ghost` sigue siendo un botón —tiene
         * caja, padding y fondo al pasar por encima— y esto es un enlace que
         * se lee como texto. El diseño de referencia los usa a la vez, así que
         * son dos cosas distintas y no dos grados de la misma.
         */
        link: 'bg-transparent font-bold hover:opacity-80',
        /**
         * El enlace de sección: el «ver todo» al pie de una rejilla.
         *
         * Es el segundo tratamiento de enlace del lenguaje visual, y no un
         * `link` más grande: el de tarjeta va pequeño y en secundario, y este
         * va en color de marca con una línea inferior tenue. Los dos aparecen
         * en la misma página del diseño de referencia.
         */
        'link-underline':
          'bg-transparent font-bold text-primary border-b-2 border-primary/20 hover:opacity-80',
      },
      /**
       * `sm` y `lg` son escalones fijos: los casos excepcionales, no la
       * identidad. La talla por defecto la visten los tokens del cliente desde
       * la compuesta, y solo en los botones.
       */
      size: {
        sm: 'h-9 px-3 text-sm font-medium',
        // La talla por defecto no pone nada por su cuenta: sus clases salen de
        // la compuesta de abajo, porque son tokens **de botón** y un enlace no
        // los quiere.
        md: '',
        lg: 'h-12 px-6 text-lg font-medium',
      },
    },
    /*
     * La forma del botón —relleno, cuerpo, peso y sombra— sale de tokens del
     * cliente, y es identidad de marca: La Civelle lo quiere más ancho, más
     * bajo y en negrita que el valor genérico.
     *
     * Va aquí y no en la talla porque **es de los botones, no de los
     * enlaces**. Tenerlo en `md` obligaba a deshacerlo después en cada
     * variante de enlace, y deshacerlo no siempre funciona: `tailwind-merge`
     * no reconoce `text-(length:…)` como cuerpo, así que las dos clases
     * llegaban juntas al HTML y ganaba la que la hoja emite más tarde —el
     * token—, dejando el enlace de sección a 1rem con su `text-xl` puesto.
     * Una clase presente no es una clase aplicada.
     */
    compoundVariants: [
      {
        variant: ['primary', 'secondary', 'outline', 'ghost'],
        size: 'md',
        className:
          'px-(--button-px,1rem) py-(--button-py,0.5rem) text-(length:--button-font-size,1rem) font-(--button-font-weight,500) shadow-(--button-shadow,none)',
      },
      { variant: 'link-underline', className: 'text-xl pb-1' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonAsButtonProps = ButtonVariants &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: undefined;
    children?: ReactNode;
  };

type ButtonAsAnchorProps = ButtonVariants &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    href: string;
    children?: ReactNode;
  };

/** Props de {@link Button}. Si se pasa `href`, se renderiza como `<a>`; si no, como `<button>`. */
export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

/**
 * Botón base del sistema de diseño. Soporta variantes de estilo y tamaño,
 * y se renderiza como `<a>` en lugar de `<button>` cuando se le pasa `href`.
 *
 * Si el botón solo contiene un icono (sin texto visible), hay que pasar
 * `aria-label` — en desarrollo se avisa por consola si falta.
 *
 * @example
 * <Button variant="primary" size="lg">Reservar</Button>
 * <Button href="/alojamientos" variant="outline">Ver alojamientos</Button>
 * <Button aria-label="Cerrar" variant="ghost" size="sm"><Icon name="x" /></Button>
 */
/**
 * Si el contenido del botón incluye texto legible.
 *
 * Mira dentro de las listas porque un botón con icono recibe `{etiqueta}` y
 * `<Icon />` como hermanos, y eso en JSX es un array: comprobar solo
 * `typeof children === 'string'` daba el aviso de accesibilidad en botones que
 * sí tienen texto. Un elemento suelto sigue contando como sin texto, que es
 * justo el caso que el aviso quiere cazar.
 */
function tieneTexto(nodo: ReactNode): boolean {
  if (typeof nodo === 'string') return nodo.trim().length > 0;
  if (typeof nodo === 'number') return true;
  if (Array.isArray(nodo)) return nodo.some(tieneTexto);

  return false;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (process.env.NODE_ENV !== 'production') {
      const hasAriaLabel = Boolean(props['aria-label']);
      const hasTextChildren = tieneTexto(children);
      if (!hasAriaLabel && !hasTextChildren) {
        // El guard de NODE_ENV elimina este aviso del bundle de producción, pero
        // ESLint es estático y no lo evalúa: sin la excepción, `no-console` falla
        // en CI (ver docs/estandares/codigo.md).
        // eslint-disable-next-line no-console
        console.warn(
          '[Button] Falta aria-label: pasa texto como children o aria-label para que el botón sea accesible.',
        );
      }
    }

    if ('href' in props && props.href !== undefined) {
      const { href, ...anchorProps } = props as ButtonAsAnchorProps;
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    const buttonProps = props as Omit<ButtonAsButtonProps, 'href'>;
    return (
      <button ref={ref as Ref<HTMLButtonElement>} className={classes} {...buttonProps}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
