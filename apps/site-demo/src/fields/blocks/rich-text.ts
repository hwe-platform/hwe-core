import type { Block } from 'payload';

export const RichText: Block = {
  slug: 'rich-text',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [{ name: 'content', type: 'richText', required: true, localized: true }],
};
