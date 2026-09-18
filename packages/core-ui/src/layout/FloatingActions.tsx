'use client';

import { useEffect, useState } from 'react';

import { Icon } from '../primitives/Icon';

/** Scroll a partir del cual aparece el botón de volver arriba. */
const UMBRAL_SCROLL = 500;

/** Props de {@link FloatingActions}. */
export type FloatingActionsProps = {
  /** Etiqueta accesible del botón de chat. Si falta, no se pinta el botón. */
  chatLabel?: string;
  /** Qué hacer al pulsar el chat. */
  onChat?: () => void;
};

/**
 * Botones flotantes sobre el contenido: chat y volver arriba.
 *
 * El de volver arriba solo aparece cuando hay recorrido suficiente — mostrarlo
 * desde el principio ocupa pantalla sin servir para nada.
 *
 * @example
 * <FloatingActions chatLabel="Abrir el chat" onChat={abrirChat} />
 */
export function FloatingActions({ chatLabel, onChat }: FloatingActionsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > UMBRAL_SCROLL);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    <div className="z-100 fixed bottom-6 right-6 flex flex-col gap-3">
      {visible ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="bg-card border-border rounded-full border p-3 shadow-lg"
        >
          <Icon name="chevronDown" className="rotate-180" />
        </button>
      ) : null}

      {chatLabel ? (
        <button
          type="button"
          onClick={onChat}
          aria-label={chatLabel}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg"
        >
          <Icon name="mail" />
        </button>
      ) : null}
    </div>
  );
}
