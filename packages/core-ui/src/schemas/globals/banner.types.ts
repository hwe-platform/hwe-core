import type { z } from 'zod';
import type { bannerSchema } from './banner.schema';

/** Global `banner`, derivado del schema Zod. */
export type BannerData = z.infer<typeof bannerSchema>;
