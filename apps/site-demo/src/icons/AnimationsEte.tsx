/**
 * Cometa y destellos: las animaciones de verano.
 *
 * Copiado literalmente del export de Figma (`imports/AnimationsEteIcon/`), con
 * dos cambios deliberados: el trazo va en `currentColor` en lugar del verde
 * fijo que traía, para que herede el token de la sección donde se pinte, y el
 * grosor viene por prop en vez de estar clavado en 2.
 */
export function AnimationsEteIcon({
  className,
  strokeWidth = 1.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <path
        d="M6.76667 13.1833L2.33333 25.6667L14.8167 21.245"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.66667 3.5H4.67833" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.6667 9.33333H25.6783" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 2.33333H17.5117" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.6667 23.3333H25.6783" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M25.6667 2.33333L23.0533 3.20833C22.3094 3.45612 21.6747 3.95458 21.2576 4.61851C20.8405 5.28244 20.667 6.07062 20.7667 6.84833C20.8833 7.85167 20.1017 8.75 19.075 8.75H18.6317C17.6283 8.75 16.765 9.45 16.5783 10.43L16.3333 11.6667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.6667 15.1667L24.71 14.7817C23.7067 14.385 22.5867 15.015 22.4 16.0767C22.2717 16.8933 21.56 17.5 20.7317 17.5H19.8333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8333 2.33333L13.2183 3.29C13.615 4.29333 12.985 5.41333 11.9233 5.6C11.1067 5.71667 10.5 6.44 10.5 7.26833V8.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8333 15.1667C15.085 17.4183 16.135 20.0317 15.1667 21C14.1983 21.9683 11.585 20.9183 9.33333 18.6667C7.08167 16.415 6.03167 13.8017 7 12.8333C7.96833 11.865 10.5817 12.915 12.8333 15.1667Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
