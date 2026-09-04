import NextLink from 'next/link';

import type { AnchorHTMLAttributes } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';

/** Detecta si un href apunta fuera del site (http/https absoluto). */
function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export type LinkProps = Omit<NextLinkProps, 'href'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

/**
 * Wrapper de `next/link` que distingue automáticamente enlaces internos
 * de externos. Los externos (`http://`/`https://`) se abren en una pestaña
 * nueva con `rel="noopener noreferrer"`; los internos usan `next/link`
 * para navegación client-side.
 *
 * @example
 * <Link href="/alojamientos">Ver alojamientos</Link>
 * <Link href="https://instagram.com/lacivelle">Instagram</Link>
 */
export function Link({ href, children, ...props }: LinkProps) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}
