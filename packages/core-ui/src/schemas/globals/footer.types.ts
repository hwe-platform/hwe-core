import type { z } from 'zod';
import type { footerSchema } from './footer.schema';

/** Global `footer`, derivado del schema Zod. */
export type FooterData = z.infer<typeof footerSchema>;
