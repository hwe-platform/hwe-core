import type { ServerFunctionClient } from 'payload';
import type React from 'react';

import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';

import config from '../../payload.config';
import { importMap } from './admin/importMap.js';

type Args = {
  readonly children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

/** Layout raíz del admin de Payload en /admin. */
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
