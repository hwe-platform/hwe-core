import { describe, it, expect } from 'vitest';
import { payloadIdSchema } from './payload-id.schema';

describe('payloadIdSchema', () => {
  it('acepta el id numérico del adapter de Postgres', () => {
    expect(payloadIdSchema.safeParse(42).success).toBe(true);
  });

  it('acepta el id en cadena de Mongo o de una relación sin poblar', () => {
    expect(payloadIdSchema.safeParse('64f0c2a1b9').success).toBe(true);
  });

  it('rechaza cualquier otra cosa', () => {
    expect(payloadIdSchema.safeParse(null).success).toBe(false);
    expect(payloadIdSchema.safeParse(true).success).toBe(false);
    expect(payloadIdSchema.safeParse({}).success).toBe(false);
  });
});
