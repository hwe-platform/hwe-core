import '@testing-library/jest-dom/vitest';

import 'vitest-axe/extend-expect';

import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

import type { ReactNode } from 'react';

expect.extend(axeMatchers);

// @testing-library/react solo registra su cleanup automático cuando detecta
// afterEach en globalThis (vitest.config no activa `test.globals`), así que
// lo registramos a mano para que cada test empiece con el DOM vacío.
afterEach(cleanup);

// Los tests de primitivas corren fuera de una app Next.js real (sin
// next.config ni loader de imágenes configurado). Sustituimos next/image
// y next/link por sus equivalentes HTML nativos para probar el
// comportamiento de nuestras primitivas, no el runtime de Next.js.
vi.mock('next/image', () => ({
  default: ({ alt, fill: _fill, ...props }: Record<string, unknown>) => (
    <img alt={alt as string} {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>
      {children as ReactNode}
    </a>
  ),
}));
