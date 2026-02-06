import { z } from 'zod';

export const FilterSchema = z.object({
    term: z.string().optional(),
    program: z.enum(['Sistemas', 'Mecatrónica', 'Administración']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
});