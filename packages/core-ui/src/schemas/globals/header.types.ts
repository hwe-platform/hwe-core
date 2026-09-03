import type { z } from 'zod';
import type { headerSchema } from './header.schema';

/** Global `header`, derivado del schema Zod. */
export type HeaderData = z.infer<typeof headerSchema>;
