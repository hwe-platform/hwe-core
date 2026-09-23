import { MarcoIcono } from './ItemIcon';

import type { IconGridVariantProps } from './icon-grid.types';

/**
 * Cada icono dentro de su tarjeta, como en «Activités & Services».
 *
 * La etiqueta va como rótulo —diez píxeles, versalitas, muy espaciada— y no
 * como encabezado: aquí nombra un servicio, no abre una sección. Es la misma
 * distinción que hace la primitiva `Eyebrow`, que no se usa porque este rótulo
 * va en color de texto y centrado, no en acento.
 */
export function IconGridCard({ items, amplio, iconRegistry }: IconGridVariantProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card border-border flex flex-col items-center gap-5 rounded-2xl border p-5 shadow-sm md:p-8"
        >
          <MarcoIcono nombre={item.icon} iconRegistry={iconRegistry} amplio={amplio} />

          <p className="text-foreground text-center text-[10px] font-bold uppercase tracking-widest">
            {item.label}
          </p>

          {item.description ? (
            <p className="text-muted-foreground text-center text-sm leading-relaxed">
              {item.description}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}
