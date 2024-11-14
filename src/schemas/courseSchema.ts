// src/schemas/courseSchema.ts
import { z } from 'zod';

export const enrollSchema = z.object({
  curso_id: z.number().int().positive('ID do curso inválido.'),
});

export const progressSchema = z.object({
  aula_id: z.number().int().positive('ID da aula inválido.'),
});
