// src/middlewares/user.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, updateUserSchema, idParamSchema } from '../schemas/userSchema';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = registerSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'Dados de registro inválidos.', details: error.errors });
  }
};

export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = loginSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'Dados de login inválidos.', details: error.errors });
  }
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params = idParamSchema.parse(req.params);
    req.body = updateUserSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'Dados de atualização inválidos.', details: error.errors });
  }
};

export const validateUserDeletion = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params = idParamSchema.parse(req.params);
    next();
  } catch (error: any) {
    res.status(400).json({ error: 'ID inválido.', details: error.errors });
  }
};

export default {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateUserDeletion,
};
