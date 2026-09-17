import { Fragment } from 'react';

import { cn } from '../lib/cn';

import type { ReactNode } from 'react';

/**
 * Nodo del árbol que serializa Lexical, el editor de Payload.
 *
 * Se tipa de forma laxa a propósito: Lexical admite nodos de cualquier tipo y
 * el contrato real lo pone el editor, no nosotros. Lo que no se reconoce se
 * degrada a sus hijos en lugar de romper la página.
 */
type LexicalNode = {
  type?: string;
  text?: string;
  format?: number | string;
  tag?: string;
  url?: string;
  newTab?: boolean;
  listType?: string;
  children?: LexicalNode[];
  fields?: { url?: string; newTab?: boolean };
};

/** Máscaras de formato de Lexical. Son bits, así que se acumulan. */
const BOLD = 1;
const ITALIC = 2;
const STRIKETHROUGH = 4;
const UNDERLINE = 8;

/** Envuelve el texto en las etiquetas que pidan sus bits de formato. */
function applyFormat(text: string, format: number): ReactNode {
  let node: ReactNode = text;
  if (format & BOLD) node = <strong>{node}</strong>;
  if (format & ITALIC) node = <em>{node}</em>;
  if (format & UNDERLINE) node = <u>{node}</u>;
  if (format & STRIKETHROUGH) node = <s>{node}</s>;
  return node;
}

/** Renderiza la lista de hijos de un nodo. */
function renderChildren(children: LexicalNode[] | undefined): ReactNode {
  if (!children?.length) return null;
  return children.map((child, index) => <Fragment key={index}>{renderNode(child)}</Fragment>);
}

/** Etiqueta HTML de un encabezado, acotada a las que Lexical puede emitir. */
const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

function renderHeading(node: LexicalNode): ReactNode {
  const tag = HEADING_TAGS.find((candidate) => candidate === node.tag) ?? 'h2';
  const Tag = tag;
  return <Tag>{renderChildren(node.children)}</Tag>;
}

function renderLink(node: LexicalNode): ReactNode {
  const url = node.fields?.url ?? node.url ?? '#';
  const newTab = node.fields?.newTab ?? node.newTab;
  const externalProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={url} {...externalProps}>
      {renderChildren(node.children)}
    </a>
  );
}

function renderText(node: LexicalNode): ReactNode {
  return applyFormat(node.text ?? '', typeof node.format === 'number' ? node.format : 0);
}

function renderList(node: LexicalNode): ReactNode {
  const items = renderChildren(node.children);
  return node.listType === 'number' ? <ol>{items}</ol> : <ul>{items}</ul>;
}

/**
 * Qué componente pinta cada tipo de nodo.
 *
 * Es un mapa y no un `switch` por la regla de docs/arquitectura/bloques.md:
 * la resolución de variantes se hace siempre por mapa. Añadir soporte para un
 * nodo nuevo es añadir una entrada, sin tocar `renderNode`.
 */
const NODE_RENDERERS: Record<string, (node: LexicalNode) => ReactNode> = {
  text: renderText,
  linebreak: () => <br />,
  paragraph: (node) => <p>{renderChildren(node.children)}</p>,
  heading: renderHeading,
  quote: (node) => <blockquote>{renderChildren(node.children)}</blockquote>,
  list: renderList,
  listitem: (node) => <li>{renderChildren(node.children)}</li>,
  link: renderLink,
  autolink: renderLink,
};

/** Convierte un nodo de Lexical en su equivalente React. */
function renderNode(node: LexicalNode): ReactNode {
  const render = NODE_RENDERERS[node.type ?? ''];

  // Un nodo desconocido no debe tragarse su contenido: se degrada a sus hijos.
  // Así un tipo de Lexical que aún no soportamos sigue mostrando su texto en
  // lugar de desaparecer.
  return render ? render(node) : renderChildren(node.children);
}

/** Props de {@link RichText}. */
export type RichTextProps = {
  /** Contenido serializado por Lexical, tal y como lo devuelve Payload. */
  content: unknown;
  className?: string;
};

/**
 * Pinta el contenido richText de Payload sin depender de sus paquetes.
 *
 * Payload serializa con Lexical y ofrece su propio conversor, pero traerlo
 * acoplaría core-ui al CMS: los bloques se renderizan igual en Storybook, en
 * tests o en un site que lea de otra fuente. Aquí se cubren los nodos que un
 * editor produce de verdad; lo desconocido se degrada a sus hijos.
 *
 * @example
 * <RichText content={block.content} className="prose" />
 */
export function RichText({ content, className }: RichTextProps) {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root;
  if (!root?.children?.length) return null;

  return (
    <div className={cn('flex flex-col gap-4', className)}>{renderChildren(root.children)}</div>
  );
}
