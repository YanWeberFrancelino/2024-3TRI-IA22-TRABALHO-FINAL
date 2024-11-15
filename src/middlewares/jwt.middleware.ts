import { RequestHandler } from 'express';
import { verifyJWT } from '../utils/jwtPromise';

export const checkToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  try {
    const decoded = await verifyJWT(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

export default {
  checkToken,
};
