/**
 * Insignia circular que flota sobre la imagen: «Depuis 30 Ans» en La Civelle.
 *
 * Se llama `Insignia` y no `Medallón30Años` porque el patrón —un sello con
 * etiqueta, cifra y sufijo sobre una foto— **es de campings en general**, no
 * de este cliente: "desde 1985", "3 estrellas", "11 hectáreas". Es candidata a
 * promoción a plataforma por la regla del tercero (`bloques.md`); mientras,
 * vive aquí y entra al bloque por el slot `sobreLaImagen`, que solo sabe que
 * tiene un hueco encima de la imagen, no qué va en él.
 *
 * Incluye la esquina decorativa, que en el diseño acompaña a la insignia.
 */
export function Insignia({
  etiqueta,
  valor,
  sufijo,
}: {
  etiqueta: string;
  valor: string | number;
  sufijo?: string;
}) {
  return (
    <>
      <div
        aria-hidden
        className="border-border absolute -top-6 left-0 h-24 w-24 rounded-tl-2xl border-l-2 border-t-2 md:-left-6"
      />
      <p className="bg-secondary text-primary-foreground border-card font-heading absolute -bottom-6 right-0 z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 p-4 text-center shadow-xl md:-bottom-8 md:-right-8 md:h-32 md:w-32">
        <span className="mb-1 text-[10px] font-bold uppercase leading-none tracking-[2px]">
          {etiqueta}
        </span>
        <span className="text-[32px] font-black leading-none">{valor}</span>
        {sufijo ? (
          <span className="mt-1 text-[10px] font-bold uppercase leading-none tracking-[1px]">
            {sufijo}
          </span>
        ) : null}
      </p>
    </>
  );
}
