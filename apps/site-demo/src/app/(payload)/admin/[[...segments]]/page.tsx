import type { Metadata } from 'next';

import { generatePageMetadata, RootPage } from '@payloadcms/next/views';

import config from '../../../../payload.config';
import { importMap } from '../importMap.js';

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

/** Catch-all del admin de Payload — resuelve login, dashboard y vistas de colección. */
const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams });

export default Page;
