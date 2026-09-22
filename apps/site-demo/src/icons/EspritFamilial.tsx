/**
 * Dos corazones enlazados: el espíritu familiar del camping.
 *
 * Copiado literalmente del export de Figma (`imports/EspritFamilialIcon/`), con
 * dos cambios deliberados: el trazo va en `currentColor` en lugar del verde
 * fijo que traía, para que herede el token de la sección donde se pinte, y el
 * grosor viene por prop en vez de estar clavado en 2.
 */
export function EspritFamilialIcon({
  className,
  strokeWidth = 1.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <path
        d="M31.6667 23.3333C34.15 20.9 36.6667 17.9833 36.6667 14.1667C36.6667 11.7355 35.7009 9.40394 33.9818 7.68486C32.2627 5.96577 29.9312 5 27.5 5C24.5667 5 22.5 5.83333 20 8.33333C17.5 5.83333 15.4333 5 12.5 5C10.0688 5 7.73727 5.96577 6.01819 7.68486C4.2991 9.40394 3.33333 11.7355 3.33333 14.1667C3.33333 18 5.83333 20.9167 8.33333 23.3333L20 35L31.6667 23.3333Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
