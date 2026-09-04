import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '../lib/cn';

import type { VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
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
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (process.env.NODE_ENV !== 'production') {
      const hasAriaLabel = Boolean(props['aria-label']);
      const hasTextChildren = typeof children === 'string' && children.trim().length > 0;
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
