import {
  Bed,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Menu,
  PawPrint,
  Phone,
  Search,
  Star,
  Users,
  Utensils,
  Waves,
  Wifi,
  X,
} from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '../lib/cn';

import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

/**
 * Set de iconos predefinido para el proyecto. Se mantiene deliberadamente
 * acotado al dominio (alojamiento, servicios, navegación) — si se necesita
 * un icono nuevo, se añade aquí en lugar de importar `lucide-react` directo
 * en los bloques.
 */
const ICONS = {
  utensils: Utensils,
  bed: Bed,
  waves: Waves,
  mapPin: MapPin,
  wifi: Wifi,
  car: Car,
  users: Users,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
  check: Check,
  x: X,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  star: Star,
  heart: Heart,
  menu: Menu,
  search: Search,
  pawPrint: PawPrint,
} as const satisfies Record<string, LucideIcon>;

/** Nombre de un icono del set predefinido. */
export type IconName = keyof typeof ICONS;

const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconProps = VariantProps<typeof iconVariants> & {
  /** Nombre del icono, del set predefinido en `ICONS`. */
  name: IconName;
  className?: string;
  /** Si el icono transmite información por sí solo (sin texto al lado), pasa una etiqueta. */
  'aria-label'?: string;
};

/**
 * Icono del sistema de diseño. Por defecto es decorativo (`aria-hidden`);
 * si se pasa `aria-label`, se expone a lectores de pantalla.
 *
 * @example
 * <Icon name="bed" size="lg" />
 * <Icon name="x" aria-label="Cerrar" />
 */
export function Icon({ name, size, className, ...rest }: IconProps) {
  const LucideIcon = ICONS[name];
  const ariaLabel = rest['aria-label'];

  return (
    <LucideIcon
      className={cn(iconVariants({ size }), className)}
      aria-hidden={ariaLabel ? undefined : true}
      {...rest}
    />
  );
}
