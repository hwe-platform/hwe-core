import { Bitter, Inter } from 'next/font/google';
import type React from 'react';

import '../../styles/globals.css';

const bitter = Bitter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-bitter',
});

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
});

type Args = {
  readonly children: React.ReactNode;
};

// lang="fr" fijo por ahora — la detección de idioma por prefijo de URL
// llega con el middleware de HU-008 (docs/arquitectura/paginas-routing.md).
export default function RootLayout({ children }: Args) {
  return (
    <html className={`${bitter.variable} ${inter.variable}`} lang="fr">
      <body>{children}</body>
    </html>
  );
}
