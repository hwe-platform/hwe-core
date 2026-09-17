import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';

import { RichText } from './RichText';

/** Construye un árbol de Lexical con los hijos que se le pasen. */
function doc(...children: unknown[]) {
  return { root: { type: 'root', children } };
}

const texto = (text: string, format = 0) => ({ type: 'text', text, format });
const parrafo = (...children: unknown[]) => ({ type: 'paragraph', children });

describe('RichText', () => {
  it('pinta un párrafo con su texto', () => {
    render(<RichText content={doc(parrafo(texto('Bienvenue au camping.')))} />);
    expect(screen.getByText('Bienvenue au camping.')).toBeInTheDocument();
  });

  it('aplica los formatos de Lexical, que son bits acumulables', () => {
    const { container } = render(
      <RichText content={doc(parrafo(texto('negrita', 1), texto('cursiva', 2)))} />,
    );
    expect(container.querySelector('strong')).toHaveTextContent('negrita');
    expect(container.querySelector('em')).toHaveTextContent('cursiva');
  });

  it('combina varios formatos sobre el mismo texto', () => {
    const { container } = render(<RichText content={doc(parrafo(texto('ambos', 3)))} />);
    expect(container.querySelector('strong em, em strong')).not.toBeNull();
  });

  it('pinta encabezados con su etiqueta', () => {
    const { container } = render(
      <RichText
        content={doc({ type: 'heading', tag: 'h3', children: [texto('Le Restaurant')] })}
      />,
    );
    expect(container.querySelector('h3')).toHaveTextContent('Le Restaurant');
  });

  it('cae a h2 si el encabezado no dice su nivel', () => {
    const { container } = render(
      <RichText content={doc({ type: 'heading', children: [texto('Sin nivel')] })} />,
    );
    expect(container.querySelector('h2')).toHaveTextContent('Sin nivel');
  });

  it('no pinta nada si no hay contenido', () => {
    expect(render(<RichText content={null} />).container).toBeEmptyDOMElement();
    expect(render(<RichText content={{}} />).container).toBeEmptyDOMElement();
    expect(render(<RichText content={doc()} />).container).toBeEmptyDOMElement();
  });
});

describe('RichText — listas, enlaces y nodos desconocidos', () => {
  it('distingue listas ordenadas de no ordenadas', () => {
    const item = { type: 'listitem', children: [texto('uno')] };
    const { container: sinOrden } = render(
      <RichText content={doc({ type: 'list', listType: 'bullet', children: [item] })} />,
    );
    expect(sinOrden.querySelector('ul li')).toHaveTextContent('uno');

    const { container: conOrden } = render(
      <RichText content={doc({ type: 'list', listType: 'number', children: [item] })} />,
    );
    expect(conOrden.querySelector('ol li')).toHaveTextContent('uno');
  });

  it('abre los enlaces externos en pestaña nueva y de forma segura', () => {
    const { container } = render(
      <RichText
        content={doc(
          parrafo({
            type: 'link',
            fields: { url: 'https://instagram.com/lacivelle', newTab: true },
            children: [texto('Instagram')],
          }),
        )}
      />,
    );
    const enlace = container.querySelector('a');
    expect(enlace).toHaveAttribute('href', 'https://instagram.com/lacivelle');
    expect(enlace).toHaveAttribute('rel', 'noopener noreferrer');
    expect(enlace).toHaveAttribute('target', '_blank');
  });

  it('un nodo desconocido se degrada a sus hijos en vez de tragárselos', () => {
    render(<RichText content={doc({ type: 'nodo-del-futuro', children: [texto('sigo aquí')] })} />);
    expect(screen.getByText('sigo aquí')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <RichText
        content={doc(
          { type: 'heading', tag: 'h2', children: [texto('Le Camping')] },
          parrafo(texto('Niché au cœur de la forêt landaise.')),
        )}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
