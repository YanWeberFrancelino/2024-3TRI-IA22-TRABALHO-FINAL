import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateEnrollment = (req: Request, res: Response, next: NextFunction) => {
  const enrollmentSchema = z.object({
    curso_id: z.number().int().positive('ID do curso inválido.'),
  });

  try {
    req.body = enrollmentSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'Dados de inscrição inválidos.', details: error.errors });
  }
};

export const validateProgress = (req: Request, res: Response, next: NextFunction) => {
  const progressSchema = z.object({
    aula_id: z.number().int().positive('ID da aula inválido.'),
  });

  try {
    req.body = progressSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'Dados de progresso inválidos.', details: error.errors });
  }
};

export const validateCourseId = (req: Request, res: Response, next: NextFunction) => {
  const courseIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID do curso deve ser um número inteiro positivo.'),
  });

  try {
    req.params = courseIdSchema.parse(req.params);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'ID do curso inválido.', details: error.errors });
  }
};

export default {
  validateEnrollment,
  validateProgress,
  validateCourseId, 
};
