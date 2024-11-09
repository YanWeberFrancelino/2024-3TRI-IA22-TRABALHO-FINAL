// src/schemas/userSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(100, 'Email muito longo'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido').max(100, 'Email muito longo'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(6).max(100).optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser numérico'),
});
