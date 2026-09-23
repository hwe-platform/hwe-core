/**
 * Gota sobre llama: el agua caliente de la piscina.
 *
 * Copiado literalmente del export de Figma (`imports/EauChauffeeIcon/`), con
 * dos cambios deliberados: el trazo va en `currentColor` en lugar del verde
 * fijo que traía, para que herede el token de la sección donde se pinte, y el
 * grosor viene por prop en vez de estar clavado en 2.
 */
export function EauChauffeeIcon({
  className,
  strokeWidth = 1.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <path
        d="M7 16.3C9.2 16.3 11 14.47 11 12.25C11 11.09 10.43 9.99 9.29 9.06C8.15 8.13 7.29 6.75 7 5.3C6.71 6.75 5.86 8.14 4.71 9.06C3.56 9.98 3 11.1 3 12.25C3 14.47 4.8 16.3 7 16.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.56 6.6C13.2478 5.50112 13.7353 4.28904 14 3.02C14.5 5.52 16 7.92 18 9.52C20 11.12 21 13.02 21 15.02C21.0057 16.4023 20.6009 17.7552 19.8368 18.9071C19.0727 20.059 17.9838 20.9582 16.7081 21.4905C15.4324 22.0228 14.0274 22.1644 12.6712 21.8973C11.3149 21.6301 10.0685 20.9663 9.09 19.99"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
