import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

// @hwe-platform/core-ui se consume compilado (dist/), no como fuente TS —
// no necesita transpilePackages.
const nextConfig: NextConfig = {};

export default withPayload(nextConfig);
