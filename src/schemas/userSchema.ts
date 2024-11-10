// src/schemas/userSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório.').max(100, 'Nome muito longo.'),
  email: z.string().email('Email inválido.').max(100, 'Email muito longo.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(100, 'Senha muito longa.'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido.').max(100, 'Email muito longo.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(100, 'Senha muito longa.'),
});

export const updateUserSchema = z.object({
  name: z.string().max(100, 'Nome muito longo.').optional(),
  email: z.string().email('Email inválido.').max(100, 'Email muito longo.').optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().nonempty('Senha atual é obrigatória.'),
  newPassword: z
    .string()
    .min(6, 'A nova senha deve ter pelo menos 6 caracteres.')
    .max(100, 'Senha muito longa.'),
});

export const deleteAccountSchema = z.object({
  password: z.string().nonempty('Senha é obrigatória.'),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro.'),
});
